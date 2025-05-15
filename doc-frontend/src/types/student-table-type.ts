// Student record data type
export type StudentRecord = {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  program: string;

  status: "active" | "graduated" | "suspended" | "withdrawn";
};
