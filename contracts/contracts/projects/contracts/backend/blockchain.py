from algosdk.v2client import algod, indexer
from algosdk.transaction import AssetCreateTxn, AssetTransferTxn, wait_for_confirmation
from algosdk.account import address_from_private_key
import os

ALGOD_URL = "https://testnet-api.algonode.cloud"
INDEXER_URL = "https://testnet-idx.algonode.cloud"

client = algod.AlgodClient("", ALGOD_URL)
idx_client = indexer.IndexerClient("", INDEXER_URL)

def mint_credential_nft(
    institution_private_key: str,
    student_address: str,
    certificate_name: str,
    metadata_url: str
) -> int:
    """
    Function 1: Mint credential NFT and return its Asset ID.
    The student must opt-in BEFORE the transfer (which happens after minting).
    """
    institution_address = address_from_private_key(institution_private_key)
    params = client.suggested_params()
    
    # Create asset (NFT) with exactly 1 supply
    txn = AssetCreateTxn(
        sender=institution_address,
        total=1,
        decimals=0,
        default_frozen=False,
        unit_name="CERT",
        asset_name=certificate_name,
        manager=institution_address,
        reserve=institution_address,
        freeze=institution_address,
        clawback=institution_address,
        url=metadata_url,
        sp=params
    )
    
    signed_txn = txn.sign(institution_private_key)
    txid = client.send_transaction(signed_txn)
    
    # Wait for confirmation
    confirmed_txn = wait_for_confirmation(client, txid, 4)
    asset_id = confirmed_txn["asset-index"]
    
    return asset_id

def send_credential_nft(
    institution_private_key: str,
    student_address: str,
    asset_id: int
) -> str:
    """Helper to transfer the NFT after student has opted in"""
    institution_address = address_from_private_key(institution_private_key)
    params = client.suggested_params()
    
    transfer_txn = AssetTransferTxn(
        sender=institution_address,
        index=asset_id,
        amount=1,
        receiver=student_address,
        sp=params
    )
    
    signed_txn = transfer_txn.sign(institution_private_key)
    txid = client.send_transaction(signed_txn)
    wait_for_confirmation(client, txid, 4)
    return txid

def opt_in_to_asset(student_private_key: str, asset_id: int) -> str:
    """Function 4: Student opts in to receive NFT"""
    student_address = address_from_private_key(student_private_key)
    params = client.suggested_params()
    
    # Opt-in is an AssetTransferTxn to oneself with amount 0
    txn = AssetTransferTxn(
        sender=student_address,
        index=asset_id,
        amount=0,
        receiver=student_address,
        sp=params
    )
    
    signed_txn = txn.sign(student_private_key)
    txid = client.send_transaction(signed_txn)
    wait_for_confirmation(client, txid, 4)
    return txid

def get_student_credentials(student_address: str) -> list:
    """Function 2: Fetch all credentials belonging to a wallet address"""
    response = idx_client.account_assets(student_address)
    # Only return assets where amount > 0 (actually owned)
    assets = [a for a in response.get("assets", []) if a["amount"] > 0]
    return assets

def get_credential_details(asset_id: int) -> dict:
    """Function 3: Fetch details of a single credential by its Asset ID"""
    response = idx_client.asset_info(asset_id)
    return response.get("asset", {}).get("params", {})
