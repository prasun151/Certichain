import logging

import algokit_utils

logger = logging.getLogger(__name__)


# define deployment behaviour based on supplied app spec
def deploy() -> None:
    """Deployment for CredentialVerifier - currently disabled for LocalNet testing

    Use `python smart_contracts/deploy_testnet.py` for Testnet deployment instead.
    """
    logger.info(
        "CredentialVerifier deployment skipped. Use deploy_testnet.py for Testnet."
    )
    pass
