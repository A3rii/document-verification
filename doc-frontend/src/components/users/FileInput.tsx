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
import { Paperclip, FileX, File } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize";

export default function FileInput() {
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedImage(undefined);
      return;
    }

    const isValid = handleFileChange(file);

    if (isValid) {
      getFileImage(file);
    } else {
      // Clear the input if file is invalid
      e.target.value = "";
      setSelectedImage(undefined);
    }
    console.log(file);
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  return (
    <div className="w-full max-w-full h-full flex justify-center items-center py-44 bg-custom-secondary">
      <div className="w-full max-w-sm flex flex-col gap-6 ">
        <div className="flex justify-start items-center gap-2">
          <ShieldCheck className="text-custom-primary" />
          <Label
            htmlFor="certificate"
            className="text-[18px] text-neutral-600 block font-sora">
            Verify Your Certificates
          </Label>
        </div>

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
                  {fileName.endsWith(".pdf") ? "PDF Document" : "Image File"}
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
      </div>
    </div>
  );
}
