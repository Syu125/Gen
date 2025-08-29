import React, { useState, useRef, useEffect } from 'react';
import styles from './ImageUploader.module.css';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  className,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup function to revoke the object URL when the component unmounts or previewUrl changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageChange(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
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

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${styles.uploader} ${className || ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className={styles.hiddenInput}
      />

      {previewUrl ? (
        <div className={styles.previewContainer}>
          <Image
            src={previewUrl}
            alt="Event preview"
            className={styles.previewImage}
            width={500} // Provide a fixed width
            height={300} // Provide a fixed height
          />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              className={styles.changeButton}
              onClick={handleClick}
            >
              Change Image
            </button>
            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.uploadArea} ${isDragOver ? styles.dragOver : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>Upload Event Image</p>
              <p className={styles.uploadSubtitle}>
                Drag and drop an image here, or click to browse
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
