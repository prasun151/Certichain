import algosdk from 'algosdk';
import { 
  issueCredential as contractIssueCredential,
  verifyCredential as contractVerifyCredential,
  getContractInfo,
  isContractDeployed,
  getAppId,
  getAppAddress
} from './contract';

const ALGOD_SERVER = process.env.REACT_APP_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const ALGOD_TOKEN = process.env.REACT_APP_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

const client = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, '');

export { getAppId, getAppAddress, isContractDeployed, getContractInfo };

export const mintCredentialNFT = async (
  issuerAddress,
  studentAddress,
  credentialName,
  metadataUrl,
  signTransactions
) => {
  if (isContractDeployed()) {
    console.log('Using smart contract for credential issuance...');
    return await contractIssueCredential(
      issuerAddress,
      studentAddress,
      credentialName,
      metadataUrl,
      signTransactions
    );
  }

  console.log('Smart contract not deployed, using direct ASA creation...');
  
  let params;
  try {
    params = await client.getTransactionParams().do();
  } catch (error) {
    throw new Error('Failed to fetch transaction parameters from the network: ' + error.message);
  }

  if (!params || typeof params !== 'object') {
    throw new Error('Invalid transaction parameters structure received from the network');
  }

  let txn;
  try {
    txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: issuerAddress,
      total: 1,
      decimals: 0,
      assetName: credentialName.slice(0, 32),
      unitName: 'CRED',
      assetURL: metadataUrl,
      defaultFrozen: false,
      manager: issuerAddress,
      reserve: issuerAddress,
      freeze: issuerAddress,
      clawback: issuerAddress,
      suggestedParams: params,
    });
  } catch (error) {
    throw new Error('Failed to construct transaction: ' + error.message);
  }

  let encodedTxn;
  try {
    encodedTxn = algosdk.encodeUnsignedTransaction(txn);
    if (!encodedTxn || !(encodedTxn instanceof Uint8Array)) {
      throw new Error('Failed to encode transaction properly');
    }
  } catch (error) {
    throw new Error('Failed to encode transaction: ' + error.message);
  }

  const signedTxns = await signTransactions([encodedTxn]);
  if (!signedTxns || signedTxns.length === 0) {
    throw new Error('Transaction signing failed');
  }

  const { txId } = await client.sendRawTransaction(signedTxns[0]).do();
  const result = await algosdk.waitForConfirmation(client, txId, 4);

  return {
    assetId: result['asset-index'],
    txId,
  };
};

export const verifyCredentialOnChain = async (assetId) => {
  if (isContractDeployed()) {
    return await contractVerifyCredential(assetId);
  }

  try {
    const assetInfo = await client.getAssetByID(assetId).do();
    return assetInfo && assetInfo.asset ? 'Verified (ASA)' : 'Not Found';
  } catch (error) {
    console.error('Error verifying credential:', error);
    return 'Error';
  }
};

export const getStudentCredentials = async (walletAddress) => {
  try {
    const info = await client.accountInformation(walletAddress).do();
    return info['created-assets'] || [];
  } catch (e) {
    console.error('Error fetching credentials:', e);
    return [];
  }
};

export const getCredentialByAssetId = async (assetId) => {
  try {
    return await client.getAssetByID(assetId).do();
  } catch (e) {
    console.error('Error fetching credential:', e);
    return null;
  }
};

export const optInToAsset = async (walletAddress, assetId, signTransactions) => {
  // Validate inputs
  if (!walletAddress || !assetId || assetId <= 0) {
    throw new Error('Invalid wallet address or asset ID');
  }

  let params;
  try {
    params = await client.getTransactionParams().do();
  } catch (error) {
    throw new Error('Failed to fetch transaction parameters from the network: ' + error.message);
  }

  if (!params || typeof params !== 'object') {
    throw new Error('Invalid transaction parameters structure received from the network');
  }

  let txn;
  try {
    txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: walletAddress,
      receiver: walletAddress,
      assetIndex: assetId,
      amount: 0,
      suggestedParams: params,
    });
  } catch (error) {
    throw new Error('Failed to construct transaction: ' + error.message);
  }

  let encoded;
  try {
    encoded = algosdk.encodeUnsignedTransaction(txn);
    if (!encoded || !(encoded instanceof Uint8Array)) {
      throw new Error('Failed to encode transaction properly');
    }
  } catch (error) {
    throw new Error('Failed to encode transaction: ' + error.message);
  }

  const signed = await signTransactions([encoded]);
  if (!signed || signed.length === 0) {
    throw new Error('Transaction signing failed');
  }

  await client.sendRawTransaction(signed[0]).do();
};

export const getAlgodClient = () => client;
