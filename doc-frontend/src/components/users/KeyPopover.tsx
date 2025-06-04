import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./../../components/ui/dialog";
import { Input } from "./../../components/ui/input";
import { Label } from "./../../components/ui/label";
import { useState } from "react";
import { Button } from "./../../components/ui/button";
import { Key } from "lucide-react";
import { QrDataResult } from "./../../types/doc-types";
import { toast } from "sonner";
import dayjs from "dayjs";
interface DataDocumentProps {
  data: QrDataResult;
}

export default function KeyPopover({ data }: DataDocumentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      console.log(copied);
      await navigator.clipboard.writeText(data?.tempPassword ?? "");
      setCopied(true);
      // Reset copy state after 2 seconds
      toast.success("Passcode Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Key className="text-custom-primary text-[30px] cursor-pointer hover:opacity-80 transition-opacity" />
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              This Password Will Expire At:
              {data?.passwordExpiresAt
                ? dayjs(data?.passwordExpiresAt).format("DD-MM-YYYY hh:mm:a")
                : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Access Password
              </Label>
              <Input
                id="link"
                defaultValue={data?.tempPassword ?? ""}
                readOnly
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              className="w-full flex items-center justify-center border hover:border-custom-red gap-2 bg-custom-primary hover:bg-white hover:text-custom-primary text-white cursor-pointer"
              type="button"
              onClick={copyToClipboard}
              variant="secondary">
              Copy Passcode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
