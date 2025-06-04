import { JwtPayload } from "jsonwebtoken";
export interface QrcodePayload extends JwtPayload {
  qrCodeId: number;
  type: string;
  tempPassword: string;
}
