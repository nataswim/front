// TextEditor réutilisable
// pour remplacer le <textarea> par TextEditor dans les composats 
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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

const TextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: modules, // Appliquer la nouvelle toolbar
      });

      if (value) {
        quillInstance.current.root.innerHTML = value;
      }

      quillInstance.current.on("text-change", () => {
        onChange(quillInstance.current.root.innerHTML);
      });
    }
  }, []);

  return <div ref={editorRef} style={{ height: "300px" }} />;
};

export default TextEditor;
