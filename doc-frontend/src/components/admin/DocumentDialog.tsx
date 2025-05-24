import { useState } from "react";
import { Button } from "./../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../../components/ui/dialog";
import {
  Paperclip,
  FileCheck,
  Upload,
  X,
  User,
  Camera,
  CalendarIcon,
} from "lucide-react";
import { Input } from "./../../components/ui/input";
import { Label } from "./../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../components/ui/select";
import { MetaData } from "../../types/doc-types";
import { addingDocument } from "./../../services/document-service/adding-doc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function DocumentDialog() {
  const queryClient = useQueryClient();
  const currentDate = dayjs().format("DD-MM-YYYY");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formMetaData, setFormMetaData] = useState<MetaData>({
    name: "",
    dob: "",
    sex: "",
    major: "",
    gpa: 0,
    overall: "",
    docType: "",
  });

  // file handling
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/gif",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid file type (PDF, JPG, PNG, GIF)");
        return;
      }

      setSelectedFile(file);
    }
  };

  // Input onChange
  const handleInputChange = (field: string, value: string) => {
    setFormMetaData((prev: MetaData) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setFormMetaData((prev: MetaData) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle reset
  const handleReset = () => {
    setSelectedFile(null);
    setFormMetaData({
      name: "",
      dob: "",
      sex: "",
      major: "",
      gpa: 0,
      overall: "",
      docType: "",
    });
    // Clear file input
    const fileInput = document.getElementById("picture") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("picture") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Submitting the document with FormData
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return addingDocument(formData as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addingDoc"],
      });
      toast.success("Document has been created successfully.");
      handleReset();
    },
    onError: (error) => {
      console.error("Error creating document:", error);
      toast.error("Failed to create document.");
    },
  });

  // submitting the document
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validation
    if (
      !formMetaData.name ||
      !formMetaData.dob ||
      !formMetaData.sex ||
      !formMetaData.major ||
      !formMetaData.overall ||
      !formMetaData.docType ||
      !selectedFile ||
      formMetaData.gpa <= 0
    ) {
      toast.error("Please fill all the requirements");
      return;
    }

    // Create FormData object with current state values
    const formData = new FormData();

    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    // Append other form data
    formData.append("issuer", "Royal University of Phnom Penh");
    formData.append("issueDate", currentDate);
    formData.append("ownerId", formMetaData.name);
    formData.append("status", "approved");
    formData.append("docType", formMetaData.docType);

    formData.append("metadata", JSON.stringify([formMetaData]));

    // Pass the FormData to the mutation
    mutation.mutate(formData);
  };
  console.log(currentDate);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <FileCheck className="w-4 h-4 mr-2 text-custom-primary" />
          Create Document
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] bg-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-custom-primary bg-clip-text flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-custom-primary" />
            Create New Document
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-base">
            Fill in your personal information to create a new document. All
            fields are required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-custom-primary" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formMetaData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
            />
          </div>

          {/* Date of Birth Field  */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-custom-primary" />
              Date of Birth
            </Label>
            <Input
              type="date"
              value={formMetaData.dob || ""}
              onChange={(e) => {
                handleInputChange("dob", e.target.value);
              }}
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
            />
          </div>

          {/* Sex Field */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2 ">
              Gender
            </Label>
            <Select onValueChange={(value) => handleSelectChange("sex", value)}>
              <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Major Field */}
          <div className="space-y-2">
            <Label
              htmlFor="major"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              Major
            </Label>
            <Input
              id="major"
              placeholder="Enter your major"
              value={formMetaData.major}
              onChange={(e) => handleInputChange("major", e.target.value)}
              className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-10 w-full max-w-full">
            {/* GPA Field */}
            <div className="space-y-2 w-full">
              <Label
                htmlFor="gpa"
                className="text-sm font-semibold text-slate-700">
                GPA
              </Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="e.g., 3.75"
                value={formMetaData.gpa}
                onChange={(e) => handleInputChange("gpa", e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white w-full"
              />
            </div>

            {/* Overall Grade Field */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-slate-700">
                Overall Grade
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("overall", value)}>
                <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white w-full">
                  <SelectValue placeholder="Select overall grade" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="A+">A+ (Excellent)</SelectItem>
                  <SelectItem value="A">A (Very Good)</SelectItem>
                  <SelectItem value="B+">B+ (Good)</SelectItem>
                  <SelectItem value="B">B (Above Average)</SelectItem>
                  <SelectItem value="C+">C+ (Average)</SelectItem>
                  <SelectItem value="C">C (Below Average)</SelectItem>
                  <SelectItem value="D">D (Poor)</SelectItem>
                  <SelectItem value="F">F (Fail)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label className="text-sm font-semibold text-slate-700">
              Document Type
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("docType", value)}>
              <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white w-full">
                <SelectValue placeholder="Select Document Type" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-black flex items-center gap-2">
              <Camera className="w-4 h-4 text-custom-primary" />
              Upload Document
            </Label>

            {!selectedFile ? (
              <div className="relative">
                <Input
                  id="picture"
                  type="file"
                  accept="image/jpeg,image/gif,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="picture"
                  className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-custom-primary rounded-lg cursor-pointer transition-all duration-200 hover:border-rose-400">
                  <Upload className="w-5 h-5 text-custom-primary" />
                  <span className="text-custom-primary font-medium">
                    Click to upload file
                  </span>
                  <span className="text-xs text-slate-500">
                    (PDF, JPG, PNG, GIF)
                  </span>
                </Label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-slate-300 text-slate-600 hover:bg-slate-50">
              Cancel
            </Button>
          </DialogTrigger>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-custom-primary shadow-md hover:bg-white hover:border-custom-primary hover:text-custom-primary cursor-pointer disabled:opacity-50">
            <FileCheck className="w-4 h-4 mr-2" />
            {mutation.isPending ? "Creating..." : "Create Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
