import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="text-custom-primary text-[80rem] animate-spin" />
    </div>
  );
}
