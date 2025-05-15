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
