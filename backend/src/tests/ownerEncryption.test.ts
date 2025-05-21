import { encryptOwnerWithPK } from "../utils/encryptOwnerWithPK";

// Function Testing
const main = async () => {
  try {
    // owner id from database as a public key
    // admin could get this from student authenticate to publish the doc
    const certificateBase64 =
      "MIICeTCCAiCgAwIBAgIUF+mzaW3r512Aq+hXcsN3l+ZF6e8wCgYIKoZIzj0EAwIwcDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMQ8wDQYDVQQHEwZEdXJoYW0xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMjUwNTE3MDcwMDAwWhcNMjYwNTE3MTYwNDAwWjA/MS4wCwYDVQQLEwRvcmcxMAsGA1UECxMEdXNlcjASBgNVBAsTC2RlcGFydG1lbnQxMQ0wCwYDVQQDEwRuZW9uMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEx3AB/GwYyDWr2WLVJNhi52eStO6yUKn6byKHwPW/ygUa1SFP4kxv/C7T1TUdDbrsYie7+r0mP2ayEEmqA2w5g6OByDCBxTAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUd6tSblH/3HhFn3J55R4wdizefTMwHwYDVR0jBBgwFoAU/zICgtxljsMAjCixIE7WNprbPogwZQYIKgMEBQYHCAEEWXsiYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwiaGYuRW5yb2xsbWVudElEIjoibmVvbiIsImhmLlR5cGUiOiJ1c2VyIn19MAoGCCqGSM49BAMCA0cAMEQCIHi9iDeWQzgEkiqIjRJxpkn2AkYscU2I5wevYW0Zb2xcAiAQjSvs0xoNbYrpjzmseQoPGqRhYuoMqudbYdY+Xmt5Ww==";

    const encryptedMessage = await encryptOwnerWithPK(
      "QmVLZ9gAyeJJesGFYVWJyww9eTZVy9xZjGaKuxu5M1RWLM", 
      certificateBase64
    );
    console.log(encryptedMessage);
  } catch (error) {
    console.error("Error in main:", error);
  }
};
main();
