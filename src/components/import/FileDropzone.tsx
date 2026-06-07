import { useMemo, type ChangeEvent } from "react";

interface FileDropzoneProps {
  platform: "whatsapp" | "instagram";
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function FileDropzone({
  platform,
  file,
  onFileChange,
  disabled = false,
}: FileDropzoneProps) {
  const acceptExtension = platform === "instagram" ? ".json" : ".txt";

  const fileDetailsLabel = useMemo(() => {
    if (!file) return "No data backup package staged";
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return `${file.name} (${sizeInMb} MB)`;
  }, [file]);

  function handleFileSelection(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    onFileChange(selectedFile);
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Upload Source Log Package
      </label>
      
      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all bg-slate-50/50 relative ${
        disabled 
          ? "border-slate-200 bg-slate-100/50 cursor-not-allowed" 
          : "border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
      }`}>
        <input
          id="dropzone-file-input"
          type="file"
          accept={acceptExtension}
          onChange={handleFileSelection}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="pointer-events-none space-y-2">
          <div className="text-2xl">
            {file ? "📄" : "📥"}
          </div>
          <p className="text-sm font-medium text-slate-600">
            {file ? "Package prepared and mounted ready" : `Click or drag a target ${acceptExtension} archive`}
          </p>
          <p className="text-xs text-slate-400 font-mono tracking-tight">
            {fileDetailsLabel}
          </p>
        </div>
      </div>
    </div>
  );
}