const encryptData = async (plainData: string, encryptionKey: string) => {
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY environment variable is required");
  }

  // Generate a random 96-bit initialization vector (IV)
  const initVector = crypto.getRandomValues(new Uint8Array(12));

  // Encode the data to be encrypted
  const encodedData = new TextEncoder().encode(plainData);

  // Prepare the encryption key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(encryptionKey, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  // Encrypt the encoded data with the key
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: initVector,
    },
    cryptoKey,
    encodedData,
  );

  // Return the encrypted data and the IV, both in base64 format
  return {
    encryptedData: Buffer.from(encryptedData).toString("base64"),
    initVector: Buffer.from(initVector).toString("base64"),
  };
};

const decryptData = async (
  encryptedData: string,
  initVector: string,
  encryptionKey: string,
) => {
  // Prepare the decryption key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    Buffer.from(encryptionKey, "base64"),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  try {
    // Decrypt the encrypted data using the key and IV
    const decodedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: Buffer.from(initVector, "base64"),
      },
      cryptoKey,
      Buffer.from(encryptedData, "base64"),
    );

    // Decode and return the decrypted data
    return new TextDecoder().decode(decodedData);
  } catch (error) {
    return JSON.stringify({ payload: null });
  }
};

const handleDecryption = async ({
  encryptedData,
  initVector,
}: any): Promise<string> => {
  const decryptedString = await decryptData(
    encryptedData,
    initVector,
    process.env.ENCRYPTION_KEY!,
  );

  const responseData = JSON.parse(decryptedString)?.data;
  return responseData;
};

const handleEncryption = async (data: any) => {
  return await encryptData(
    JSON.stringify({ data }),
    process.env.ENCRYPTION_KEY!,
  );
};

export { handleEncryption, handleDecryption };
