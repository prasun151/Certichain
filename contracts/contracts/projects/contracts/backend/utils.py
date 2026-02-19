from hdwallet import HDWallet
from hdwallet.symbols import ALGO
from hdwallet.cryptocurrencies import get_cryptocurrency
from hdwallet.mnemonics import BIP39Mnemonic # Correct Import for BIP39Mnemonic
from algosdk import mnemonic

def derive_algorand_private_key_from_bip39(bip39_mnemonic: str, account_index: int = 0) -> str:
    """
    Derives an Algorand private key (25-word mnemonic) from a BIP39 mnemonic phrase.

    Args:
        bip39_mnemonic (str): The 12 or 24-word BIP39 mnemonic phrase.
        account_index (int, optional): The account index for derivation (e.g., 0 for the first account). Defaults to 0.

    Returns:
        str: The Algorand 25-word mnemonic (private key).
    """
    # 1. Initialize HDWallet with BIP39 mnemonic
    algorand_cryptocurrency_class = get_cryptocurrency(ALGO) # Get the ALGORAND class using ALGO symbol
    
    # Create BIP39Mnemonic object and get seed
    mnemonic_obj = BIP39Mnemonic(mnemonic=bip39_mnemonic) # Pass the BIP39 mnemonic string directly
    seed = mnemonic_obj.to_seed()
    
    # Initialize HDWallet from seed
    hdwallet = HDWallet(symbol=ALGO, cryptocurrency=algorand_cryptocurrency_class).from_seed(seed=seed)

    # 2. Derive the private key using the Algorand derivation path (BIP44)
    hdwallet.from_path(path=f"m/44'/283'/{account_index}'/0/0")

    # Get the raw private key bytes
    private_key_hex = hdwallet.private_key()
    private_key_bytes = bytes.fromhex(private_key_hex)

    # 3. Convert the raw private key bytes to Algorand's 25-word mnemonic
    algorand_mnemonic = mnemonic.from_private_key(private_key_bytes)

    return algorand_mnemonic
