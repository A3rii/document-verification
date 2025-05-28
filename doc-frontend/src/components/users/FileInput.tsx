import { useState, useEffect } from "react";
import { Input } from "./../../components/ui/input";
import { Label } from "./../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card";
import { Button } from "./../../components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { verifyDocumentHash } from "../../services/document-service/verify-doc";
import {
  Paperclip,
  FileX,
  File,
  ShieldCheck,
  FileText,
  RotateCcw,
  FileCheck,
} from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize";
import { GeneralSubjectProps } from "./../../types/doc-types";
import jsQR from "jsqr";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./../../components/ui/alert";
import { Link } from "react-router";
import Loading from "./../Loading";
export default function FileInput() {
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [hash, setHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [showVerification, setShowVerification] = useState<boolean>(false);

  // Verification function
  const {
    data: verify = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["verifyDocument ", hash],
    queryFn: () => verifyDocumentHash(hash),
    enabled: !!hash,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  // Check if document is valid and show verification container
  useEffect(() => {
    if (verify?.message && !isLoading && !isError) {
      setShowVerification(true);
    }
  }, [verify, isLoading, isError]);

  const handleReset = () => {
    setFileName(null);
    setSelectedImage(undefined);
    setHash("");
    setError("");
    setFileSize(0);
    setShowVerification(false);
    // Reset file input
    const fileInput = document.getElementById("picture") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = (file: File | null): boolean => {
    if (!file) {
      setError("");
      setFileName(null);
      setFileSize(0);
      return false;
    }
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size (${formatFileSize(
          file.size
        )}) exceeds limit of ${formatFileSize(MAX_FILE_SIZE)}`
      );
      setFileName(null);
      setFileSize(0);
      return false;
    }
    // Check file type
    const acceptedTypes = [
      "image/jpeg",
      "image/gif",
      "image/png",
      "application/pdf",
    ];
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Please select JPEG, GIF, PNG, or PDF.");
      setFileName(null);
      setFileSize(0);
      return false;
    }
    setError("");
    setFileName(file.name);
    setFileSize(file.size);
    return true;
  };

  // Extract image from file
  const getFileImage = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
    } else if (file.type === "application/pdf") {
      // For PDF files, you might want to show a PDF icon instead
      setSelectedImage(undefined);
    } else {
      setSelectedImage(undefined);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedImage(undefined);
      return;
    }

    const isValid = handleFileChange(file);
    if (isValid) {
      getFileImage(file);
    } else {
      e.target.value = "";
      setSelectedImage(undefined);
    }

    try {
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const img = new Image();
      img.src = imageDataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Extract QR code data
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not create canvas context");
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        const hash = qrCode.data;
        setHash(hash);
      } else {
        setError(
          "No QR code found in the image. Please ensure the QR code is clear and visible."
        );
      }
    } catch (err) {
      console.error("Error processing QR code:", err);
      setError("Failed to process the QR code. Please try again.");
    }
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading documents</p>;
  console.log(verify);
  return (
    <div className="w-full max-w-full h-full flex justify-center items-center py-44 bg-custom-secondary">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Verification Container - Show when document is verified */}
        {showVerification && verify?.status ? (
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
                      {verify?.message || "Valid document"}
                    </AlertTitle>
                  </div>

                  <div className="text-sm text-gray-700">
                    This {verify?.result?.docType} has been verified by{" "}
                    {verify?.result?.Issuer}
                  </div>

                  <Button className="bg-green-600 border border-green-600 text-white hover:bg-white hover:text-green-600 hover:border-green-600">
                    <Link
                      to={verify?.result?.Doc_URL}
                      className="flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer">
                      <FileText className="w-4 h-4" />
                      View Document
                    </Link>
                  </Button>
                </Alert>

                {/* Metadata Section */}
                <div className="border border-gray-200 p-4 rounded-md bg-white space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">
                    Student Information
                  </h4>
                  <ul className="text-sm text-gray-800 grid grid-cols-2 gap-2">
                    <li>
                      <strong>Name:</strong>{" "}
                      {verify?.result?.MetaData?.[0]?.name}
                    </li>
                    <li>
                      <strong>Sex:</strong> {verify?.result?.MetaData?.[0]?.sex}
                    </li>
                    <li>
                      <strong>Date of Birth:</strong>{" "}
                      {verify?.result?.MetaData?.[0]?.dob}
                    </li>
                    <li>
                      <strong>Major:</strong>{" "}
                      {verify?.result?.MetaData?.[0]?.major}
                    </li>
                    <li>
                      <strong>GPA:</strong> {verify?.result?.MetaData?.[0]?.gpa}
                    </li>
                    <li>
                      <strong>Overall Grade:</strong>{" "}
                      {verify?.result?.MetaData?.[0]?.overall}
                    </li>
                  </ul>
                </div>

                {/* General Subjects */}
                <div className="border border-gray-200 p-4 rounded-md bg-white">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Subjects
                  </h4>
                  <div className="grid gap-3">
                    {verify?.result?.GeneralSubject?.map(
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
        ) : showVerification ? (
          <div className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex justify-start items-center gap-2">
              <ShieldCheck className="text-red-600" />
              <Label className="text-[18px] text-red-700 block font-sora font-semibold">
                Document Invalid
              </Label>
            </div>
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
                        <li>
                          • Document is not issued by a verified authority
                        </li>
                        <li>• QR code has been tampered with or is fake</li>
                        <li>• Document may have been forged or altered</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50">
                  <RotateCcw className="w-4 h-4" />
                  Try Another Document
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Input Container - Show when not in verification mode */}
        {!showVerification && (
          <>
            <div className="flex justify-start items-center gap-2">
              <ShieldCheck className="text-custom-primary" />
              <Label
                htmlFor="certificate"
                className="text-[18px] text-neutral-600 block font-sora">
                Verify Your Certificates
              </Label>
            </div>

            {/* Input */}
            <div className="relative">
              <Input
                id="picture"
                type="file"
                accept="image/jpeg,image/gif,image/png,application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Label
                htmlFor="picture"
                className="flex items-center gap-3 p-3 border border-custom-primary rounded-lg cursor-pointer bg-white hover:bg-neutral-50 transition-colors">
                <Paperclip className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-600">
                  {fileName || "Choose file in PDF"}
                </span>
              </Label>
              <p className="text-sm text-black mt-2">
                Max file size: {formatFileSize(MAX_FILE_SIZE)}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FileX className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {fileName && !error && (
              <div className="max-w-sm">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Selected File</CardTitle>
                    <CardDescription>
                      {fileName.endsWith(".pdf")
                        ? "PDF Document"
                        : "Image File"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="file preview"
                          className="w-20 h-20 object-cover rounded border border-neutral-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center">
                          <File className="w-8 h-8 text-neutral-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {fileName}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(fileSize)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
