import { Card, CardContent } from "./../../../components/ui/card";
import { getDocByOwnerName } from "./../../../services/document-service/get-all-doc";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "../../../hooks/use-current-user";
import { DocumentItems } from "./../../../types/doc-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./../../../components/ui/popover";
import { Button } from "./../../../components/ui/button";
import { downloadQRCode } from "./../../../utils/qrDownload";
import QRCode from "react-qr-code";
import { QrCode, Download, X, Check } from "lucide-react";
import LOGO from "./../../../assets/logo/rupp_logo.png";
import Loading from "./../../../components/Loading";
import { Badge } from "../../../components/ui/badge";

export default function StudentDocument() {
  const user = useCurrentUser();

  const {
    data: documentsById = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getDocByOwnerName", user?.name],
    queryFn: () => getDocByOwnerName(user?.name as string),
    enabled: !!user?.name,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>{isError}</p>;

  return (
    <div className="my-18 flex justify-start items-center gap-12">
      {documentsById.length > 0 ? (
        documentsById.map((data: DocumentItems, key: number) => (
          <Card
            key={key}
            className="w-[280px] m-0 p-0 sm:w-[300px] md:w-[320px] lg:w-[350px] max-w-full bg-white border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out overflow-hidden">
            <div className="w-full h-[240px] sm:h-[260px] md:h-[300px] bg-neutral-100 overflow-hidden m-0 p-0">
              <img
                src={data?.Doc_URL || ""}
                alt="Document preview"
                loading="lazy"
                className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Document Type Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
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
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <QrCode className="text-custom-primary text-[30px] cursor-pointer hover:opacity-80 transition-opacity" />
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <div className="space-y-4 flex flex-col justify-center items-center">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Document QR Code
                            </p>
                            <div className="p-2 border-[2px] border-custom-primary border-dotted rounded-md relative">
                              <img
                                src={LOGO}
                                alt="bakong_logo"
                                loading="lazy"
                                width={40}
                                height={40}
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: "50%",
                                  transform: "translate(-50% , -50%)",
                                }}
                              />
                              <QRCode
                                id={`qr-${data?.DocHash}`}
                                size={200}
                                style={{
                                  height: "auto",
                                  maxWidth: "100%",
                                  width: "100%",
                                }}
                                value={data?.DocHash}
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="H"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              downloadQRCode(data?.DocHash, data?.docType)
                            }
                            className="w-full flex items-center justify-center gap-2 cursor-pointer"
                            variant="outline">
                            <Download className="w-4 h-4 text-custom-primary cursor-pointer" />
                            Download QR Code
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Metadata Information */}
                <div className="space-y-3">
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
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray-500">No documents found</div>
      )}
    </div>
  );
}
