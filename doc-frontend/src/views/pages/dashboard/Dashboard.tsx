import {
  getAllDocument,
  getDocCountByStaus,
} from "../../../services/document-service/get-all-doc";
import { countAllStudents } from "../../../services/student-service/get-all-student";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "./../../../components/ui/card";
import { FileCheck2, User, FileCheck, FileX2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";

interface CardProps {
  title: string;
  count: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard = ({ title, count, description, icon: Icon }: CardProps) => (
  <Card className="w-full shadow-sm">
    <CardHeader>
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-2xl lg:text-3xl font-semibold tabular-nums   text-custom-primary">
        {count}
      </CardTitle>
    </CardHeader>
    <CardFooter className="flex items-center gap-2 text-sm font-medium">
      {description}
      <Icon className="text-custom-primary h-4 w-4" />
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getAllDocuments"],
    queryFn: getAllDocument,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  const { data: students = [] } = useQuery({
    queryKey: ["getStudents"],
    queryFn: countAllStudents,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  const { data: approvedDocument = 0 } = useQuery({
    queryKey: ["approvedDocument", "approved"],
    queryFn: () => getDocCountByStaus("approved"),
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  const { data: revokedDocument = 0 } = useQuery({
    queryKey: ["revokedDocument", "revoked"],
    queryFn: () => getDocCountByStaus("revoked"),
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading documents</p>;
  console.log(approvedDocument);
  return (
    <div className="w-full max-w-full flex items-center justify-center gap-4">
      <StatCard
        title="Total Documents"
        count={documents.length}
        description="Documents stored in blockchain"
        icon={FileCheck2}
      />
      <StatCard
        title="Total Students"
        count={students}
        description="Registered students"
        icon={User}
      />
      <StatCard
        title="Approved Documents"
        count={approvedDocument}
        description="Approved Document from RUPP"
        icon={FileCheck}
      />

      <StatCard
        title="Revoked Documents"
        count={revokedDocument}
        description="The documents which has revoked"
        icon={FileX2}
      />
    </div>
  );
}
