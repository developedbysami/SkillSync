import { useState, useCallback, type MouseEvent } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null;

      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    [onFileSelect]
  );

  const removeFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect?.(null);
  };

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
            relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200 ease-in-out
            ${
              isDragActive
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
            }
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div
            className="flex w-full items-center justify-between rounded-lg bg-white p-4 border border-slate-200 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-4 overflow-hidden">
              <img
                src="/images/pdf.png"
                alt="pdf"
                className="w-10 h-10 object-contain"
              />

              <div className="flex flex-col overflow-hidden text-left">
                <p className="truncate text-sm font-semibold text-slate-900 max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>

                <p className="text-xs text-slate-500">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>

            {/* REMOVE BUTTON */}
            <button
              type="button"
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors cursor-pointer"
              onClick={removeFile}
            >
              <img
                src="/icons/cross.svg"
                alt="remove"
                className="w-5 h-5 opacity-60 hover:opacity-100"
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
              <img
                src="/icons/info.svg"
                alt="upload"
                className="w-5 h-5 opacity-60"
              />
            </div>
            <div>
              <p className="text-lg text-slate-600">
                <span className="font-semibold text-indigo-600 hover:underline hover:text-indigo-700">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-slate-500 mt-1">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FileUploader;
