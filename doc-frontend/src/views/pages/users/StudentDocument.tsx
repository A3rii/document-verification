import { Card, CardContent, CardHeader } from "./../../../components/ui/card";
import { getDocByOwnerId } from "./../../../services/document-service/get-all-doc";
import { useQuery } from "@tanstack/react-query";
import useCurrentUser from "../../../hooks/use-current-user";
import { DocumentItems } from "./../../../types/doc-types";
export default function StudentDocument() {
  const user = useCurrentUser();

  const {
    data: documentsById = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getDocByOwnerName"],
    queryFn: () => getDocByOwnerId(user?.name as string),
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
  console.log(documentsById);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading documents</p>;
  return (
    <div className="w-container mx-auto my-18">
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
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    {data?.docType}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
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
