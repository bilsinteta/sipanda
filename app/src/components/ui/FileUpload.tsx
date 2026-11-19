'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.docx,.xlsx',
  maxSizeMB = 5,
  label = 'Unggah Dokumen',
  hint = 'Format: PDF, DOCX, XLSX (Maks. 5 MB). Dioptimasi untuk transfer data ramah lingkungan.',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (file: File) => {
    setError(null);
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setError(`Ukuran berkas melebihi ${maxSizeMB} MB (${sizeInMB.toFixed(1)} MB). Harap kompresi dokumen untuk hemat energi.`);
      return;
    }
    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {selectedFileName ? (
            <div className="text-sm">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedFileName}
              </span>{' '}
              <span className="text-slate-500 text-xs">
                ({((selectedFileSize || 0) / 1024).toFixed(0)} KB)
              </span>
              <p className="text-xs text-slate-400 mt-1">Klik untuk mengganti berkas</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tarik & letakkan berkas proposal di sini, atau{' '}
                <span className="text-emerald-600 dark:text-emerald-400 underline">pilih berkas</span>
              </p>
              {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
            </>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{error}</p>}
    </div>
  );
};

