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

const JOURNAL_ENCRYPTION_PREFIX = "stj:v1:";

type JournalEncryptionEnvelope = {
  v: 1;
  iv: string;
  data: string;
};

const isEncryptedJournalText = (value: string): boolean =>
  value.startsWith(JOURNAL_ENCRYPTION_PREFIX);

const encodeJournalEnvelope = (envelope: JournalEncryptionEnvelope): string => {
  return Buffer.from(JSON.stringify(envelope), "utf8").toString("base64");
};

const decodeJournalEnvelope = (
  encodedEnvelope: string,
): JournalEncryptionEnvelope | null => {
  try {
    const decodedEnvelope = Buffer.from(encodedEnvelope, "base64").toString(
      "utf8",
    );
    const parsed = JSON.parse(decodedEnvelope);

    if (
      parsed &&
      parsed.v === 1 &&
      typeof parsed.iv === "string" &&
      typeof parsed.data === "string"
    ) {
      return parsed as JournalEncryptionEnvelope;
    }
  } catch (_error) {
    return null;
  }

  return null;
};

const encryptJournalingText = async (
  value: string | null | undefined,
): Promise<string | null | undefined> => {
  if (value === null || value === undefined || value === "") {
    return value;
  }

  if (isEncryptedJournalText(value)) {
    return value;
  }

  const { encryptedData, initVector } = await handleEncryption(value);

  const encodedEnvelope = encodeJournalEnvelope({
    v: 1,
    iv: initVector,
    data: encryptedData,
  });

  return `${JOURNAL_ENCRYPTION_PREFIX}${encodedEnvelope}`;
};

const decryptJournalingText = async (
  value: string | null | undefined,
): Promise<string | null | undefined> => {
  if (value === null || value === undefined || value === "") {
    return value;
  }

  if (!isEncryptedJournalText(value)) {
    return value;
  }

  const encodedEnvelope = value.slice(JOURNAL_ENCRYPTION_PREFIX.length);
  const envelope = decodeJournalEnvelope(encodedEnvelope);

  if (!envelope) {
    return value;
  }

  const decryptedValue = await handleDecryption({
    encryptedData: envelope.data,
    initVector: envelope.iv,
  });

  return typeof decryptedValue === "string" ? decryptedValue : value;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const transformContentJsonText = async (
  value: unknown,
  transform: (text: string) => Promise<string | null | undefined>,
): Promise<unknown> => {
  if (Array.isArray(value)) {
    return await Promise.all(
      value.map((item) => transformContentJsonText(item, transform)),
    );
  }

  if (isPlainObject(value)) {
    const transformedObject: Record<string, unknown> = {};

    for (const [key, entryValue] of Object.entries(value)) {
      if (key === "text" && typeof entryValue === "string") {
        transformedObject[key] = (await transform(entryValue)) ?? entryValue;
      } else {
        transformedObject[key] = await transformContentJsonText(
          entryValue,
          transform,
        );
      }
    }

    return transformedObject;
  }

  return value;
};

const encryptContentJsonText = async <T>(contentJson: T): Promise<T> => {
  if (contentJson === null || contentJson === undefined) {
    return contentJson;
  }

  return (await transformContentJsonText(
    contentJson,
    encryptJournalingText,
  )) as T;
};

const decryptContentJsonText = async <T>(contentJson: T): Promise<T> => {
  if (contentJson === null || contentJson === undefined) {
    return contentJson;
  }

  return (await transformContentJsonText(
    contentJson,
    decryptJournalingText,
  )) as T;
};

export {
  decryptContentJsonText,
  decryptJournalingText,
  encryptContentJsonText,
  encryptJournalingText,
  handleEncryption,
  handleDecryption,
};
