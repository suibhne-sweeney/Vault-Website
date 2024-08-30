import { useRef, useState } from "react";
import { ImageUp } from 'lucide-react';
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
  onChange,
} : {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div onClick={handleClick} className="cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="p-2 rounded-md border border-dotted hover:outline-dashed">
          <div className="relative w-full max-w-xl mx-auto">
            {files.length > 0 ? (
              files.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-neutral-900 p-4 rounded-md shadow-sm"
                >
                  <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {file.type} - {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Modified: {new Date(file.lastModified).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-16 w-full max-w-[8rem] mx-auto border border-gray-300 dark:border-neutral-700 rounded-md">
                {isDragActive ? (
                  <p className="text-neutral-600 dark:text-neutral-400">Drop it</p>
                ) : (
                  <ImageUp className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
