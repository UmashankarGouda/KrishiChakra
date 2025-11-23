#!/usr/bin/env python3
"""
Test different Supabase connection strings to find the working one
"""

import psycopg2
import sys

# Your Supabase project details
PROJECT_REF = "hmkshtavvfnihydfmclh"
PASSWORD = "itsnotwhtuthink"  # Your database password
REGION = "aws-1-ap-south-1"

print("🔍 Testing Supabase Connection Strings...")
print("=" * 70)

# Test different connection formats
test_cases = [
    {
        "name": "Pooler - Transaction Mode (Port 5432)",
        "connection_string": f"postgresql://postgres:{PASSWORD}@{REGION}.pooler.supabase.com:5432/postgres"
    },
    {
        "name": "Pooler - Session Mode (Port 6543)",
        "connection_string": f"postgresql://postgres:{PASSWORD}@{REGION}.pooler.supabase.com:6543/postgres"
    },
    {
        "name": "Pooler with project ref username (Port 5432)",
        "connection_string": f"postgresql://postgres.{PROJECT_REF}:{PASSWORD}@{REGION}.pooler.supabase.com:5432/postgres"
    },
    {
        "name": "Pooler with project ref username (Port 6543)",
        "connection_string": f"postgresql://postgres.{PROJECT_REF}:{PASSWORD}@{REGION}.pooler.supabase.com:6543/postgres"
    },
    {
        "name": "Direct Connection (if hostname works)",
        "connection_string": f"postgresql://postgres:{PASSWORD}@db.{PROJECT_REF}.supabase.co:5432/postgres"
    },
]

successful_connection = None

for i, test in enumerate(test_cases, 1):
    print(f"\n{i}. Testing: {test['name']}")
    print(f"   Connection: {test['connection_string'][:60]}...")
    
    try:
        conn = psycopg2.connect(test['connection_string'])
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        
        print(f"   ✅ SUCCESS!")
        print(f"   📊 PostgreSQL: {version[:80]}...")
        
        # Test pgvector
        cursor.execute("SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector');")
        has_vector = cursor.fetchone()[0]
        
        if has_vector:
            print(f"   ✅ pgvector extension: Installed")
        else:
            print(f"   ⚠️  pgvector extension: NOT installed")
        
        cursor.close()
        conn.close()
        
        successful_connection = test['connection_string']
        print(f"\n   🎉 This connection works! Use this in your .env file")
        break
        
    except psycopg2.OperationalError as e:
        error_msg = str(e).split('\n')[0]
        print(f"   ❌ FAILED: {error_msg}")
    except Exception as e:
        print(f"   ❌ ERROR: {str(e)[:100]}")

print("\n" + "=" * 70)

if successful_connection:
    print("\n✅ WORKING CONNECTION FOUND!")
    print("=" * 70)
    print(f"\nAdd this to your .env file:")
    print(f"\nDATABASE_URL = {successful_connection}")
    print("\n" + "=" * 70)
    sys.exit(0)
else:
    print("\n❌ NO WORKING CONNECTION FOUND")
    print("=" * 70)
    print("\n🔧 Troubleshooting Steps:")
    print("1. Verify your password is correct:")
    print("   https://supabase.com/dashboard/project/hmkshtavvfnihydfmclh/settings/database")
    print("\n2. Check if your database password was ever set")
    print("   (You may need to generate a new password)")
    print("\n3. Ensure your Supabase project is active and not paused")
    print("\n4. Try resetting the database password and run this script again")
    sys.exit(1)
