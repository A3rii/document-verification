import { Card, CardContent, CardFooter } from "./../../../components/ui/card";
import { getDocByOwnerName } from "./../../../services/document-service/get-all-doc";
import { getQrFootPrintStatus } from "./../../../services/qrcode-service/get-qrcode-hash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useCurrentUser from "../../../hooks/use-current-user";
import { DocumentItems } from "./../../../types/doc-types";
import {
  X,
  Check,
  Shield,
  Clock,
  FileText,
  Eye,
  EyeOff,
  Unlock,
  Lock,
} from "lucide-react";
import Loading from "./../../../components/Loading";
import { Badge } from "../../../components/ui/badge";
import QrPopover from "./../../../components/users/QrPopver";
import { updateDocumentAccessStatus } from "./../../../services/qrcode-service/update-qrcode-permission";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function StudentDocument() {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const [permissionStatus, setPermissionStatus] = useState<boolean>(false);

  const {
    data: documentsById = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getDocByOwnerName", user?.name],
    queryFn: () => getDocByOwnerName(user?.name as string),
    enabled: !!user?.name,
  });

  const { data: documentAllowStatus = false } = useQuery({
    queryKey: ["getQrFootPrintStatus", user?._id],
    queryFn: () => getQrFootPrintStatus(user!._id as string),
    enabled: !!user?._id,
  });

  useEffect(() => {
    setPermissionStatus(documentAllowStatus);
  }, [documentAllowStatus]);

  const mutation = useMutation({
    mutationFn: ({ docHash, status }: { docHash: string; status: boolean }) =>
      updateDocumentAccessStatus(docHash, status),

    onMutate: async ({ status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["getQrFootPrintStatus", user?._id],
      });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData([
        "getQrFootPrintStatus",
        user?._id,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(["getQrFootPrintStatus", user?._id], status);

      setPermissionStatus(status);

      return { previousStatus };
    },

    onSuccess: (variables) => {
      // Invalidate and refetch queries to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: ["getQrFootPrintStatus", user?._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["getDocByOwnerName", user?.name],
      });

      toast.success(
        `Document Permission ${variables.status ? "Allowed" : "Private"}`
      );
    },

    onError: (error) => {
      console.error("Error updating document permission:", error);
      toast.error("Failed to update document permission.");
    },

    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["getQrFootPrintStatus", user?._id],
      });
    },
  });

  const handleChangeStatusPermission = (docHash: string, status: boolean) => {
    mutation.mutate({ docHash, status });
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>{isError}</p>;

  return (
    <div className="my-18 flex justify-start items-center gap-12">
      {documentsById.length > 0 ? (
        documentsById.map((data: DocumentItems, key: number) => (
          <Card
            key={key}
            className="w-[280px] h-auto m-0 p-0 sm:w-[300px] md:w-[320px] lg:w-[350px] max-w-full bg-white border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out overflow-hidden flex flex-col">
            {/* Document Image */}
            <div className="w-full h-[240px] sm:h-[260px] md:h-[300px] bg-neutral-100 overflow-hidden m-0 p-0 flex-shrink-0">
              <img
                src={data?.Doc_URL || ""}
                alt="Document preview"
                loading="lazy"
                className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Document Type Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
                  <div className="flex justify-center items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                      {data?.docType}
                    </p>
                    <div className="">
                      <Badge
                        variant={
                          data.Status === "approved" ? "default" : "destructive"
                        }
                        className={`gap-1 ${
                          data.Status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {data.Status === "approved" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {data.Status.charAt(0).toUpperCase() +
                          data.Status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <QrPopover data={data} />
                  </div>
                </div>

                {/* Document Access Status Section */}
                <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Status Icon */}
                      <div
                        className={`p-2 rounded-full ${
                          permissionStatus ? "bg-green-100" : "bg-red-100"
                        }`}>
                        {permissionStatus ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-600" />
                        )}
                      </div>

                      {/* Status Text */}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">
                          Access Control
                        </span>
                        <span className="text-xs text-gray-600">
                          {permissionStatus
                            ? "Public access enabled"
                            : "Private access only"}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${
                        permissionStatus
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                      {permissionStatus ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Additional Status Info */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {permissionStatus
                        ? "Anyone with QR code can verify"
                        : "Only you can access this document"}
                    </span>
                    <button
                      onClick={() =>
                        handleChangeStatusPermission(
                          data?.DocHash,
                          !permissionStatus
                        )
                      }
                      disabled={mutation.isPending}
                      className={`text-custom-primary font-medium cursor-pointer ${
                        mutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}>
                      {mutation.isPending ? "Updating..." : "Change"}
                    </button>
                  </div>
                </div>

                {/* Metadata Information */}
                <div className="space-y-3 flex-1">
                  {data?.MetaData.map((items, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {/* Personal Information Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                            Name
                          </p>
                          <p className="text-gray-800 font-medium">
                            {items?.name}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                            Gender
                          </p>
                          <p className="text-gray-800">{items?.sex}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                            Date of Birth
                          </p>
                          <p className="text-gray-800">{items?.dob}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                            Major
                          </p>
                          <p className="text-gray-800">{items?.major}</p>
                        </div>
                      </div>

                      {/* Academic Performance */}
                      {items?.docType === "transcript" ? (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                                GPA
                              </p>
                              <p className="text-gray-800 font-semibold">
                                {items?.gpa}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                                Overall
                              </p>
                              <p className="text-gray-800 font-semibold">
                                {items?.overall}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Graduated
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            {/* Card Footer with Document Info */}
            <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="w-full flex items-center justify-between">
                {/* Last Updated */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Updated today</span>
                </div>

                {/* Verification Status */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Shield className="h-3 w-3" />
                    <span className="font-medium">Verified</span>
                  </div>

                  {/* Document Allow Status Display */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      permissionStatus
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        permissionStatus ? "bg-green-500" : "bg-orange-500"
                      }`}></div>
                    {permissionStatus ? "Accessible" : "Restricted"}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray-500 w-full">
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500">
                Upload your first document to get started
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
