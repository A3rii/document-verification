export interface FileUploadProps {
  fileData: string | Buffer;
  fileName?: string;
  metadata?: Record<string, any>;
}
