import { Label } from "../../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { ShieldCheck, RotateCcw, FileX } from "lucide-react";
import { message } from "../../../../common/constant/doc-response";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../components/ui/alert";
import { DocumentItems } from "./../../../../types/doc-types";
interface CertificateProps {
  certificate?: {
    message: string;
    result: boolean | DocumentItems;
  };
  handleReset?: () => void;
}

export default function CounterfietCertificate({
  certificate,
  handleReset,
}: CertificateProps) {
  console.log(certificate);
  return (
    <>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex justify-start items-center gap-2">
          <ShieldCheck className="text-red-600" />
          <Label className="text-[18px] text-red-700 block font-sora font-semibold">
            Document Invalid
          </Label>
        </div>
        {!certificate?.result && (
          <>
            {certificate?.message === message.denyMessage.revoked ? (
              <RevokedCard />
            ) : certificate?.message === message.denyMessage.not_allow ? (
              <DenyCard certificate={certificate} handleReset={handleReset} />
            ) : (
              <InvalidCard />
            )}
          </>
        )}
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
          <RotateCcw className="w-4 h-4" />
          Try Another Document
        </Button>
      </div>
    </>
  );
}

const DenyCard = ({ certificate }: CertificateProps) => {
  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardDescription className="text-red-700">
            {certificate?.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="flex flex-col justify-start items-start gap-2 border-red-300 bg-red-100">
            <div className="flex justify-start items-center gap-2">
              <FileX className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">
                You don't have a permission to see the documnet
              </AlertTitle>
            </div>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
};

const InvalidCard = () => {
  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardDescription className="text-red-700">
            Document verification failed - This document is not authentic
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="flex flex-col justify-start items-start gap-2 border-red-300 bg-red-100">
            <div className="flex justify-start items-center gap-2">
              <FileX className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">
                Document is Counterfeit
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 mb-2">
                  This document could not be verified because:
                </p>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• Qr code is not a rupp standard code</li>
                  <li>• Document is not issued by a verified authority</li>
                  <li>• QR code has been tampered with or is fake</li>
                  <li>• Document may have been forged or altered</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
};

const RevokedCard = ({ certificate }: CertificateProps) => {
  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardDescription className="text-red-700">
            {certificate?.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="flex flex-col justify-start items-start gap-2 border-red-300 bg-red-100">
            <div className="flex justify-start items-center gap-2">
              <FileX className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">
                You don't have a permission to see the documnet
              </AlertTitle>
            </div>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
};
