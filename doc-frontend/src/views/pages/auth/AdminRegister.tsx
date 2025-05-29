import { registerAdmin } from "../../../app/auth/authSlice";
import { Button } from "./../../../components/ui/button";
import { Input } from "./../../../components/ui/input";
import { Label } from "./../../../components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch, RootState } from "../../../app/store";
import { StudentRegisterProps } from "./../../../types/auth-type";

export default function AdminRegister() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [registerData, setRegisterData] = useState<StudentRegisterProps>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  });

  // Input onChange
  const handleInputChange = (field: string, value: string) => {
    setRegisterData((prev: StudentRegisterProps) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle login form
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const action = await dispatch(
        registerAdmin({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          confirm_password: registerData.confirm_password,
          phone_number: registerData.phone_number,
        })
      );
      if (registerAdmin.fulfilled.match(action)) {
        navigate("/admin");
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirm_password: "",
          phone_number: "",
        });
      }
      console.log("login successfully");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm">
              Secure access to admin dashboard
            </p>
          </div>

          {/* Form */}
          <div className="bg-card rounded-lg shadow-sm border p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={registerData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  required
                  value={registerData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={registerData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    required
                    value={registerData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 h-full hover:bg-transparent">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    value={registerData.confirm_password}
                    onChange={(e) =>
                      handleInputChange("confirm_password", e.target.value)
                    }
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 h-full hover:bg-transparent">
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  Invalid credentials. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our security policies and
                terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
