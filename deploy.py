#!/usr/bin/env python3
"""
Automatizovaný deployment skript pro aspeti-next-clean na Vercel
Vyžaduje: GITHUB_TOKEN, VERCEL_TOKEN, VERCEL_USER_ID
"""

import os
import sys
import json
import requests
import subprocess
from typing import Dict, Any

# Credentials z environment variables
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
VERCEL_TOKEN = os.getenv("VERCEL_TOKEN") 
VERCEL_USER_ID = os.getenv("VERCEL_USER_ID")
VERCEL_ORG_ID = os.getenv("VERCEL_ORG_ID")

PROJECT_DIR = "/workspace/aspeti-next-clean"
GITHUB_USER = "radekmikulik"
REPO_NAME = "aspeti-next-clean"

def check_credentials():
    """Ověří, že všechny potřebné credentials jsou k dispozici"""
    missing = []
    if not GITHUB_TOKEN:
        missing.append("GITHUB_TOKEN")
    if not VERCEL_TOKEN:
        missing.append("VERCEL_TOKEN")
    if not VERCEL_USER_ID and not VERCEL_ORG_ID:
        missing.append("VERCEL_USER_ID nebo VERCEL_ORG_ID")
    
    if missing:
        print(f"❌ Chybí credentials: {', '.join(missing)}")
        return False
    return True

def create_github_repo() -> bool:
    """Vytvoří GitHub repozitář"""
    print(f"📦 Vytvářím GitHub repo: {GITHUB_USER}/{REPO_NAME}")
    
    url = "https://api.github.com/user/repos"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "name": REPO_NAME,
        "private": True,
        "description": "ASPETi poskytovatelský účet - Next.js App Router projekt"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        print(f"✅ Repo vytvořeno: {response.json()['html_url']}")
        return True
    elif response.status_code == 422 and "already exists" in response.text:
        print(f"ℹ️  Repo už existuje")
        return True
    else:
        print(f"❌ Chyba při vytváření repo: {response.status_code}")
        print(response.text)
        return False

def push_to_github() -> bool:
    """Push kódu na GitHub"""
    print(f"🚀 Pushing na GitHub...")
    
    os.chdir(PROJECT_DIR)
    
    commands = [
        f"git remote add origin https://{GITHUB_TOKEN}@github.com/{GITHUB_USER}/{REPO_NAME}.git",
        "git branch -M main",
        "git push -u origin main --force"
    ]
    
    for cmd in commands:
        # Skrýt token v logu
        display_cmd = cmd.replace(GITHUB_TOKEN, "***TOKEN***")
        print(f"  $ {display_cmd}")
        
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode != 0 and "already exists" not in result.stderr:
            print(f"❌ Chyba: {result.stderr}")
            # Pokračuj i při chybě "remote already exists"
            if "remote origin already exists" not in result.stderr:
                return False
    
    print(f"✅ Kód pushnut na GitHub")
    return True

def create_vercel_project() -> Dict[str, Any]:
    """Vytvoří Vercel projekt"""
    print(f"🌐 Vytvářím Vercel projekt: aspeti-next-clean")
    
    url = "https://api.vercel.com/v10/projects"
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "Content-Type": "application/json"
    }
    
    team_id = VERCEL_ORG_ID if VERCEL_ORG_ID else VERCEL_USER_ID
    params = {"teamId": team_id} if team_id else {}
    
    data = {
        "name": "aspeti-next-clean",
        "framework": "nextjs",
        "gitRepository": {
            "type": "github",
            "repo": f"{GITHUB_USER}/{REPO_NAME}"
        },
        "buildCommand": "next build",
        "installCommand": "pnpm install",
        "outputDirectory": ".next",
        "nodeVersion": "20.x"
    }
    
    response = requests.post(url, headers=headers, params=params, json=data)
    
    if response.status_code in [200, 201]:
        project = response.json()
        print(f"✅ Vercel projekt vytvořen: {project.get('id')}")
        return project
    else:
        print(f"❌ Chyba při vytváření projektu: {response.status_code}")
        print(response.text)
        return {}

def trigger_deployment(project_id: str) -> str:
    """Spustí deployment"""
    print(f"🚢 Spouštím deployment...")
    
    url = f"https://api.vercel.com/v13/deployments"
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "Content-Type": "application/json"
    }
    
    team_id = VERCEL_ORG_ID if VERCEL_ORG_ID else VERCEL_USER_ID
    params = {"teamId": team_id} if team_id else {}
    
    data = {
        "name": "aspeti-next-clean",
        "gitSource": {
            "type": "github",
            "repo": f"{GITHUB_USER}/{REPO_NAME}",
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
        print(f"✅ Deployment spuštěn: https://{deployment_url}")
        return f"https://{deployment_url}"
    else:
        print(f"❌ Chyba při deployment: {response.status_code}")
        print(response.text)
        return ""

def main():
    """Hlavní funkce"""
    print("=" * 60)
    print("🚀 ASPETI-NEXT-CLEAN DEPLOYMENT SKRIPT")
    print("=" * 60)
    
    if not check_credentials():
        sys.exit(1)
    
    # 1. Vytvoř GitHub repo
    if not create_github_repo():
        sys.exit(1)
    
    # 2. Push kód
    if not push_to_github():
        sys.exit(1)
    
    # 3. Vytvoř Vercel projekt
    project = create_vercel_project()
    if not project:
        print("⚠️  Pokračuji i bez vytvoření projektu (možná už existuje)")
    
    # 4. Trigger deployment
    deployment_url = trigger_deployment(project.get("id", ""))
    
    if deployment_url:
        print("\n" + "=" * 60)
        print(f"✅ DEPLOYMENT ÚSPĚŠNÝ")
        print(f"🌐 URL: {deployment_url}")
        print("=" * 60)
    else:
        print("\n❌ Deployment selhal. Zkuste nasadit ručně přes Vercel UI.")
        sys.exit(1)

if __name__ == "__main__":
    main()
