"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
  accept?: string;
  // Optional fixed path prefix inside bucket, e.g. 'favicons'
  pathPrefix?: string;
  // Optional fixed filename prefix, e.g. 'favicon'
  fixedNamePrefix?: string;
  // If true, use timestamp for filename instead of sanitized original name
  useTimestamp?: boolean;
  // Optional allowed MIME types list for extra validation
  allowedTypes?: string[];
  // Optional max size in bytes
  maxSizeBytes?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
  bucket = "portfolio-images",
  accept = "image/*"
  , pathPrefix, fixedNamePrefix, useTimestamp = false, allowedTypes, maxSizeBytes
}: ImageUploaderProps) {
  const supabase = createClient();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(10);

      // Validate file type if allowedTypes provided
      if (allowedTypes && allowedTypes.length > 0) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Invalid file type for upload.");
        }
      }

      // Validate max size if provided
      if (maxSizeBytes && file.size > maxSizeBytes) {
        throw new Error("File is too large. Maximum allowed size is " + Math.round(maxSizeBytes / 1024) + "KB.");
      }

      // 1. Generate unique file path
      const fileExt = file.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 9);
      let filename = "";
      if (fixedNamePrefix) {
        if (useTimestamp) {
          filename = `${fixedNamePrefix}-${Date.now()}.${fileExt}`;
        } else {
          filename = `${fixedNamePrefix}-${randomId}.${fileExt}`;
        }
      } else if (useTimestamp) {
        filename = `file-${Date.now()}.${fileExt}`;
      } else {
        const sanitizedFileName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();
        filename = `${sanitizedFileName}-${randomId}.${fileExt}`;
      }

      const filePath = pathPrefix ? `${pathPrefix}/${filename}` : filename;

      setProgress(30);

      // 2. Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(70);

      // 3. Get Public URL of uploaded asset
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      onChange(publicUrl);
    } catch (err: any) {
      console.error("Storage upload error:", err);
      setError(err.message || "Failed to upload file to storage.");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const isPdf = value.toLowerCase().endsWith(".pdf") || value.includes("/raw/") || accept.includes("pdf");

  return (
    <div className="flex flex-col text-left space-y-2 w-full">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {value ? (
        // Preview Frame
        <div className="relative group w-full rounded-2xl border border-white/[0.08] bg-black/45 overflow-hidden flex items-center justify-center min-h-[160px]">
          {isPdf ? (
            // PDF Preview
            <div className="flex flex-col items-center justify-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-300 font-semibold truncate max-w-[200px]">
                {value.split("/").pop()}
              </span>
              <a 
                href={value} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-neon-blue hover:underline"
              >
                Open in new tab
              </a>
            </div>
          ) : (
            // Image Preview
            <div className="relative w-full aspect-[16/10] bg-[#050508]/40">
              <Image
                src={value}
                alt="Upload preview"
                fill
                sizes="400px"
                className="object-contain p-2"
                unoptimized
              />
            </div>
          )}

          {/* Delete Button */}
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 text-gray-400 hover:text-white border border-white/[0.08] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Drag and Drop Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          className={`w-full min-h-[160px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer ${
            isDragging
              ? "border-neon-purple bg-neon-purple/5 shadow-[0_0_20px_-3px_rgba(139,92,246,0.15)]"
              : "border-white/[0.08] bg-black/25 hover:border-white/20 hover:bg-white/[0.01]"
          }`}
        >
          {isUploading ? (
            // Uploading state
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white block">Uploading asset...</span>
                <span className="text-[10px] text-gray-500 font-mono block">{progress}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-32 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-pink transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            // Default upload prompt
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400">
                {accept.includes("pdf") ? <FileText className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-300 block">Drag & drop files here</span>
                <span className="text-[10px] text-gray-500 block">or click to browse files</span>
              </div>
              <span className="text-[9px] text-gray-600 font-mono block uppercase">
                {accept.includes("pdf") ? "PDF documents up to 5MB" : "PNG, JPG, WEBP, or GIF"}
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <span className="text-[10px] text-red-400 mt-1 leading-relaxed block">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}
