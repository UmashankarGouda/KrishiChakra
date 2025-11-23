#!/usr/bin/env python3
"""
Supabase Setup and Connection Test Script
This helps you configure and test your Supabase connection for RAG
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv, set_key

def update_env_file():
    """Interactive setup to update .env with database password"""
    print("🔧 Supabase RAG Setup Wizard")
    print("=" * 60)
    
    # Load existing .env
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(env_path)
    
    print("\n📋 Current Configuration:")
    print(f"   Supabase URL: {os.getenv('SUPABASE_URL', 'Not set')}")
    print(f"   Supabase Key: {os.getenv('SUPABASE_KEY', 'Not set')[:50]}...")
    
    # Get database password
    print("\n🔑 Database Password Setup")
    print("=" * 60)
    print("ℹ️  You need to get your database password from Supabase:")
    print("   1. Go to: https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh/settings/database")
    print("   2. Scroll to 'Database Password' section")
    print("   3. Click 'Generate new password' or use existing one")
    print()
    
    password = input("Enter your Supabase database password: ").strip()
    
    if not password:
        print("❌ Password cannot be empty!")
        sys.exit(1)
    
    # Construct DATABASE_URL (using direct connection, not pooler)
    # Direct connection is more reliable for SQLAlchemy
    db_url = f"postgresql://postgres:{password}@db.hmkshtavvfnihydfmclh.supabase.co:5432/postgres"
    
    # Update .env file
    set_key(env_path, "DATABASE_URL", db_url)
    
    print("\n✅ .env file updated successfully!")
    return db_url

def test_connection(db_url: str):
    """Test connection to Supabase database"""
    print("\n🔍 Testing Database Connection...")
    print("=" * 60)
    
    try:
        # Create engine
        engine = create_engine(db_url, echo=False)
        
        # Test connection
        with engine.connect() as conn:
            # Basic query
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            
            print(f"✅ Connection successful!")
            print(f"📊 PostgreSQL Version: {version[:50]}...")
            
            # Check for pgvector extension
            result = conn.execute(text(
                "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector');"
            ))
            has_vector = result.fetchone()[0]
            
            if has_vector:
                print("✅ pgvector extension is installed")
            else:
                print("⚠️  pgvector extension NOT found")
                print("   Run the migration SQL in Supabase SQL Editor:")
                print("   https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh/sql/new")
            
            # Check for RAG tables
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('rotation_patterns', 'crop_yields', 'research_documents')
                ORDER BY table_name;
            """))
            tables = [row[0] for row in result.fetchall()]
            
            if tables:
                print(f"✅ RAG tables found: {', '.join(tables)}")
            else:
                print("⚠️  No RAG tables found")
                print("   Run the migration SQL: supabase_rag_migration.sql")
            
            return True
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("   1. Check your password is correct")
        print("   2. Ensure your Supabase project is active")
        print("   3. Check network connectivity")
        return False

def main():
    """Main setup flow"""
    print("\n🌾 KrishiChakra - Supabase RAG Setup")
    print("=" * 60)
    
    # Check if DATABASE_URL already exists
    load_dotenv()
    existing_url = os.getenv('DATABASE_URL')
    
    if existing_url and '[YOUR-DB-PASSWORD]' not in existing_url:
        print("✅ Database URL already configured")
        print(f"   URL: {existing_url[:60]}...")
        
        response = input("\nDo you want to reconfigure? (y/N): ").strip().lower()
        if response != 'y':
            db_url = existing_url
        else:
            db_url = update_env_file()
    else:
        db_url = update_env_file()
    
    # Test connection
    success = test_connection(db_url)
    
    if success:
        print("\n🎉 Setup Complete!")
        print("=" * 60)
        print("📋 Next Steps:")
        print("   1. Run migration SQL in Supabase SQL Editor (if not done)")
        print("   2. Load knowledge base: python load_knowledge_base.py")
        print("   3. Start server: python main.py")
        print("   4. Test RAG: python test_rag_system.py")
        print("\n🔗 Supabase Dashboard:")
        print("   https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh")
    else:
        print("\n❌ Setup incomplete - please fix errors and try again")
        sys.exit(1)

if __name__ == "__main__":
    main()
