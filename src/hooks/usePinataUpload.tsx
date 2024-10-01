// hooks/usePinataUpload.ts
import { useState } from 'react';
import pinataSDK from '@pinata/sdk';

//this hook is used to upload the metadata to pinata

export const usePinataUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToPinata = async (metadata: object) => {
    setIsUploading(true);
    const pin = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT_KEY });

    try {
      const res = await pin.pinJSONToIPFS(metadata);
      if (!res || !res.IpfsHash) {
        throw new Error('Invalid response from Pinata');
      }
      const pinataURL = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      console.log('Pinata URL:', pinataURL);
      return pinataURL;
    } catch (error) {
      console.error('Failed to upload to pinata:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToPinata, isUploading };
};