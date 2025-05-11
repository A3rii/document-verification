import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "./../../../components/ui/card";
import { TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full max-w-full sflex items-center justify-center gap-4">
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl lg:text-3xl font-semibold tabular-nums">
            $1,250.00
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-1 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Trending up this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
