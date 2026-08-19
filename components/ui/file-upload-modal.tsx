"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader2, Upload, X } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucketName: string;
  path: string;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
  onUploadComplete: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  title?: string;
  description?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

const FileUploadModal: FC<FileUploadModalProps> = ({
  open,
  onOpenChange,
  bucketName,
  path,
  maxFiles = 1,
  maxSize = 6 * 1024 * 1024, // 6MB default
  acceptedFileTypes = { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  onUploadComplete,
  onUploadError,
  title = "Upload File",
  description = "Drag and drop files here or click to browse",
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxFiles).map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles(newFiles);
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const supabase = createClient();
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${path}/${file.name}`;

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Cleanup previews
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      setFiles([]);
      onUploadComplete(uploadedUrls);
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`
              relative cursor-pointer rounded-lg border-2 border-dashed p-8
              transition-colors duration-200 ease-in-out
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }
              ${isUploading ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-10 w-10 text-gray-400" />
              {isDragActive ? (
                <p className="text-sm text-gray-600">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-xs text-gray-400">
                    Max {maxFiles} file{maxFiles > 1 ? "s" : ""}, up to{" "}
                    {Math.round(maxSize / 1024 / 1024)}MB each
                  </p>
                </>
              )}
            </div>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border bg-gray-50 p-2"
                >
                  {file.preview && (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded-full p-1 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-500">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
