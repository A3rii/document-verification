import { caClient } from "./../../utils/caClient";

export interface EnrollmentResult {
  success: boolean;
  message: string;
  enrollmentId?: string;
}

export class FabricService {
  async enrollAdmin(): Promise<EnrollmentResult> {
    try {
      const wallet = caClient.getWallet();
      const ca = caClient.getCA();

      // Check if admin already exists
      const adminIdentity = await wallet.get("admin");
      if (adminIdentity) {
        return {
          success: true,
          message: "Admin identity already exists in the wallet",
          enrollmentId: "admin",
        };
      }

      // Enroll admin
      const enrollment = await ca.enroll({
        enrollmentID: "admin",
        enrollmentSecret: process.env.ADMIN_SECRET || "adminpw",
      });

      // Create identity
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: caClient.getMspId(),
        type: "X.509",
      };

      // Store in wallet
      await wallet.put("admin", x509Identity);

      return {
        success: true,
        message: "Successfully enrolled admin",
        enrollmentId: "admin",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to enroll admin: ${error}`,
      };
    }
  }

  async registerAndEnrollUser(
    userId: string,
    affiliation: string = "org1.department1",
    role: string = "client",
    attributes?: Array<{ name: string; value: string; ecert: boolean }>
  ): Promise<EnrollmentResult> {
    try {
      const wallet = caClient.getWallet();
      const ca = caClient.getCA();

      // Check if user already exists
      const userIdentity = await wallet.get(userId);
      if (userIdentity) {
        return {
          success: false,
          message: `User ${userId} already exists in the wallet`,
        };
      }

      // Check if admin exists
      const adminIdentity = await wallet.get("admin");
      if (!adminIdentity) {
        return {
          success: false,
          message: "Admin identity not found. Please enroll admin first.",
        };
      }

      // Build admin user object
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, "admin");

      // Register the user
      const secret = await ca.register(
        {
          affiliation: affiliation,
          enrollmentID: userId,
          role: role,
          attrs: attributes || [],
        },
        adminUser
      );

      // Enroll the user
      const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
      });

      // Create identity
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: caClient.getMspId(),
        type: "X.509",
      };

      // Store in wallet
      await wallet.put(userId, x509Identity);

      return {
        success: true,
        message: `Successfully registered and enrolled user ${userId}`,
        enrollmentId: userId,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to register user ${userId}: ${error}`,
      };
    }
  }



  async checkUserExists(userId: string): Promise<boolean> {
    const wallet = caClient.getWallet();
    const identity = await wallet.get(userId);
    return !!identity;
  }
}

export const fabricService = new FabricService();
