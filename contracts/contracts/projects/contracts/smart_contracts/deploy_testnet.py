import logging
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import algokit_utils
from algosdk.account import address_from_private_key
from algosdk.mnemonic import to_private_key

# Add parent directory to Python path to resolve imports
sys.path.insert(0, str(Path(__file__).parent.parent))

load_dotenv(Path(__file__).parent.parent / '.env')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def deploy():
    # Get mnemonic from environment
    institution_mnemonic = os.getenv("INSTITUTION_MNEMONIC")
    if not institution_mnemonic:
        logger.error("INSTITUTION_MNEMONIC not found in .env")
        return

    # Derive private key and address
    institution_private_key = to_private_key(institution_mnemonic)
    institution_address = address_from_private_key(institution_private_key)

    logger.info(f"Institution address: {institution_address}")

    # Configure for Testnet
    algorand = algokit_utils.AlgorandClient.testnet()

    # Set up the signer with the private key
    signer = algokit_utils.SigningAccount(private_key=institution_private_key)
    algorand.set_signer_from_account(signer)

    logger.info(f"Deployer: {institution_address}")

    # Import the generated client
    from smart_contracts.artifacts.credential_verifier.credential_verifier_client import (
        CredentialVerifierFactory,
        CredentialVerifierMethodCallCreateParams,
    )

    # Get factory and deploy
    logger.info("Deploying CredentialVerifier contract to Testnet...")

    factory = algorand.client.get_typed_app_factory(
        CredentialVerifierFactory, default_sender=institution_address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.ReplaceApp,
        on_schema_break=algokit_utils.OnSchemaBreak.ReplaceApp,
        create_params=CredentialVerifierMethodCallCreateParams(
            method="create", args=(institution_address,)
        ),
    )

    logger.info(f"✅ Deployed! App ID: {app_client.app_id}")
    logger.info(f"   App Address: {app_client.app_address}")
    print(f"\n" + "=" * 50)
    print(f"🎉 DEPLOYMENT SUCCESSFUL!")
    print(f"=" * 50)
    print(f"\n📝 SUBMISSION DETAILS:")
    print(f"   App ID: {app_client.app_id}")
    print(f"   App Address: {app_client.app_address}")
    print(f"   Network: Algorand Testnet")
    print(
        f"\n🔗 Explorer: https://testnet.explorer.perawallet.app/app/{app_client.app_id}/"
    )
    print(f"\n" + "=" * 50)

    return app_client.app_id


if __name__ == "__main__":
    try:
        deploy()
    except Exception as e:
        logger.error(f"Deployment failed: {e}")
        import traceback

        traceback.print_exc()
