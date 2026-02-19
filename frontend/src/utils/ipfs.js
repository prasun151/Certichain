import axios from 'axios';

const KEY = process.env.REACT_APP_PINATA_KEY;
const SECRET = process.env.REACT_APP_PINATA_SECRET;

export const uploadFileToPinata = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        pinata_api_key: KEY,
        pinata_secret_api_key: SECRET,
      },
    }
  );
  return res.data.IpfsHash;
};

export const uploadJSONToPinata = async (json) => {
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    json,
    {
      headers: {
        pinata_api_key: KEY,
        pinata_secret_api_key: SECRET,
      },
    }
  );
  return res.data.IpfsHash;
};

export const toHTTP = (hash) => {
  if (!hash) return '';
  if (hash.startsWith('http')) return hash;
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};
