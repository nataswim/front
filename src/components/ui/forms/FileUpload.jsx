import React, { useState, useRef } from 'react';
import { FaUpload, FaImage, FaFile, FaVideo, FaMusic, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * Composant de téléchargement de fichiers accessible
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID unique pour le champ
 * @param {string} props.name - Nom du champ pour les formulaires
 * @param {Function} props.onChange - Fonction appelée lors du changement de fichier
 * @param {string} [props.label='Téléverser un fichier'] - Texte d'étiquette
 * @param {string} [props.accept='image/*'] - Types de fichiers acceptés
 * @param {boolean} [props.multiple=false] - Autoriser plusieurs fichiers
 * @param {boolean} [props.disabled=false] - Désactiver le champ
 * @param {string} [props.error] - Message d'erreur à afficher
 * @param {Function} [props.onRemove] - Fonction appelée lors de la suppression d'un fichier
 * @param {Array} [props.initialFiles=[]] - Fichiers initiaux
 * @param {string} [props.className=''] - Classes CSS additionnelles
 */
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
  
  // Générer un ID unique pour les messages d'erreur
  const errorId = error ? `${id}-error` : undefined;

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <FaImage aria-hidden="true" />;
    if (file.type.startsWith('video/')) return <FaVideo aria-hidden="true" />;
    if (file.type.startsWith('audio/')) return <FaMusic aria-hidden="true" />;
    return <FaFile aria-hidden="true" />;
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
        <label className="form-label" htmlFor={id}>
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
        role="button"
        tabIndex="0"
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            !disabled && fileInputRef.current?.click();
          }
        }}
        aria-labelledby={`${id}-instructions`}
      >
        <div className="card-body text-center py-5">
          <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            id={id}
            name={name}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFileChange}
            aria-describedby={errorId}
            aria-invalid={error ? 'true' : 'false'}
          />
          
          <FaUpload className="text-primary mb-3" size={32} aria-hidden="true" />
          <p className="mb-1" id={`${id}-instructions`}>
            {files.length > 0 ? 'Cliquez pour ajouter plus de fichiers' : 'Cliquez pour sélectionner des fichiers'}
          </p>
          <p className="text-muted small mb-0">
            ou glissez-déposez vos fichiers ici
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2" id={errorId} role="alert">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="list-group" role="list" aria-label="Fichiers sélectionnés">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="list-group-item" role="listitem">
              <div className="d-flex align-items-center">
                {/* Preview or Icon */}
                <div className="me-3" style={{width: '50px', height: '50px'}}>
                  {previews[file.name] ? (
                    <img 
                      src={previews[file.name]}
                      alt={`Aperçu de ${file.name}`}
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
                    aria-label={`Supprimer le fichier ${file.name}`}
                  >
                    <FaTrash aria-hidden="true" />
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

// PropTypes pour la vérification des types
FileUpload.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  onRemove: PropTypes.func,
  initialFiles: PropTypes.array,
  className: PropTypes.string
};

export default FileUpload;