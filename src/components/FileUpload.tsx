import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Presentation } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  fileType: 'pdf' | 'pptx';
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, fileType, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const validTypes = fileType === 'pdf' 
      ? ['application/pdf']
      : ['application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    if (!validTypes.includes(file.type)) {
      toast.error(`Please upload a ${fileType.toUpperCase()} file`);
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(file);
      onClose();
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, fileType, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileType === 'pdf' 
      ? { 'application/pdf': ['.pdf'] }
      : { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
    maxFiles: 1,
  });

  return (
    <div className="p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {fileType === 'pdf' ? (
            <FileText className="w-12 h-12 text-gray-400" />
          ) : (
            <Presentation className="w-12 h-12 text-gray-400" />
          )}
          <div className="text-lg font-medium">
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <p>Drag & drop a {fileType.toUpperCase()} file here, or click to select</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {fileType === 'pdf' ? 'PDF files only' : 'PowerPoint files only'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Select File
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload; 