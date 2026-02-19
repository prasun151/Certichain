from algopy import ARC4Contract, Txn, Account, GlobalState, itxn, String, UInt64, Global
from algopy.arc4 import abimethod


class CredentialVerifier(ARC4Contract):
    """Algorand Credential Verifier Smart Contract"""

    def __init__(self) -> None:
        self.authorized_institution = GlobalState(Account)

    @abimethod(create="require")
    def create(self, institution: Account) -> None:
        """Initialize the contract with the authorized institution"""
        self.authorized_institution.value = institution

    @abimethod
    def issue_credential(
        self, student_address: Account, credential_name: String, metadata_url: String
    ) -> UInt64:
        """
        Issue a credential to a student.
        Mints an NFT and returns the Asset ID.
        Only the authorized institution can call this.
        """
        assert Txn.sender == self.authorized_institution.value, "Only the authorized institution can issue credentials"
        
        # Mint the NFT using an inner transaction
        asset_create = itxn.AssetConfig(
            total=1,
            decimals=0,
            asset_name=credential_name,
            unit_name=String("CERT"),
            url=metadata_url,
            manager=Global.current_application_address,  # Contract is the manager
            reserve=student_address, # Reserve is the student
        ).submit()
        
        return asset_create.created_asset.id

    @abimethod(readonly=True)
    def verify_credential(self, asset_id: UInt64) -> String:
        """Verify if a credential is valid (dummy for now)"""
        return String("Verified")

    @abimethod(readonly=True)
    def get_contract_info(self) -> String:
        """Get contract information"""
        return String("CredentialVerifier - Algorand Credential System")


# Export the contract class for deployment
app = CredentialVerifier
