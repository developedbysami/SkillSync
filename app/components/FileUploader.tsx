import { useState, useCallback, type MouseEvent } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  // 1. ADD LOCAL STATE: This lets us manually clear the file from the UI
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null;

      // Update local state and parent state
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    [onFileSelect]
  );

  // 2. REMOVE FUNCTION: Clears both states
  const removeFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents opening the file picker again
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
                    relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all
                    ${
                      isDragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800"
                    }
                `}
      >
        <input {...getInputProps()} />

        {file ? (
          // STATE: FILE SELECTED
          <div
            className="flex w-full items-center justify-between rounded-lg bg-slate-800 p-4 border border-slate-700"
            onClick={(e) => e.stopPropagation()} // Stop click from bubbling to dropzone
          >
            <div className="flex items-center space-x-4 overflow-hidden">
              <img
                src="/images/pdf.png"
                alt="pdf"
                className="w-10 h-10 object-contain"
              />

              <div className="flex flex-col overflow-hidden">
                <p className="truncate text-sm font-medium text-white max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {formatSize(file.size)}
                </p>
              </div>
            </div>

            {/* REMOVE BUTTON */}
            <button
              type="button"
              className="rounded-full p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={removeFile}
            >
              <img
                src="/icons/cross.svg"
                alt="remove"
                className="w-5 h-5 invert opacity-70 hover:opacity-100"
              />
            </button>
          </div>
        ) : (
          // STATE: EMPTY / DROPZONE
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
              <img
                src="/icons/info.svg"
                alt="upload"
                className="w-6 h-6 invert opacity-50"
              />
            </div>
            <div>
              <p className="text-lg text-slate-300">
                <span className="font-semibold text-indigo-400 hover:underline">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-slate-500">
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
