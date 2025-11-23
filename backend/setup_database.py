#!/usr/bin/env python3
"""
PostgreSQL Database Setup and Connection Test
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

def create_database():
    """Create the krishichakra database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (to postgres database)
        print("🔌 Connecting to PostgreSQL server...")
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="2005",  # Your password
            database="postgres"  # Connect to default postgres database first
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname='krishichakra'")
        exists = cur.fetchone()
        
        if exists:
            print("✅ Database 'krishichakra' already exists")
        else:
            # Create the database
            print("📊 Creating database 'krishichakra'...")
            cur.execute("CREATE DATABASE krishichakra")
            print("✅ Database 'krishichakra' created successfully!")
        
        cur.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database creation error: {e}")
        return False

def test_krishichakra_connection():
    """Test connection to the krishichakra database"""
    try:
        print("🔌 Testing connection to krishichakra database...")
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="2005",
            database="krishichakra"
        )
        
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"✅ Connected successfully!")
        print(f"📝 PostgreSQL version: {version[0]}")
        
        # Test creating a simple table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS connection_test (
                id SERIAL PRIMARY KEY,
                test_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cur.execute("INSERT INTO connection_test (test_message) VALUES (%s)", ("RAG System Test",))
        conn.commit()
        
        cur.execute("SELECT * FROM connection_test ORDER BY created_at DESC LIMIT 1")
        result = cur.fetchone()
        print(f"✅ Database write test successful: {result}")
        
        # Clean up test table
        cur.execute("DROP TABLE connection_test")
        conn.commit()
        
        cur.close()
        conn.close()
        print("✅ All database tests passed!")
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database connection error: {e}")
        return False

def setup_pgvector_extension():
    """Setup pgvector extension for vector operations"""
    try:
        print("🔧 Setting up pgvector extension...")
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="2005",
            database="krishichakra"
        )
        
        cur = conn.cursor()
        
        # Check if pgvector extension exists
        cur.execute("SELECT 1 FROM pg_available_extensions WHERE name='vector'")
        available = cur.fetchone()
        
        if available:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
            conn.commit()
            print("✅ pgvector extension enabled!")
        else:
            print("⚠️  pgvector extension not available - vector operations will be limited")
            
        cur.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"⚠️  pgvector setup warning: {e}")
        print("   Vector operations may be limited, but basic functionality will work")
        return False

if __name__ == "__main__":
    print("🌾 KrishiChakra Database Setup")
    print("=" * 50)
    
    # Step 1: Create database
    if not create_database():
        print("❌ Failed to create database. Please check your PostgreSQL installation.")
        sys.exit(1)
    
    # Step 2: Test connection
    if not test_krishichakra_connection():
        print("❌ Failed to connect to krishichakra database.")
        sys.exit(1)
    
    # Step 3: Setup pgvector (optional)
    setup_pgvector_extension()
    
    print("\n🎉 Database setup completed successfully!")
    print("📊 Connection string: postgresql://postgres:2005@localhost:5432/krishichakra")
    print("🚀 Ready to start the RAG system!")