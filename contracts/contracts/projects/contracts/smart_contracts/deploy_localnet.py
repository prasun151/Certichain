"""
LocalNet Deployment Script for CredentialVerifier Contract
"""
import os
import sys
import json
import base64
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from algokit_utils import AlgorandClient
from algosdk.v2client import algod
from algosdk.atomic_transaction_composer import AtomicTransactionComposer
from algosdk.transaction import StateSchema, ApplicationCreateTxn, wait_for_confirmation


def deploy_to_localnet():
    """Deploy CredentialVerifier contract to LocalNet"""
    
    print("=" * 60)
    print("CredentialVerifier - LocalNet Deployment")
    print("=" * 60)
    
    try:
        # Connect to LocalNet
        print("\n🔗 Connecting to LocalNet...")
        algorand = AlgorandClient.from_environment()
        client = algorand.client.algod
        
        # Check connection
        status = client.status()
        print(f"   ✅ Connected! Round: {status['last-round']}")
        
        # Get deployer account
        deployer_account = algorand.account.from_environment("DEPLOYER")
        print(f"   📦 Deployer: {deployer_account.address}")
        
        # Load compiled contract
        artifact_dir = Path(__file__).parent / "artifacts" / "credential_verifier"
        approval_path = artifact_dir / "CredentialVerifier.approval.teal"
        clear_path = artifact_dir / "CredentialVerifier.clear.teal"
        
        if not approval_path.exists() or not clear_path.exists():
            print(f"\n❌ Compiled contract not found!")
            print(f"   Please run: python -m smart_contracts build")
            return None
        
        # Read TEAL programs
        with open(approval_path, "r") as f:
            approval_program = f.read()
        with open(clear_path, "r") as f:
            clear_program = f.read()
        
        # Compile to bytecode
        print("\n📝 Compiling contract...")
        approval_compiled = client.compile(approval_program)
        clear_compiled = client.compile(clear_program)
        
        # Extract bytecode - algosdk returns base64 encoded
        approval_bytes = base64.b64decode(approval_compiled["result"])
        clear_bytes = base64.b64decode(clear_compiled["result"])
        
        # Create application
        params = client.suggested_params()
        
        txn = ApplicationCreateTxn(
            sender=deployer_account.address,
            approval_program=approval_bytes,
            clear_program=clear_bytes,
            global_schema=StateSchema(0, 0),
            local_schema=StateSchema(0, 0),
            sp=params,
        )
        
        stxn = txn.sign(deployer_account.private_key)
        txid = client.send_transaction(stxn)
        
        # Wait for confirmation
        print("   ⏳ Waiting for confirmation...")
        result = wait_for_confirmation(client, txid, 4)
        app_id = result.get("application-index")
        
        # Success!
        print(f"\n✅ DEPLOYMENT SUCCESSFUL!")
        print("=" * 60)
        print(f"   🎉 App ID: {app_id}")
        print("=" * 60)
        print(f"\n📊 View on LocalNet Explorer:")
        print(f"   http://localhost:8980/application/{app_id}")
        print("\n💾 Save the App ID for your submission!")
        print(f"\n   📌 App ID to save: {app_id}")
        
        # Save to file
        with open(".app_id", "w") as f:
            f.write(str(app_id))
        print("   ✅ App ID saved to .app_id file")
        
        return app_id
        
    except Exception as e:
        print(f"\n❌ Deployment failed: {e}")
        print(f"\n📍 Error details: {type(e).__name__}")
        print("\n⚠️  Make sure:")
        print("   1. LocalNet is running: algokit localnet start")
        print("   2. Contract is compiled: python -m smart_contracts build")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    deploy_to_localnet()


