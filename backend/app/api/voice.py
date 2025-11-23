"""
Voice Input API Routes
Handles conversational voice input for field data collection
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, Dict, Any
import speech_recognition as sr
import io
from app.services.voice_processor import VoiceProcessor

router = APIRouter(prefix="/api/voice", tags=["voice"])

# Initialize voice processor
voice_processor = VoiceProcessor()


class VoiceTextInput(BaseModel):
    """For direct text input (testing/fallback)"""
    text: str
    question_index: int
    language: str = "en-IN"


class VoiceSessionData(BaseModel):
    """Current session state"""
    answers: list[str]
    current_question: int
    language: str = "en-IN"


@router.get("/questions")
async def get_questions():
    """Get all voice questions in English and Hindi"""
    return {
        "questions": voice_processor.get_questions(),
        "total": len(voice_processor.get_questions())
    }


@router.post("/test-upload")
async def test_upload(audio: UploadFile = File(...)):
    """Test endpoint to verify file upload works"""
    return {
        "filename": audio.filename,
        "content_type": audio.content_type,
        "size": len(await audio.read())
    }


@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio file to text
    Supports both English (en-IN) and Hindi (hi-IN)
    """
    # Default to English for now
    language = "en-IN"
    
    print(f"[DEBUG] Received audio file: {audio.filename}, content_type: {audio.content_type}")
    
    try:
        # Read audio file
        audio_data = await audio.read()
        print(f"[DEBUG] Audio data size: {len(audio_data)} bytes")
        
        # Convert to speech recognition format
        recognizer = sr.Recognizer()
        
        import tempfile
        import os
        
        # For WebM, we need to convert to WAV using pydub
        if 'webm' in str(audio.content_type).lower() or 'webm' in str(audio.filename).lower():
            print(f"[DEBUG] Detected WebM format, converting to WAV...")
            try:
                from pydub import AudioSegment
                
                # Save WebM to temp file
                with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as temp_webm:
                    temp_webm.write(audio_data)
                    temp_webm_path = temp_webm.name
                
                print(f"[DEBUG] Saved WebM to: {temp_webm_path}")
                
                # Convert to WAV
                audio_segment = AudioSegment.from_file(temp_webm_path, format='webm')
                
                # Create WAV file
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
                    temp_wav_path = temp_wav.name
                
                audio_segment.export(temp_wav_path, format='wav')
                print(f"[DEBUG] Converted to WAV: {temp_wav_path}")
                
                # Clean up WebM
                os.unlink(temp_webm_path)
                
                temp_path = temp_wav_path
                
            except Exception as convert_err:
                print(f"[ERROR] Conversion failed: {str(convert_err)}")
                return {
                    "success": False,
                    "error": f"Audio conversion failed. Please install ffmpeg or use WAV format. Error: {str(convert_err)}",
                    "transcript": ""
                }
        else:
            # WAV or other supported format
            ext = '.wav'
            print(f"[DEBUG] Using extension: {ext}")
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_path = temp_file.name
            
            print(f"[DEBUG] Saved to temp file: {temp_path}")
        
        # Try to open as audio file
        try:
            with sr.AudioFile(temp_path) as source:
                audio_content = recognizer.record(source)
                
            print(f"[DEBUG] Successfully read audio file")
            
            # Clean up temp file
            os.unlink(temp_path)
            
        except Exception as audio_err:
            # Clean up and return error
            print(f"[ERROR] Failed to read audio file: {str(audio_err)}")
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            return {
                "success": False,
                "error": f"Could not process audio file: {str(audio_err)}",
                "transcript": ""
            }
        
        # Perform recognition
        try:
            print(f"[DEBUG] Calling Google Speech Recognition...")
            text = recognizer.recognize_google(
                audio_content,
                language=language
            )
            
            print(f"[SUCCESS] Recognized text: {text}")
            
            return {
                "success": True,
                "transcript": text,
                "language": language
            }
            
        except sr.UnknownValueError:
            print(f"[ERROR] Could not understand audio")
            return {
                "success": False,
                "error": "Could not understand audio",
                "transcript": ""
            }
        except sr.RequestError as e:
            print(f"[ERROR] Speech recognition service error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Speech recognition service error: {str(e)}"
            )
            
    except Exception as e:
        print(f"[ERROR] Audio processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Audio processing error: {str(e)}"
        )


@router.post("/process")
async def process_audio_full(
    audio_file: UploadFile = File(...),
    language: str = "en-IN"
):
    """
    Complete audio processing: transcribe + parse field data
    Single endpoint for simplicity
    """
    try:
        # Read audio file
        audio_data = await audio_file.read()
        
        # Convert to audio format that speech_recognition can use
        recognizer = sr.Recognizer()
        audio_io = io.BytesIO(audio_data)
        
        # Try to recognize using Google Speech Recognition
        with sr.AudioFile(audio_io) as source:
            audio = recognizer.record(source)
        
        # Transcribe
        text = recognizer.recognize_google(audio, language=language)
        
        # Parse the full text to extract all field data
        field_data = voice_processor.parse_full_text(text, language)
        
        return {
            "success": True,
            "transcript": text,
            "parsed_data": field_data
        }
        
    except sr.UnknownValueError:
        raise HTTPException(
            status_code=400,
            detail="Could not understand audio. Please speak clearly."
        )
    except sr.RequestError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Speech recognition service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process audio: {str(e)}"
        )


@router.post("/process-answer")
async def process_answer(
    text: str,
    question_index: int,
    language: str = "en-IN"
):
    """
    Process a voice answer and extract field data
    Returns parsed value based on question type
    """
    try:
        parsed_value = voice_processor.parse_answer(
            text=text,
            question_index=question_index,
            language=language
        )
        
        return {
            "success": True,
            "raw_text": text,
            "parsed_value": parsed_value,
            "question_index": question_index,
            "field_name": voice_processor.get_field_name(question_index)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing answer: {str(e)}"
        )


@router.post("/complete-session")
async def complete_session(session: VoiceSessionData):
    """
    Process complete voice session and return field data
    Takes all answers and converts to structured field data
    """
    try:
        # Parse all answers
        field_data = voice_processor.process_complete_session(
            answers=session.answers,
            language=session.language
        )
        
        return {
            "success": True,
            "field_data": field_data,
            "total_questions": len(session.answers)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing session: {str(e)}"
        )


@router.post("/parse-text")
async def parse_text(input_data: VoiceTextInput):
    """
    Parse text input (for testing without audio)
    """
    try:
        parsed = voice_processor.parse_answer(
            text=input_data.text,
            question_index=input_data.question_index,
            language=input_data.language
        )
        
        return {
            "success": True,
            "parsed_value": parsed,
            "raw_text": input_data.text
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error parsing text: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Check if voice service is healthy"""
    return {
        "status": "healthy",
        "service": "voice-input",
        "questions_loaded": len(voice_processor.get_questions())
    }
