from hdwallet import HDWallet
from hdwallet.symbols import ALGO
from hdwallet.cryptocurrencies import get_cryptocurrency
from hdwallet.mnemonics import BIP39Mnemonic
from algosdk import mnemonic

bip39_mnemonic_phrase = 'rack group letter catalog news example romance ring seven girl dynamic someone advice midnight blind twice chef rigid sheriff pen episode such pool wasp'

try:
    algorand_cryptocurrency_class = get_cryptocurrency(ALGO)
    
    # Initialize HDWallet
    hdwallet = HDWallet(symbol=ALGO, cryptocurrency=algorand_cryptocurrency_class)
    
    # Load mnemonic
    mnemonic_obj = BIP39Mnemonic(mnemonic=bip39_mnemonic_phrase)
    hdwallet.from_mnemonic(mnemonic=mnemonic_obj)
    
    # Derive from path
    hdwallet.from_path(path=f"m/44'/283'/0'/0/0") # Using account_index = 0 for simplicity

    # Get private key
    private_key_hex = hdwallet.private_key()
    private_key_bytes = bytes.fromhex(private_key_hex)
    algorand_mnemonic = mnemonic.from_private_key(private_key_bytes)
    
    print(f"Derived 25-word Algorand Mnemonic: {algorand_mnemonic}")

except Exception as e:
    print(f"An error occurred: {e}")
