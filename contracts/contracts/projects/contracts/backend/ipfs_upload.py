import requests
import os
from dotenv import load_dotenv

load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET")

def upload_pdf_to_ipfs(file_path: str) -> str:
    """Upload PDF certificate to IPFS via Pinata"""
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_api_secret": PINATA_API_SECRET,
    }
    
    with open(file_path, "rb") as f:
        files = {"file": f}
        response = requests.post(url, files=files, headers=headers)
    
    if response.status_code == 200:
        ipfs_hash = response.json()["IpfsHash"]
        return f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
    else:
        raise Exception(f"Upload failed: {response.text}")

def upload_metadata_to_ipfs(metadata: dict) -> str:
    """Upload JSON metadata to IPFS via Pinata"""
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_api_secret": PINATA_API_SECRET,
    }
    
    response = requests.post(url, json=metadata, headers=headers)
    
    if response.status_code == 200:
        ipfs_hash = response.json()["IpfsHash"]
        return f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
    else:
        raise Exception(f"Upload failed: {response.text}")
