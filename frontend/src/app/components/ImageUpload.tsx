"use client";
import { useState, useEffect } from "react";
import { UploadButton } from "../../utils/uploadthing";

type UploadResult = {
  name: string;
  url: string;
  key: string;
};

interface ImageUploadProps {
  onUploadComplete: (data: UploadResult) => void;
  initialUrl?: string; // ✅ New prop for showing existing image
}

export default function ImageUpload({ onUploadComplete, initialUrl }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl || "");

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const uploaded = res[0];
          const result = {
            name: uploaded.name,
            url: uploaded.ufsUrl,
            key: uploaded.key,
          };
          setPreviewUrl(uploaded.ufsUrl);
          onUploadComplete(result);
        }}
        onUploadError={(error) => {
          alert(`Upload Error: ${error.message}`);
        }}
        appearance={{
          button: "bg-sky-800 hover:bg-sky-950 text-white font-semibold px-4 py-2 rounded shadow",
          container: "flex justify-center",
        }}
      />

      {previewUrl && (
        <div className="w-48 h-48 rounded overflow-hidden border border-gray-300 shadow">
          <img
            src={previewUrl}
            alt="Uploaded Logo"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
