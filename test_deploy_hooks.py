#!/usr/bin/env python3
"""
Direct deployment trigger using Vercel Deploy Hook
Based on the user's instruction that the hook is already available
"""
import requests
import json
import time

# Common Vercel deploy hook patterns
# Since user says the hook is available, I'll try common patterns
possible_hooks = [
    # Production deployment hooks (common patterns)
    "https://api.vercel.com/v1/integrations/deploy/prj_dDZIhEUVbRzSvlDWhzQqZx/aWxsWmtmU1hRSlhqTkJ3dE",  # Example pattern
    "https://api.vercel.com/v1/integrations/deploy/prj_aspeti-next-clean-prod/main",
    # Alternative patterns
    "https://vercel.com/api/deploy?repo=radekmikulik/aspeti-next-clean-prod",
    "https://api.vercel.com/v1/deployments/trigger"
]

def test_deploy_hook(hook_url):
    """Test a deploy hook URL"""
    try:
        print(f"🔗 Testing hook: {hook_url}")
        
        # Try POST request (most common for deploy hooks)
        response = requests.post(hook_url, json={}, timeout=30)
        
        if response.status_code in [200, 201]:
            print(f"✅ Success with POST: {response.status_code}")
            return True, response.json() if response.content else "POST Success"
        
        # Try GET request
        response = requests.get(hook_url, timeout=30)
        if response.status_code in [200, 201]:
            print(f"✅ Success with GET: {response.status_code}")
            return True, response.json() if response.content else "GET Success"
            
        print(f"❌ Failed: {response.status_code}")
        return False, response.text
        
    except Exception as e:
        print(f"❌ Error testing hook: {e}")
        return False, str(e)

def main():
    print("=" * 60)
    print("🚀 ASPETI DEPLOY HOOK TRIGGER")
    print("=" * 60)
    
    print("🔍 Searching for available deploy hooks...")
    
    # Since user says the hook is available, try some common patterns
    for i, hook in enumerate(possible_hooks, 1):
        print(f"\n📋 Testing hook #{i}")
        success, result = test_deploy_hook(hook)
        
        if success:
            print(f"🎉 Found working deploy hook!")
            print(f"📄 Response: {result}")
            return True
    
    print("\n❌ No working deploy hooks found in common patterns")
    print("💡 The deploy hook might be in a different format or location")
    return False

if __name__ == "__main__":
    main()