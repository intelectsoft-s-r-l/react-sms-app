export interface IAppPackages {
  ID: number;
  MaxValue: number;
  MinValue: number;
  Name: string;
  Price: number;
  SortIndex: number;
  Status: number;
  ValidFrom: string; // .net date
  ValidTo: string; // .net date
}
export interface IApp {
  AppType?: number;
  ApyKey?: string;
  BackOfficeURI?: string;
  Category: number;
  EncryptionPrivateKey: string;
  EncryptionPublicKey: string;
  ExternalSecurityPolicy: string;
  ID: number;
  LicenseActivationCode: string;
  LicenseActivationCodeValidHours: number;
  LicenseActivationCodeValidTo: string; // .net date
  LongDescripton: string;
  ModuleSettings: {
    APIKey: boolean;
    ActivationCode: boolean;
    Backoffice: boolean;
    License: boolean;
    ProductType: number;
    RSAKey: boolean;
  };
  Packages: IAppPackages[];
  TermsOfUse: string;
}
