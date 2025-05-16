import { JwtPayload } from "jsonwebtoken";
export interface StudentJwtPayload extends JwtPayload {
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}
