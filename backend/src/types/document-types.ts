export interface StudentMeta {
  name: string;
  sex: string;
  dob: string;
  major: string;
  gpa: number;
  overall_grade: string;
}

export interface DocumentPayload {
  id: string;
  issuer: string;
  issueDate: string;
  ownerId: string;
  docHash: string;
  docSignature: string;
  status: string;
  metadata: StudentMeta[];
  docType: string;
}
