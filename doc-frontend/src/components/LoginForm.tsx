import { loginStudent } from "../app/auth/authSlice";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch, RootState } from "../app/store";
import { Eye, EyeOff } from "lucide-react";
export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // handle login form
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const action = await dispatch(
        loginStudent({
          email: email,
          password: password,
        })
      );

      if (loginStudent.fulfilled.match(action)) {
        const userRole = action.payload.user.role;
        if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "user") {
          navigate("/user");
        }
        setEmail("");
        setPassword("");
      }
      console.log("login successfully");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin} // Added onSubmit handler
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-custom-primary capitalize">
          Login to your account
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example.2821@rupp.edu.kh"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              required
              placeholder="Please enter your password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showPassword ? (
                <Eye className="h-4 w-4  cursor-pointer text-custom-primary" />
              ) : (
                <EyeOff className="h-4 w-4 text-custom-primary cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-custom-primary"
          disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center">
          Invalid Credential
        </div>
      )}
    </form>
  );
}
