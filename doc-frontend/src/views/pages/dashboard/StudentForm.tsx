import { Label } from "@radix-ui/react-label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { StudentRegisterProps } from "../../../types/auth-type";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerStudentForm } from "./../../../services/student-service/register-student";
import { toast } from "sonner";

export default function StudentDialog() {
  const queryClient = useQueryClient();

  const [studentForm, setStudentForm] = useState<StudentRegisterProps>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (field: string, value: string) => {
    setStudentForm((prev: StudentRegisterProps) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setStudentForm({
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
    });
  };

  
  const mutation = useMutation<StudentRegisterProps>({
    mutationFn: () => registerStudentForm(studentForm),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registerStudent"],
      });
      toast.success("registerStudent");
      handleReset();
    },
    onError: (error) => {
      console.error("Error register student:", error);
      toast.error("Failed to register student.");
    },
  });

  // submitting the register student
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !studentForm.name ||
      !studentForm.email ||
      !studentForm.phone_number ||
      !studentForm.password ||
      !studentForm.confirm_password
    ) {
      toast.error("Please fill all the requirements");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Add Student</h2>
        <p className="text-sm text-muted-foreground">
          Create a new student account with the required information.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            value={studentForm.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter student's full name"
            className="h-10"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={studentForm.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="student@example.com"
            className="h-10"
          />
        </div>

        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={studentForm.phone_number}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="h-10"
          />
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                value={studentForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-10 pr-10"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent">
                {showPassword ? (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={studentForm.confirm_password}
                onChange={(e) =>
                  handleInputChange("confirm_password", e.target.value)
                }
                placeholder="Confirm password"
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={handleShowConfirmPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent">
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700  cursor-pointer" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" className="h-10 px-6" onClick={handleReset}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-10 px-6 bg-custom-primary hover:bg-red-700 cursor-pointer">
          Create Student
        </Button>
      </div>
    </div>
  );
}
