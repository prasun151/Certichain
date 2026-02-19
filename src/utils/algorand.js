import algosdk from 'algosdk';

const client = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  ''
);

const APP_ID = process.env.REACT_APP_APP_ID;

export const mintCredentialNFT = async (
  issuerAddress,
  studentAddress,
  credentialName,
  metadataUrl,
  signTransactions
) => {
  const params = await client.getTransactionParams().do();

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
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

  const encodedTxn = algosdk.encodeUnsignedTransaction(txn);
  const signedTxns = await signTransactions([encodedTxn]);
  const { txId } = await client.sendRawTransaction(signedTxns[0]).do();

  const result = await algosdk.waitForConfirmation(client, txId, 4);

  return {
    assetId: result['asset-index'],
    txId,
  };
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
  return await client.getAssetByID(assetId).do();
};

export const optInToAsset = async (walletAddress, assetId, signTransactions) => {
  const params = await client.getTransactionParams().do();

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: walletAddress,
    receiver: walletAddress,
    assetIndex: assetId,
    amount: 0,
    suggestedParams: params,
  });

  const encoded = algosdk.encodeUnsignedTransaction(txn);
  const signed = await signTransactions([encoded]);
  await client.sendRawTransaction(signed[0]).do();
};
