import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface UploadBoxProps {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onImageSelected: (file: File, previewUrl: string) => void;
  onRemoveImage: () => void;
  onAutoIngredientsDetected?: (ingredients: string[]) => void;
  isAnalyzing?: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  imageFile,
  imagePreviewUrl,
  onImageSelected,
  onRemoveImage,
  onAutoIngredientsDetected,
  isAnalyzing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold font-heading text-stone-900 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>Upload Ingredients or Fridge Photo</span>
        </label>
        <span className="text-xs text-stone-500 font-medium">Optional</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        id="image-file-input"
      />

      {!imagePreviewUrl ? (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3.5 group ${
            isDragOver
              ? 'border-amber-500 bg-amber-50/70 scale-[1.01]'
              : 'border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/30'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-stone-800">
              Drag and drop your ingredients photo here, or{' '}
              <span className="text-amber-600 underline font-bold">browse</span>
            </p>
            <p className="text-xs text-stone-500">
              Supports JPEG, PNG, WEBP (Max 10MB)
            </p>
          </div>

          <button
            id="browse-image-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
            className="mt-1 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 shadow-xs transition-colors"
          >
            Browse Image
          </button>
        </div>
      ) : (
        /* Image Preview Box */
        <div
          id="image-preview-container"
          className="relative bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
            <img
              src={imagePreviewUrl}
              alt="Ingredients preview"
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1 w-full">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Image loaded successfully</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 truncate max-w-xs sm:max-w-md">
              {imageFile?.name || 'Selected Pantry Photo'}
            </p>
            <p className="text-xs text-stone-500">
              {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'Analyzed by vision engine'}
            </p>
          </div>

          <button
            id="remove-image-btn"
            type="button"
            onClick={onRemoveImage}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
          >
            <X className="w-4 h-4" />
            <span>Remove Image</span>
          </button>
        </div>
      )}
    </div>
  );
};
