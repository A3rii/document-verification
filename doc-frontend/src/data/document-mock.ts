import { DocumentVerification } from "../types/admin-table-type";

export const data: DocumentVerification[] = [
  {
    id: "1",
    certificateNumber: "RUPP-2024-001",
    studentName: "John Doe",
    issueDate: "2024-01-15",
    documentHash: "xqwqeqwehqwehi=",
    signBy: "RUPP",
    status: "verified",
    documentType: "Bachelor's Degree",
  },
  {
    id: "2",
    certificateNumber: "RUPP-2024-002",
    studentName: "Jane Smith",
    issueDate: "2024-01-20",
    documentHash: "abc123def456ghi=",
    signBy: "RUPP",
    status: "revoked",
    documentType: "Master's Degree",
  },
];
