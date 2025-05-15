// Document verification data type
export type DocumentVerification = {
  id: string;
  certificateNumber: string;
  studentName: string;
  issueDate: string;
  documentHash: string;
  signBy: string;
  status: "verified" | "revoked";
  documentType: string;
};

export interface StudentMeta {
  name: string;
  sex: string;
  dob: string;
  major: string;
  gpa: number;
  overall_grade: string;
}
export interface DocumentItems {
  ID: string;
  docType: string;
  IssueDate: string;
  Issuer: string;
  OwenrId: string;
  DocHash: string;
  DocSignature: string;
  Status: string;
  MetaData: StudentMeta[];
}
