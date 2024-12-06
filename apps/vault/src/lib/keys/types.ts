export interface MasterKey {
  key: CryptoKey;
  version: number;
}

export interface DEK {
  data: {
    iv: string;
    cipherText: string;
  };
  metadata: {
    version: number;
  };
}
