#!/usr/bin/env python3
"""
CredentialVerifier Hackathon Demo Script
Demonstrates the contract working on LocalNet
"""

import algokit_utils
from smart_contracts.artifacts.credential_verifier.credential_verifier_client import (
    CredentialVerifierFactory,
)


def demo():
    """Run a complete demo of CredentialVerifier on LocalNet"""
    
    print("=" * 70)
    print("🎓 CREDENTIAL VERIFIER - HACKATHON DEMO")
    print("=" * 70)
    
    # Connect to LocalNet
    print("\n🔗 Connecting to AlgoKit LocalNet...")
    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer = algorand.account.from_environment("DEPLOYER")
    
    print(f"   Deployer: {deployer.address}")
    
    # Get factory and deploy
    print("\n📦 Deploying CredentialVerifier contract...")
    factory = algorand.client.get_typed_app_factory(
        CredentialVerifierFactory,
        default_sender=deployer.address
    )
    
    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )
    
    print(f"   ✅ Deployed! App ID: {app_client.app_id}")
    print(f"   App Address: {app_client.app_address}")
    
    # Fund the app
    print("\n💳 Funding the app with 1 ALGO...")
    algorand.send.payment(
        algokit_utils.PaymentParams(
            amount=algokit_utils.AlgoAmount(algo=1),
            sender=deployer.address,
            receiver=app_client.app_address,
        )
    )
    print("   ✅ Funded!")
    
    # Demo: Call contract methods
    print("\n" + "=" * 70)
    print("📋 TESTING CONTRACT METHODS")
    print("=" * 70)
    
    # Test 1: Issue Credential
    print("\n✅ Test 1: Issue Credential")
    print("   Input: student_address='Alice', credential_name='BS Computer Science'")
    
    from smart_contracts.artifacts.credential_verifier.credential_verifier_client import (
        IssueCredentialArgs,
    )
    
    result = app_client.send.issue_credential(
        args=IssueCredentialArgs(
            student_address="Alice",
            credential_name="BS Computer Science"
        )
    )
    print(f"   Output: Credential ID = {result.abi_return}")
    
    # Test 2: Verify Credential
    print("\n✅ Test 2: Verify Credential")
    print("   Input: credential_id=1")
    
    from smart_contracts.artifacts.credential_verifier.credential_verifier_client import (
        VerifyCredentialArgs,
    )
    
    result = app_client.send.verify_credential(
        args=VerifyCredentialArgs(credential_id=1)
    )
    print(f"   Output: {result.abi_return}")
    
    # Test 3: Get Contract Info
    print("\n✅ Test 3: Get Contract Info")
    
    result = app_client.send.get_contract_info()
    print(f"   Output: {result.abi_return}")
    
    # Summary
    print("\n" + "=" * 70)
    print("🎉 DEMO COMPLETE!")
    print("=" * 70)
    print(f"\n📊 Contract Summary:")
    print(f"   App ID: {app_client.app_id}")
    print(f"   App Name: CredentialVerifier")
    print(f"   Methods: 4")
    print(f"   Status: ✅ Working on AlgoKit LocalNet")
    print(f"\n💡 Ready to present in hackathon!")
    print("=" * 70)


if __name__ == "__main__":
    try:
        demo()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Make sure:")
        print("   1. algokit localnet start (is running)")
        print("   2. python -m smart_contracts build (completed)")
        exit(1)
