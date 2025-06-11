import { useState, useEffect } from "react";

export default function FileUpload({ onFileChange, value }) {
  const [files, setFiles] = useState(value || []);
  const [error, setError] = useState("");

  useEffect(() => {
    setFiles(value || []);
  }, [value]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFiles([selectedFile]);
    setError("");
    onFileChange([selectedFile]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Comprovante de Presença</h3>
      <div className="border border-gray-300 rounded-lg p-4">
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="block w-1/2 text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Escolher arquivo:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
