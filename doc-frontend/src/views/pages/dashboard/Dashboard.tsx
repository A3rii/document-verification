import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "./../../../components/ui/card";
import { FileCheck2 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full max-w-full flex items-center justify-center gap-4">
      {/* 1 */}
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardDescription>Total Documents</CardDescription>
          <CardTitle className="text-2xl lg:text-3xl font-semibold tabular-nums">
            1,250.00 Record(s)
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Documents which are stored in a block
            <FileCheck2 className="text-custom-primary h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
