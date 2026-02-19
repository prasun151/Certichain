import * as algosdk from 'algosdk';

const ALGOD_SERVER = process.env.REACT_APP_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const ALGOD_TOKEN = process.env.REACT_APP_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const APP_ID = parseInt(process.env.REACT_APP_APP_ID) || 0;
const APP_ADDRESS = process.env.REACT_APP_APP_ADDRESS || '';

const client = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, '');

const bigIntToNumber = (bigInt) => {
  if (typeof bigInt === 'bigint') {
    return Number(bigInt);
  }
  return bigInt;
};

const encodeString = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

const decodeString = (uint8Array) => {
  return new TextDecoder().decode(uint8Array);
};

const methodSelectors = {
  'issue_credential(address,string,string)uint64': [0x38, 0x8c, 0xaf, 0xfb],
  'verify_credential(uint64)string': [0x30, 0x6a, 0x2f, 0x53]
};

const getMethodSelector = (methodSignature) => {
  return new Uint8Array(methodSelectors[methodSignature] || [0, 0, 0, 0]);
};

const encodeArc4String = (str) => {
  const strBytes = encodeString(str);
  const length = new Uint8Array(8);
  const len = strBytes.length;
  length[0] = (len >> 56) & 0xff;
  length[1] = (len >> 48) & 0xff;
  length[2] = (len >> 40) & 0xff;
  length[3] = (len >> 32) & 0xff;
  length[4] = (len >> 24) & 0xff;
  length[5] = (len >> 16) & 0xff;
  length[6] = (len >> 8) & 0xff;
  length[7] = len & 0xff;
  const result = new Uint8Array(8 + strBytes.length);
  result.set(length, 0);
  result.set(strBytes, 8);
  return result;
};

export const getAppAddress = () => APP_ADDRESS;

export const getAppId = () => APP_ID;

export const isContractDeployed = () => APP_ID > 0;

export const issueCredential = async (
  issuerAddress,
  studentAddress,
  credentialName,
  metadataUrl,
  signTransactions
) => {
  if (!isContractDeployed()) {
    throw new Error('Smart contract not deployed. Please deploy the contract first.');
  }

  try {
    // Get transaction parameters with full validation
    let params;
    try {
      params = await client.getTransactionParams().do();
    } catch (error) {
      throw new Error('Failed to fetch transaction parameters: ' + error.message);
    }

    // Validate transaction parameters - check for essential fields
    if (!params || typeof params !== 'object') {
      throw new Error('Invalid transaction parameters received from the network');
    }
    
    // Validate and decode addresses
    let studentAddressBytes;
    try {
      const decodedAddr = algosdk.decodeAddress(studentAddress);
      if (!decodedAddr || !decodedAddr.publicKey) {
        throw new Error('Invalid address format for student wallet');
      }
      studentAddressBytes = decodedAddr.publicKey;
      
      if (!(studentAddressBytes instanceof Uint8Array) || studentAddressBytes.length !== 32) {
        throw new Error('Invalid public key length from address decoding');
      }
    } catch (error) {
      throw new Error('Failed to decode student address: ' + error.message);
    }

    // Encode parameters
    let credentialNameEncoded, metadataUrlEncoded;
    try {
      credentialNameEncoded = encodeArc4String(credentialName);
      metadataUrlEncoded = encodeArc4String(metadataUrl);
      
      if (!credentialNameEncoded || !(credentialNameEncoded instanceof Uint8Array)) {
        throw new Error('Failed to encode credential name');
      }
      if (!metadataUrlEncoded || !(metadataUrlEncoded instanceof Uint8Array)) {
        throw new Error('Failed to encode metadata URL');
      }
    } catch (error) {
      throw new Error('Failed to encode credential data: ' + error.message);
    }

    // Build method selector
    const methodSelector = getMethodSelector('issue_credential(address,string,string)uint64');
    if (!methodSelector || methodSelector.length !== 4) {
      throw new Error('Invalid method selector');
    }

    // Construct app arguments with proper validation
    const appArgs = [
      new Uint8Array(methodSelector),
      studentAddressBytes,
      credentialNameEncoded,
      metadataUrlEncoded
    ];

    // Validate all appArgs elements
    for (let i = 0; i < appArgs.length; i++) {
      if (!(appArgs[i] instanceof Uint8Array)) {
        throw new Error(`Invalid appArgs element at index ${i}: expected Uint8Array`);
      }
    }

    // Create transaction with full error handling
    let txn;
    try {
      txn = algosdk.makeApplicationNoOpTxnFromObject({
        sender: issuerAddress,
        appIndex: APP_ID,
        appArgs: appArgs,
        suggestedParams: params,
      });
    } catch (error) {
      throw new Error('Failed to construct transaction: ' + error.message);
    }

    // Encode transaction
    let encodedTxn;
    try {
      encodedTxn = algosdk.encodeUnsignedTransaction(txn);
      if (!encodedTxn || !(encodedTxn instanceof Uint8Array)) {
        throw new Error('Failed to encode transaction properly');
      }
    } catch (error) {
      throw new Error('Failed to encode transaction: ' + error.message);
    }

    // Sign and send transaction
    const signedTxns = await signTransactions([encodedTxn]);
    if (!signedTxns || signedTxns.length === 0) {
      throw new Error('Transaction signing failed');
    }

    const { txId } = await client.sendRawTransaction(signedTxns[0]).do();

    const result = await algosdk.waitForConfirmation(client, txId, 4);

    let assetId = null;
    
    if (result['inner-txns']) {
      for (const innerTxn of result['inner-txns']) {
        if (innerTxn['asset-index']) {
          assetId = innerTxn['asset-index'];
          break;
        }
      }
    }

    if (!assetId) {
      const logs = result.logs || [];
      for (const log of logs) {
        try {
          const decoded = new Uint8Array(
            atob(log).split('').map(c => c.charCodeAt(0))
          );
          if (decoded.length >= 8) {
            assetId = bigIntToNumber(
              algosdk.bytesToBigInt(decoded.slice(-8))
            );
            if (assetId > 0 && assetId < 1e15) break;
          }
        } catch (e) {
          continue;
        }
      }
    }

    return {
      assetId,
      txId,
      appId: APP_ID,
    };
  } catch (error) {
    console.error('Error in issueCredential:', error);
    throw error;
  }
};

