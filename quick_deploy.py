#!/usr/bin/env python3
"""
Quick deployment to aspeti-next-clean-prod.vercel.app
"""
import requests
import json
import time
import sys

VERCEL_TOKEN = "70AZrunrlHXibmNs11TBBxcu"
VERCEL_USER_ID = "Tmt0DMpxX86ulXHaNUmlCgrs"

def trigger_deployment():
    """Spustí deployment přes Vercel API"""
    print("🚀 Spouštím deployment na aspeti-next-clean-prod...")
    
    url = "https://api.vercel.com/v13/deployments"
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "Content-Type": "application/json"
    }
    params = {"teamId": VERCEL_USER_ID}
    
    data = {
        "name": "aspeti-next-clean",
        "gitSource": {
            "type": "github",
            "repo": "radekmikulik/aspeti-next-clean",
            "ref": "main"
        },
        "projectSettings": {
            "framework": "nextjs",
            "nodeVersion": "20.x"
        }
    }
    
    print("📡 Odesílám request na Vercel API...")
    response = requests.post(url, headers=headers, params=params, json=data)
    
    if response.status_code in [200, 201]:
        deployment = response.json()
        deployment_url = deployment.get("url", "")
        deployment_id = deployment.get("id", "")
        
        print(f"✅ Deployment spuštěn!")
        print(f"🆔 Job ID: {deployment_id}")
        print(f"🌐 Deployment URL: https://{deployment_url}")
        
        return deployment_id, f"https://{deployment_url}"
    else:
        print(f"❌ Chyba při deployment: {response.status_code}")
        print(f"📄 Response: {response.text}")
        return None, None

def wait_for_deployment(deployment_id, timeout=300):
    """Čeká na dokončení deploymentu"""
    print("⏳ Čekám na dokončení deploymentu...")
    
    url = f"https://api.vercel.com/v13/deployments/{deployment_id}"
    headers = {"Authorization": f"Bearer {VERCEL_TOKEN}"}
    params = {"teamId": VERCEL_USER_ID}
    
    for i in range(int(timeout/5)):
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                deployment = response.json()
                state = deployment.get("readyState", "")
                
                print(f"📊 Stav deploymentu: {state} ({i*5}s)")
                
                if state == "READY":
                    print("🎉 Deployment ÚSPĚŠNĚ DOKONČEN!")
                    final_url = deployment.get("url", "")
                    return f"https://{final_url}"
                elif state == "ERROR":
                    print("❌ Deployment SELHAL!")
                    error = deployment.get("errorMessage", "Unknown error")
                    print(f"💥 Chyba: {error}")
                    return None
            else:
                print(f"⚠️ API response: {response.status_code}")
                
        except Exception as e:
            print(f"⚠️ Chyba při kontrole: {e}")
        
        time.sleep(5)
    
    print("⏰ Timeout - deployment trvá příliš dlouho")
    return None

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 ASPETI CLEAN DEPLOYMENT")
    print("=" * 60)
    
    # Trigger deployment
    deployment_id, deployment_url = trigger_deployment()
    if not deployment_id:
        print("❌ Nepodařilo se spustit deployment")
        sys.exit(1)
    
    # Wait for completion
    final_url = wait_for_deployment(deployment_id)
    
    if final_url:
        print("\n" + "=" * 60)
        print("🎉 DEPLOYMENT ÚSPĚŠNĚ DOKONČEN!")
        print(f"🌐 Production URL: {final_url}")
        print("=" * 60)
        
        # Save URL to file
        with open("/workspace/deployment_final_url.txt", "w") as f:
            f.write(final_url)
            
        print("📁 URL uložena do deployment_final_url.txt")
    else:
        print("\n❌ Deployment se nepodařilo dokončit")
        sys.exit(1)