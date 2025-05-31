import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../../components/ui/dialog";
import {
  QrCode,
  Download,
  ImageIcon,
  Move,
  RotateCcw,
  Upload,
} from "lucide-react";
import QRCode from "react-qr-code";
import LOGO from "./../../assets/logo/rupp_logo.png";
import { Button } from "./../../components/ui/button";
import { downloadQRCode } from "./../../utils/qrDownload";
import { DocumentItems } from "./../../types/doc-types";

interface DataDocumentProps {
  data: DocumentItems;
}

export default function QrPopover({ data }: DataDocumentProps) {
  const [documentImage, setDocumentImage] = useState<HTMLImageElement | null>(
    null
  );
  const [uploadedQRImage, setUploadedQRImage] =
    useState<HTMLImageElement | null>(null);
  const [qrPosition, setQrPosition] = useState({ x: 50, y: 50 });
  const [qrSize, setQrSize] = useState(150);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showOverlayMode, setShowOverlayMode] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle QR code file upload
  const handleQRUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (PNG, JPEG, GIF, or WebP)");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUploadedQRImage(img);
        // Auto-enter overlay mode when QR is uploaded
        if (documentImage) {
          setShowOverlayMode(true);
        }
      };
      img.onerror = () => {
        alert("Failed to load the uploaded image");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Load document image when overlay mode is activated
  const loadDocumentImage = async () => {
    if (!data?.Doc_URL) {
      alert("No document image available");
      return;
    }

    setImageLoading(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        setDocumentImage(img);
        setShowOverlayMode(true);
        setImageLoading(false);
        // Reset position and size when loading new image
        setQrPosition({ x: 50, y: 50 });
        setQrSize(150);
      };

      img.onerror = () => {
        alert("Failed to load document image");
        setImageLoading(false);
      };

      img.src = data.Doc_URL;
    } catch (error) {
      console.error("Error loading image:", error);
      alert("Failed to load document image");
      setImageLoading(false);
    }
  };

  // Handle QR dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !showOverlayMode) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is within QR code bounds
    if (
      x >= qrPosition.x &&
      x <= qrPosition.x + qrSize &&
      y >= qrPosition.y &&
      y <= qrPosition.y + qrSize
    ) {
      setIsDragging(true);
      setDragOffset({
        x: x - qrPosition.x,
        y: y - qrPosition.y,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      // Keep QR within bounds
      const maxX = containerRef.current.offsetWidth - qrSize;
      const maxY = containerRef.current.offsetHeight - qrSize;

      setQrPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging, dragOffset, qrSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Download combined image
  const downloadCombinedImage = async () => {
    if (!documentImage || !canvasRef.current) {
      alert("Document image not loaded. Please try again.");
      return;
    }

    if (!uploadedQRImage) {
      alert("Please upload a QR code image first.");
      return;
    }

    try {
      console.log("Starting image generation...");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      // Set canvas size to match original document image
      canvas.width = documentImage.width;
      canvas.height = documentImage.height;

      console.log(
        "Canvas size set:",
        documentImage.width,
        "x",
        documentImage.height
      );

      // Draw base document image
      ctx.drawImage(documentImage, 0, 0);
      console.log("Document image drawn");

      // Calculate scaling factors
      const container = containerRef.current;
      if (!container) {
        throw new Error("Container reference not found");
      }

      const scaleX = documentImage.width / container.offsetWidth;
      const scaleY = documentImage.height / container.offsetHeight;

      console.log("Scale factors:", scaleX, scaleY);

      // Draw uploaded QR code at scaled position and size
      const scaledX = qrPosition.x * scaleX;
      const scaledY = qrPosition.y * scaleY;
      const scaledSize = qrSize * Math.min(scaleX, scaleY);

      console.log(
        "Drawing QR at position:",
        scaledX,
        scaledY,
        "size:",
        scaledSize
      );
      ctx.drawImage(uploadedQRImage, scaledX, scaledY, scaledSize, scaledSize);

      console.log("QR code overlaid successfully");

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${data?.docType}-${
            data?.MetaData?.[0]?.name || "document"
          }-with-qr.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log("Download initiated successfully");
        } else {
          throw new Error("Failed to create blob from canvas");
        }
      }, "image/png");
    } catch (error) {
      console.error("Error generating combined image:", error);
      alert(
        `Failed to generate image: ${error}. Please try refreshing and try again.`
      );
    }
  };

  const resetOverlay = () => {
    setShowOverlayMode(false);
    setDocumentImage(null);
    setUploadedQRImage(null);
    setQrPosition({ x: 50, y: 50 });
    setQrSize(150);
  };

  //   const handleDialogClose = () => {
  //     setIsDialogOpen(false);
  //     setShowOverlayMode(false);
  //     setDocumentImage(null);
  //     setUploadedQRImage(null);
  //     setQrPosition({ x: 50, y: 50 });
  //     setQrSize(150);
  //   };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <QrCode className="text-custom-primary text-[30px] cursor-pointer hover:opacity-80 transition-opacity" />
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Document QR Code</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 flex flex-col justify-center items-center py-4">
            <div className="text-center w-full">
              {!showOverlayMode ? (
                // Normal QR Code Display
                <div className="space-y-4">
                  <div className="p-4 border-[2px] border-custom-primary border-dotted rounded-md relative mx-auto w-fit">
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
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                      }}
                    />
                    <QRCode
                      id={`qr-${data?.DocHash}`}
                      size={250}
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
              ) : (
                // Overlay Mode
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <label className="font-medium">QR Size:</label>
                    <input
                      type="range"
                      min="30"
                      max="300"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-xs text-gray-600 min-w-[45px]">
                      {qrSize}px
                    </span>
                  </div>

                  <div
                    ref={containerRef}
                    className="relative border-2 border-dashed border-gray-300 cursor-crosshair rounded-md overflow-hidden mx-auto"
                    onMouseDown={handleMouseDown}
                    style={{
                      backgroundImage: `url(${documentImage?.src})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      width: "450px",
                      maxWidth: "100%",
                      aspectRatio: documentImage
                        ? `${documentImage.width}/${documentImage.height}`
                        : "1",
                    }}>
                    {uploadedQRImage && (
                      <div
                        className={`absolute border-2 border-blue-400 bg-white rounded ${
                          isDragging ? "cursor-grabbing" : "cursor-grab"
                        } shadow-lg overflow-hidden`}
                        style={{
                          left: qrPosition.x,
                          top: qrPosition.y,
                          width: qrSize,
                          height: qrSize,
                        }}>
                        <img
                          src={uploadedQRImage.src}
                          alt="Uploaded QR"
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-600 justify-center">
                    <Move size={12} />
                    Drag QR to position on document
                  </div>

                  {!uploadedQRImage && (
                    <div className="text-sm text-amber-600 text-center bg-amber-50 p-3 rounded-md">
                      Please upload a QR code first to position it on the
                      document
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full space-y-3 max-w-md">
              {!showOverlayMode ? (
                <>
                  {/* Normal download button */}
                  <Button
                    onClick={() => downloadQRCode(data?.DocHash, data?.docType)}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                    variant="outline">
                    <Download className="w-4 h-4 text-custom-primary" />
                    Download QR Code
                  </Button>

                  {/* Add QR to document image */}
                  <Button
                    onClick={loadDocumentImage}
                    disabled={!data?.Doc_URL || imageLoading}
                    className="w-full flex items-center justify-center border hover:border-custom-red gap-2 bg-custom-primary hover:bg-white hover:text-custom-primary text-white cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    {imageLoading ? "Loading..." : "Add QR to Document"}
                  </Button>
                </>
              ) : (
                <>
                  {/* Upload QR in overlay mode */}
                  {!uploadedQRImage && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleQRUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full flex items-center justify-center border hover:border-custom-red gap-2 bg-custom-primary hover:bg-white hover:text-custom-primary text-white cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload QR
                      </Button>
                    </>
                  )}

                  <Button
                    onClick={resetOverlay}
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline">
                    <RotateCcw className="w-4 h-4" />
                    Back to QR Only
                  </Button>

                  {/* Download combined image button */}
                  <Button
                    onClick={downloadCombinedImage}
                    disabled={!uploadedQRImage}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400">
                    <Download className="w-4 h-4" />
                    Download Document with QR
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
