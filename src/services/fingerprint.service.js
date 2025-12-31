import FingerprintJS from "@fingerprintjs/fingerprintjs";

let fingerprint = null;

export const getDeviceFingerprint = async () => {
  try {
    if (fingerprint) {
      return fingerprint;
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    fingerprint = result.visitorId;
    return fingerprint;
  } catch (error) {
    console.error("Error getting device fingerprint:", error);
    return null;
  }
};

export const clearFingerprint = () => {
  fingerprint = null;
};
