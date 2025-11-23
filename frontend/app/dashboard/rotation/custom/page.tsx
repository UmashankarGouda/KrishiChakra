"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Zap, Sprout, MapPin, Calendar, TrendingUp, Loader2, CheckCircle, DollarSign, AlertTriangle, Lightbulb, Download } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { FieldBatch } from "@/lib/types"
import { getFieldBatches } from "@/lib/supabase"
import { generateCustomPlan, generateCustomPlanWithBhuvan, CropRotationPlan } from "@/lib/rag-service"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import jsPDF from 'jspdf'

export default function CustomPlanPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const preSelectedFieldId = searchParams.get('field')
  
  const [fieldBatches, setFieldBatches] = useState<FieldBatch[]>([])
  const [selectedField, setSelectedField] = useState<FieldBatch | null>(null)
  const [planningYears, setPlanningYears] = useState("3")
  const [specificRequirements, setSpecificRequirements] = useState("")
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generatedPlan, setGeneratedPlan] = useState<CropRotationPlan | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [bhuvanLoading, setBhuvanLoading] = useState(false)
  const [rawBhuvan, setRawBhuvan] = useState<any>(null)

  // Load field batches from Supabase
  useEffect(() => {
    const loadFieldBatches = async () => {
      if (!user?.id) return
      
      setLoading(true)
      const { data, error } = await getFieldBatches(user.id)
      
      if (error) {
        console.error('Error loading field batches:', error)
      } else {
        setFieldBatches(data || [])
        
        // Auto-select field if provided in URL
        if (preSelectedFieldId && data) {
          const preSelected = data.find(field => field.id === preSelectedFieldId)
          if (preSelected) {
            setSelectedField(preSelected)
          }
        }
      }
      setLoading(false)
    }

    loadFieldBatches()
  }, [user?.id])

  const handleGeneratePlan = async () => {
    if (!selectedField) return
    
    setGenerating(true)
    setBhuvanLoading(true)
    
    try {
      const plan = await generateCustomPlanWithBhuvan({
        field: selectedField,
        planningYears: parseInt(planningYears),
        specificRequirements: specificRequirements || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
      })
      
      setGeneratedPlan(plan)
      // Dump raw Bhuvan data as trash (debug)
      // We keep it separate and optional for dev-only inspection
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setRawBhuvan((plan as any).rawBhuvan ?? null)
    } catch (error) {
      console.error('Error generating plan:', error)
    } finally {
      setGenerating(false)
      setBhuvanLoading(false)
    }
  }

  const handleGetLocation = () => {
    setGeoLoading(true)
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.')
      setGeoLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude)
        setLongitude(pos.coords.longitude)
        setGeoLoading(false)
      },
      (err) => {
        console.error('Failed to get location', err)
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const downloadPDF = () => {
    if (!generatedPlan || !selectedField) return

    const doc = new jsPDF()
    let yPos = 20

    // Title
    doc.setFontSize(20)
    doc.setTextColor(34, 197, 94) // Green color
    doc.text('3-Year Crop Rotation Plan', 105, yPos, { align: 'center' })
    yPos += 15

    // Field Information
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Field: ${selectedField.name}`, 20, yPos)
    yPos += 7
    doc.text(`Location: ${selectedField.location}`, 20, yPos)
    yPos += 7
    doc.text(`Size: ${selectedField.size} acres`, 20, yPos)
    yPos += 7
    doc.text(`Soil Type: ${selectedField.soil_type}`, 20, yPos)
    yPos += 7
    doc.text(`Climate Zone: ${selectedField.climate_zone}`, 20, yPos)
    yPos += 12

    // Separator
    doc.setDrawColor(34, 197, 94)
    doc.line(20, yPos, 190, yPos)
    yPos += 10

    // Crop Schedule Header
    doc.setFontSize(16)
    doc.setTextColor(34, 197, 94)
    doc.text('Crop Schedule', 20, yPos)
    yPos += 10

    // Crop Table
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    generatedPlan.crops.forEach((crop, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Year ${crop.year}: ${crop.crop}`, 20, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Expected Yield: ${crop.expected_yield || 'N/A'}`, 30, yPos)
      yPos += 6
      doc.text(`Planting Season: ${crop.season}`, 30, yPos)
      yPos += 6

      if (crop.soil_benefits && crop.soil_benefits.length > 0) {
        doc.text('Benefits:', 30, yPos)
        yPos += 6
        crop.soil_benefits.forEach((benefit: string) => {
          const lines = doc.splitTextToSize(`• ${benefit}`, 150)
          lines.forEach((line: string) => {
            if (yPos > 270) {
              doc.addPage()
              yPos = 20
            }
            doc.text(line, 35, yPos)
            yPos += 5
          })
        })
      }
      yPos += 5
    })

    // Expected Profit
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }
    yPos += 5
    doc.setFontSize(14)
    doc.setTextColor(34, 197, 94)
    doc.text('Expected Profit', 20, yPos)
    yPos += 8
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(generatedPlan.profitEstimate, 20, yPos)
    yPos += 12

    // Overall Benefits
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(34, 197, 94)
    doc.text('Overall Benefits', 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    generatedPlan.overallBenefits.forEach((benefit: string) => {
      const lines = doc.splitTextToSize(`• ${benefit}`, 170)
      lines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, 20, yPos)
        yPos += 6
      })
    })
    yPos += 7

    // Risk Assessment
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(220, 38, 38) // Red color
    doc.text('Risk Assessment', 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const riskLines = doc.splitTextToSize(generatedPlan.riskAssessment, 170)
    riskLines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 20, yPos)
      yPos += 6
    })
    yPos += 7

    // Recommendations
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(34, 197, 94)
    doc.text('Recommendations', 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    generatedPlan.recommendations.forEach((rec: string, index: number) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170)
      lines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, 20, yPos)
        yPos += 6
      })
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(`KrishiChakra - Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' })
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
    }

    // Save the PDF
    doc.save(`${selectedField.name}_Crop_Rotation_Plan.pdf`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading your field batches...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard/rotation">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center drop-shadow-sm">
                <Zap className="mr-4 h-10 w-10 text-orange-600" />
                Create Custom Rotation Plan
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Generate AI-powered crop rotation plans tailored to your specific fields
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Field Selection */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                <Sprout className="mr-3 h-6 w-6 text-green-600" />
                Select Field Batch
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose the field for which you want to generate a custom rotation plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fieldBatches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No field batches found</p>
                  <Link href="/dashboard">
                    <Button>Add Field Batches</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fieldBatches.map((field) => (
                    <Card 
                      key={field.id} 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedField?.id === field.id 
                          ? 'ring-2 ring-green-500 bg-green-50' 
                          : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedField(field)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{field.name}</h3>
                            <p className="text-sm text-gray-600">{field.location}</p>
                            <p className="text-sm text-gray-700">
                              {field.current_crop ? `${field.current_crop} • ` : ""}{field.size} hectares
                            </p>
                          </div>
                          <Badge 
                            variant={field.status === "active" ? "default" : "secondary"}
                            className={field.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {field.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Soil:</span>
                            <span className="font-medium">{field.soil_type}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Season:</span>
                            <span className="font-medium">{field.season}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Climate:</span>
                            <span className="font-medium">{field.climate_zone}</span>
                          </div>
                        </div>

                        {field.notes && (
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-3">{field.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Planning Parameters */}
          {selectedField && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                  <Calendar className="mr-3 h-6 w-6 text-blue-600" />
                  Planning Parameters
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Customize your rotation plan requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Planning Duration</label>
                  <Select value={planningYears} onValueChange={setPlanningYears}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select planning duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year Plan</SelectItem>
                      <SelectItem value="2">2 Year Plan</SelectItem>
                      <SelectItem value="3">3 Year Plan (Recommended)</SelectItem>
                      <SelectItem value="5">5 Year Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Specific Requirements (Optional)</label>
                  <Textarea
                    placeholder="e.g., Focus on nitrogen-fixing crops, maximize profit, organic farming, water conservation, etc."
                    value={specificRequirements}
                    onChange={(e) => setSpecificRequirements(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Selected Field Summary & Generate */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                <MapPin className="mr-3 h-5 w-5 text-purple-600" />
                Plan Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedField ? (
                <>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Selected Field</h4>
                      <p className="text-green-700 font-medium">{selectedField.name}</p>
                      <p className="text-sm text-green-600">{selectedField.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-blue-800">Size</p>
                        <p className="text-sm font-bold text-blue-700">{selectedField.size} ha</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-orange-800">Duration</p>
                        <p className="text-sm font-bold text-orange-700">{planningYears} years</p>
                      </div>
                    </div>

                    {/* Geolocation */}
                    <div className="mt-2 bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-purple-800">Location</p>
                          <p className="text-xs text-purple-700">
                            {latitude && longitude ? (
                              <>Lat: {latitude.toFixed(5)}, Lon: {longitude.toFixed(5)}</>
                            ) : (
                              <>Not set</>
                            )}
                          </p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleGetLocation} disabled={geoLoading}>
                          {geoLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting...
                            </>
                          ) : (
                            <>
                              <MapPin className="mr-2 h-4 w-4" /> Get my location
                            </>
                          )}
                        </Button>
                      </div>
                      {bhuvanLoading && (
                        <p className="text-xs text-purple-700 mt-2">
                          fetching data from ISRO's Bhuvan...
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-800">Field Characteristics</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Soil Type:</span>
                          <span className="font-medium">{selectedField.soil_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Season:</span>
                          <span className="font-medium">{selectedField.season}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Climate:</span>
                          <span className="font-medium">{selectedField.climate_zone}</span>
                        </div>
                        {selectedField.current_crop && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Crop:</span>
                            <span className="font-medium">{selectedField.current_crop}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {specificRequirements && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-800">Requirements</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{specificRequirements}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <Button 
                    onClick={handleGeneratePlan}
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Generate AI Plan
                      </>
                    )}
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">AI-Powered Analysis</p>
                        <p className="text-xs text-blue-600">
                          Our system will analyze your field characteristics, soil type, climate, and historical data 
                          to create an optimized {planningYears}-year rotation plan.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a field batch to start creating your custom rotation plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Plan Results */}
      {generatedPlan && (
        <div className="mt-8 space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                <CheckCircle className="mr-3 h-6 w-6 text-green-600" />
                Generated Rotation Plan
              </CardTitle>
              <CardDescription className="text-gray-600">
                AI-generated {generatedPlan.planningYears}-year rotation plan for {selectedField?.name}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Crop Schedule */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-800">
                <Calendar className="mr-3 h-5 w-5 text-blue-600" />
                Crop Rotation Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {generatedPlan.crops && generatedPlan.crops.map((crop, index) => (
                  <div key={index} className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-3">
                          Year {crop.year} - {crop.season}
                        </Badge>
                        <h4 className="text-lg font-semibold text-gray-800">{crop.crop}</h4>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {crop.expected_yield}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{crop.reason}</p>
                    <div className="flex flex-wrap gap-2">
                      {crop.soil_benefits && crop.soil_benefits.map((benefit, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Benefits & Profit */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-bold text-gray-800">
                  <TrendingUp className="mr-3 h-5 w-5 text-green-600" />
                  Expected Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Estimated Profit</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{generatedPlan.profitEstimate}</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800">Overall Benefits:</h5>
                  <ul className="space-y-1">
                    {generatedPlan.overallBenefits && generatedPlan.overallBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Risk & Recommendations */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-bold text-gray-800">
                  <AlertTriangle className="mr-3 h-5 w-5 text-orange-600" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-orange-800 mb-1">Risk Level</p>
                  <p className="text-orange-700">{generatedPlan.riskAssessment}</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                    Recommendations:
                  </h5>
                  <ul className="space-y-1">
                    {generatedPlan.recommendations && generatedPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={() => setGeneratedPlan(null)}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Generate Another Plan
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save This Plan
                </Button>
                <Button variant="outline" onClick={downloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug: dump raw Bhuvan data as trash */}
          {rawBhuvan && (
            <Card className="bg-white/60 border border-red-200">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-red-700">
                  Debug (Trash): Raw Bhuvan API Response
                </CardTitle>
                <CardDescription className="text-xs text-red-500">
                  For development only. This data is not used directly in the plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-72 bg-red-50 p-3 rounded">
{JSON.stringify(rawBhuvan, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}