export const verifyCredential = async (assetId) => {
  if (!isContractDeployed()) {
    throw new Error('Smart contract not deployed. Please deploy the contract first.');
  }

  // Validate input
  if (!assetId || assetId <= 0) {
    throw new Error('Invalid asset ID');
  }

  try {
    // Get transaction parameters
    let params;
    try {
      params = await client.getTransactionParams().do();
    } catch (error) {
      throw new Error('Failed to fetch transaction parameters from the network: ' + error.message);
    }

    // Validate transaction parameters - check for essential structure
    if (!params || typeof params !== 'object') {
      throw new Error('Invalid transaction parameters structure received from the network');
    }
    
    // Encode asset ID
    let assetIdBytes;
    try {
      assetIdBytes = algosdk.encodeUint64(assetId);
      if (!assetIdBytes || !(assetIdBytes instanceof Uint8Array)) {
        throw new Error('Failed to encode asset ID');
      }
    } catch (error) {
      throw new Error('Failed to encode asset ID: ' + error.message);
    }

    // Build method selector
    const methodSelector = getMethodSelector('verify_credential(uint64)string');
    if (!methodSelector || methodSelector.length !== 4) {
      throw new Error('Invalid method selector');
    }

    // Construct app arguments
    const appArgs = [
      new Uint8Array(methodSelector),
      assetIdBytes
    ];

    // Validate appArgs
    for (let i = 0; i < appArgs.length; i++) {
      if (!(appArgs[i] instanceof Uint8Array)) {
        throw new Error(`Invalid appArgs element at index ${i}: expected Uint8Array`);
      }
    }

    // Create and encode transaction
    let txn;
    try {
      txn = algosdk.makeApplicationNoOpTxnFromObject({
        sender: algosdk.getApplicationAddress(APP_ID),
        appIndex: APP_ID,
        appArgs: appArgs,
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
    
    const response = await client.pendingTransactionInformation(encodedTxn).do();
    const logs = response.logs || [];
    
    for (const log of logs) {
      try {
        const decoded = atob(log);
        if (decoded.includes('Verified') || decoded.includes('Invalid')) {
          return decoded;
        }
      } catch (e) {
        continue;
      }
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};

export const getContractInfo = async () => {
  if (!isContractDeployed()) {
    throw new Error('Smart contract not deployed. Please deploy the contract first.');
  }

  try {
    const appInfo = await client.getApplicationByID(APP_ID).do();
    const globalState = appInfo.params['global-state'] || [];
    
    const state = {};
    for (const keyValue of globalState) {
      const key = atob(keyValue.key);
      if (keyValue.type === 1) {
        state[key] = decodeString(new Uint8Array(keyValue.value.bytes));
      } else if (keyValue.type === 0) {
        state[key] = keyValue.value.uint;
      }
    }
    
    return {
      appId: APP_ID,
      appAddress: algosdk.getApplicationAddress(APP_ID),
      globalState: state,
    };
  } catch (error) {
    console.error('Error fetching contract info:', error);
    throw error;
  }
};

export const waitForAssetCreation = async (txId) => {
  const result = await algosdk.waitForConfirmation(client, txId, 4);
  
  if (result['inner-txns']) {
    for (const innerTxn of result['inner-txns']) {
      if (innerTxn['asset-index']) {
        return innerTxn['asset-index'];
      }
    }
  }
  
  return null;
};
