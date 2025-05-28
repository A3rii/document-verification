export interface MetaData {
  name: string;
  sex: string;
  dob: string;
  major: string;
  gpa: number;
  overall: string;
  docType: string;
}

type DocumentStatus = "approved" | "revoked";
export interface DocumentProps {
  issuer: string;
  issuerDate: string | Date;
  ownerId: string;
  status: DocumentStatus;
  docType: string;
  metadata: MetaData;
  document: File | null;
}

export interface GeneralSubjectProps {
  name: string;

  credits: string;
  grade: string;
}
export interface DocumentItems {
  ID: string;
  DocHash: string;
  DocSignature: string;
  Doc_URL: string;
  OwnerId: string;
  MetaData: MetaData[];
  GeneralSubject: GeneralSubjectProps[];
  IssueDate: string;
  Issuer: string;
  docType: string;
  Status: DocumentStatus;
}
