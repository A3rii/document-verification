import { Label } from "../../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { ShieldCheck, FileText, FileCheck, RotateCcw } from "lucide-react";
import { GeneralSubjectProps } from "../../../../types/doc-types";
import { Alert, AlertTitle } from "../../../../components/ui/alert";
import { Link } from "react-router";
import { DocumentItems } from "../../../../types/admin-table-type";
interface CertificateProps {
  certificate: {
    message: string;
    result: DocumentItems;
  };
  handleReset: () => void;
}
export default function ApprovedCertificateTemplate({
  certificate,
  handleReset,
}: CertificateProps) {
  return (
    <>
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-start items-center gap-2">
          <ShieldCheck className="text-green-600" />
          <Label className="text-[18px] text-green-700 block font-sora font-semibold">
            Document Verified
          </Label>
        </div>
        <Card className="border-green-200">
          <CardHeader>
            <CardDescription className="text-green-700">
              Document verification completed successfully
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="flex flex-col items-start gap-3 border-green-300 bg-green-100">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  {certificate?.message || "Valid document"}
                </AlertTitle>
              </div>

              <div className="text-sm text-gray-700">
                This {certificate?.result?.docType} has been verified by{" "}
                {certificate?.result?.Issuer}
              </div>

              <Button className="bg-green-600 border border-green-600 text-white hover:bg-white hover:text-green-600 hover:border-green-600">
                <Link
                  to={certificate?.result?.Doc_URL}
                  className="flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer">
                  <FileText className="w-4 h-4" />
                  View Document
                </Link>
              </Button>
            </Alert>

            {/* Metadata Section */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              {/* Header */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Student Information
                </h4>
                <div className="w-12 h-0.5 bg-green-500"></div>
              </div>

              {/* Information Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Name
                    </dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      {certificate?.result?.MetaData?.[0]?.name}
                    </dd>
                  </div>

                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Gender
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {certificate?.result?.MetaData?.[0]?.sex}
                    </dd>
                  </div>

                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Date of Birth
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {certificate?.result?.MetaData?.[0]?.dob}
                    </dd>
                  </div>

                  <div className="space-y-1">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Major
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {certificate?.result?.MetaData?.[0]?.major}
                    </dd>
                  </div>

                  {certificate?.result?.docType === "transcript" && (
                    <>
                      <div className="space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          GPA
                        </dt>
                        <dd className="text-sm text-gray-900 font-semibold">
                          {certificate?.result?.MetaData?.[0]?.gpa}
                        </dd>
                      </div>

                      <div className="space-y-1">
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Overall Grade
                        </dt>
                        <dd className="text-sm text-gray-900 font-semibold">
                          {certificate?.result?.MetaData?.[0]?.overall}
                        </dd>
                      </div>
                    </>
                  )}
                </div>

                {/* Status Badge */}
                {certificate?.result?.docType === "certificate" && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Graduated
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* General Subjects */}
            {certificate?.result?.docType === "transcript" && (
              <div className="border border-gray-200 p-4 rounded-md bg-white">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Subjects
                </h4>
                <div className="grid gap-3">
                  {certificate?.result?.GeneralSubject?.map(
                    (subject: GeneralSubjectProps, index: number) => (
                      <div
                        key={index}
                        className="p-3 rounded border border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-700">
                        <div className="font-medium">{subject.name}</div>
                        <div className="flex gap-4">
                          <span>Credits: {subject.credits}</span>
                          <span>Grade: {subject.grade}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 cursor-pointer">
              <RotateCcw className="w-4 h-4" />
              Verify Another Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
