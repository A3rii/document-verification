import jsQR from "jsqr";

export const processPDFForQR = async (file: File): Promise<string> => {
  try {
    console.log("Starting PDF processing for file:", file.name);

    // Dynamically import PDF.js
    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
 
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Process each page until QR code is found
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdf.numPages}`);

      const page = await pdf.getPage(pageNum);

      // Try different scales for better QR detection
      const scales = [3, 2, 4, 1.5, 1]; // Start with higher scales for small QR codes

      for (const scale of scales) {
        console.log(`Trying scale ${scale}x on page ${pageNum}`);

        try {
          // Get page viewport with scale
          const viewport = page.getViewport({ scale });
          console.log(`Viewport size: ${viewport.width}x${viewport.height}`);

          // Create canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Could not create canvas context");
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render page to canvas
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          console.log(`Page ${pageNum} rendered at scale ${scale}x`);

          // Get image data from canvas
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          console.log(
            `Image data extracted: ${imageData.width}x${imageData.height}, data length: ${imageData.data.length}`
          );

          // Detect QR code using jsQR with more aggressive options
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            {
              inversionAttempts: "attemptBoth",
            }
          );

          console.log(
            `QR detection result for page ${pageNum} scale ${scale}x:`,
            qrCode ? "FOUND" : "NOT FOUND"
          );

          // If QR code found, return the data immediately
          if (qrCode) {
            console.log(`QR code found on page ${pageNum} at scale ${scale}x`);
            console.log("QR code data:", qrCode.data);
            console.log("QR code location:", qrCode.location);
            return qrCode.data;
          }
        } catch (renderError) {
          console.error(
            `Error rendering page ${pageNum} at scale ${scale}:`,
            renderError
          );
          continue;
        }
      }
    }

    // If no QR code found after checking all pages and scales
    console.log("No QR code found in any page at any scale");
    throw new Error(
      "No QR code found in the PDF. Please ensure the PDF contains a clear and visible QR code."
    );
  } catch (err) {
    console.error("Error processing PDF:", err);
    // Re-throw the error so it can be caught by the calling function
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Failed to process PDF file");
    }
  }
};

// Extract your existing image processing logic into a separate function
export const processImageForQR = async (file: File): Promise<string> => {
  try {
    const imageDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const img = new Image();
    img.src = imageDataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Extract QR code data from image
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not create canvas context");
    }

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (qrCode) {
      console.log("QR code found in image");
      return qrCode.data;
    } else {
      throw new Error(
        "No QR code found in the image. Please ensure the QR code is clear and visible."
      );
    }
  } catch (err) {
    console.error("Error processing image:", err);
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Failed to process image file");
    }
  }
};
