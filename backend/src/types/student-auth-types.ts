import { JwtPayload } from "jsonwebtoken";
export interface StudentJwtPayload extends JwtPayload {
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

export interface EnrollAdminBody {
  enrollmentID?: string;
  enrollmentSecret?: string;
}

export interface RegisterUserBody {
  name: string;
  role?: string;
  owner_id: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  affiliation: "org1.department1 ";
}
