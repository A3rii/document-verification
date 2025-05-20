export const privateKeyFormat = (secretKey: string) => {
  return secretKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\r\n/g, "")
    .replace(/\n/g, "")
    .trim();
};

export const publicKeyFormat = (publicKey: string) => {
  return publicKey
    .replace(/-----BEGIN CERTIFICATE-----/, "")
    .replace(/-----END CERTIFICATE-----/, "")
    .trim();
};
