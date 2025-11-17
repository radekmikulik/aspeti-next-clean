import requests
import json
import time
import sys

VERCEL_TOKEN = "70AZrunrlHXibmNs11TBBxcu"
VERCEL_USER_ID = "Tmt0DMpxX86ulXHaNUmlCgrs"

def create_vercel_project():
    """Vytvoří nebo najde Vercel projekt"""
    print("Vytvářím Vercel projekt...")
    
    list_url = "https://api.vercel.com/v9/projects"
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "Content-Type": "application/json"
    }
    params = {"teamId": VERCEL_USER_ID}
    
    response = requests.get(list_url, headers=headers, params=params)
    if response.status_code == 200:
        projects = response.json().get("projects", [])
        for proj in projects:
            if proj["name"] == "aspeti-next-clean":
                print(f"Projekt už existuje: {proj['id']}")
                return proj
    
    create_url = "https://api.vercel.com/v10/projects"
    data = {
        "name": "aspeti-next-clean",
        "framework": "nextjs",
        "gitRepository": {
            "type": "github",
            "repo": "radekmikulik/aspeti-next-clean"
        }
    }
    
    response = requests.post(create_url, headers=headers, params=params, json=data)
    if response.status_code in [200, 201]:
        project = response.json()
        print(f"Projekt vytvořen: {project['id']}")
        return project
    else:
        print(f"Chyba: {response.status_code} - {response.text}")
        return None

def trigger_deployment():
    """Spustí deployment"""
    print("Spouštím deployment...")
    
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
    
    response = requests.post(url, headers=headers, params=params, json=data)
    if response.status_code in [200, 201]:
        deployment = response.json()
        deployment_url = deployment.get("url", "")
        deployment_id = deployment.get("id", "")
        print(f"Deployment spuštěn: {deployment_id}")
        print(f"URL: https://{deployment_url}")
        return f"https://{deployment_url}", deployment_id
    else:
        print(f"Chyba: {response.status_code} - {response.text}")
        return None, None

def wait_for_deployment(deployment_id):
    """Čeká na dokončení deploymentu"""
    print("Čekám na dokončení deploymentu...")
    
    url = f"https://api.vercel.com/v13/deployments/{deployment_id}"
    headers = {"Authorization": f"Bearer {VERCEL_TOKEN}"}
    params = {"teamId": VERCEL_USER_ID}
    
    for i in range(60):
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            deployment = response.json()
            state = deployment.get("readyState", "")
            
            if state == "READY":
                print(f"Deployment dokončen!")
                return deployment.get("url", "")
            elif state == "ERROR":
                print(f"Deployment selhal!")
                return None
            else:
                print(f"Stav: {state} ({i*5}s)")
        
        time.sleep(5)
    
    print("Timeout - deployment trvá příliš dlouho")
    return None

project = create_vercel_project()
if not project:
    sys.exit(1)

deployment_url, deployment_id = trigger_deployment()
if not deployment_url:
    sys.exit(1)

final_url = wait_for_deployment(deployment_id)
if final_url:
    print("="*60)
    print(f"DEPLOYMENT ÚSPĚŠNÝ")
    print(f"Production URL: https://{final_url}")
    print("="*60)
    with open("/workspace/deployment_url.txt", "w") as f:
        f.write(f"https://{final_url}")
else:
    sys.exit(1)
