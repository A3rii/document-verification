export interface QrcodeProps {
  success: boolean;
  message: string;
  result: {
    _id: string;
    studentId: {
      _id: string;
      name: string;
    };
    docHash: string;
    isPublic: boolean;
    createdAt: string;
    __v: number;
    accessToken: string;
    passwordExpiresAt: string;
    tempPassword: string;
  };
}
