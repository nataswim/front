import React, { useState, useRef } from 'react';
import { FaUpload, FaImage, FaFile, FaVideo, FaMusic, FaTrash } from 'react-icons/fa';

const FileUpload = ({
  id,
  name,
  onChange,
  label = 'Téléverser un fichier',
  accept = 'image/*',
  multiple = false,
  disabled = false,
  error,
  onRemove,
  initialFiles = [],
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(initialFiles);
  const [previews, setPreviews] = useState({});

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <FaImage />;
    if (file.type.startsWith('video/')) return <FaVideo />;
    if (file.type.startsWith('audio/')) return <FaMusic />;
    return <FaFile />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = selectedFiles.filter(file => {
      const fileType = file.type.split('/')[0];
      return !['image', 'video', 'audio'].includes(fileType) && 
             file.type !== 'application/pdf';
    });

    if (invalidFiles.length > 0) {
      alert('Types de fichiers non supportés. Utilisez des images, vidéos, audios ou PDFs.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert('Certains fichiers dépassent la limite de 5MB.');
      return;
    }

    // Update files state
    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    setFiles(newFiles);

    // Generate previews for images
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [file.name]: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    // Call onChange handler
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0]);
    }
  };

  // Remove a file
  const handleRemove = (fileToRemove, index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (previews[fileToRemove.name]) {
      const updatedPreviews = { ...previews };
      delete updatedPreviews[fileToRemove.name];
      setPreviews(updatedPreviews);
    }

    if (onRemove) {
      onRemove(fileToRemove, index, updatedFiles);
    }

    if (onChange) {
      onChange(multiple ? updatedFiles : null);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}

      <div 
        className={`
          card bg-light border-2 ${error ? 'border-danger' : 'border-primary'} 
          ${disabled ? 'opacity-75' : ''} mb-3
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <div className="card-body text-center py-5">
          <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFileChange}
          />
          
          <FaUpload className="text-primary mb-3" size={32} />
          <p className="mb-1">
            {files.length > 0 ? 'Cliquez pour ajouter plus de fichiers' : 'Cliquez pour sélectionner des fichiers'}
          </p>
          <p className="text-muted small mb-0">
            ou glissez-déposez vos fichiers ici
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="list-group">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="list-group-item">
              <div className="d-flex align-items-center">
                {/* Preview or Icon */}
                <div className="me-3" style={{width: '50px', height: '50px'}}>
                  {previews[file.name] ? (
                    <img 
                      src={previews[file.name]}
                      alt={file.name}
                      className="img-fluid rounded"
                      style={{width: '50px', height: '50px', objectFit: 'cover'}}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-grow-1">
                  <h6 className="mb-0 text-truncate">{file.name}</h6>
                  <small className="text-muted">{formatFileSize(file.size)}</small>
                </div>

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(file, index);
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;