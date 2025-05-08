// TextEditor réutilisable
// pour remplacer le <textarea> par TextEditor dans les composats 
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import PropTypes from 'prop-types';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const TextEditor = ({ value, onChange, id = "quill-editor", label, required = false }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const uniqueId = id || `editor-${Math.random().toString(36).substring(2, 9)}`;
  const labelId = `${uniqueId}-label`;
  const descriptionId = `${uniqueId}-description`;

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: modules,
      });

      if (value) {
        quillInstance.current.root.innerHTML = value;
      }

      quillInstance.current.on("text-change", () => {
        onChange(quillInstance.current.root.innerHTML);
      });

      // Ajouter des attributs d'accessibilité
      const editorElement = editorRef.current.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.setAttribute('role', 'textbox');
        editorElement.setAttribute('aria-multiline', 'true');
        editorElement.setAttribute('aria-labelledby', labelId);
        editorElement.setAttribute('aria-describedby', descriptionId);
        if (required) {
          editorElement.setAttribute('aria-required', 'true');
        }
      }
    }

    // Mise à jour du contenu si la valeur change de l'extérieur
    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value || '';
    }
  }, [value, onChange, uniqueId, labelId, descriptionId, required]);

  return (
    <div className="mb-3">
      {label && (
        <label id={labelId} className="form-label d-block mb-2">
          {label}
          {required && <span className="text-danger ms-1" aria-hidden="true">*</span>}
          {required && <span className="visually-hidden">(obligatoire)</span>}
        </label>
      )}
      <div ref={editorRef} style={{ height: "300px" }} />
      <div id={descriptionId} className="visually-hidden">
        Éditeur de texte riche. Utilisez la barre d'outils pour formater le texte.
      </div>
    </div>
  );
};

TextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool
};

export default TextEditor;