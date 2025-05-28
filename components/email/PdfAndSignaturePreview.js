import { useState, useEffect } from "react";
import { fillPdf } from "../../utils/editPdf";

export default function PdfAndSignaturePreview({ formData }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generatePdf = async () => {
      setLoading(true);
      try {
        const pdfBytes = await fillPdf(formData, formData.signature);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        alert("Erro ao gerar PDF");
      }
      setLoading(false);
    };
    generatePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Assinatura e PDF Gerado</h2>
      <div className="bg-gray-50 p-4 rounded border">
        {formData.signature && (
          <>
            <img
              src={formData.signature}
              alt="Assinatura"
              style={{
                maxWidth: "mx-auto",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
              title="Clique para baixar a assinatura"
              onClick={() => {
                const link = document.createElement("a");
                link.href = formData.signature;
                link.download = "assinatura.png";
                link.click();
              }}
            />
            <div className="mt-2 text-sm text-gray-600">
              Clique na assinatura para baixar
            </div>
          </>
        )}
      </div>
      {loading && (
        <div className="text-blue-600 font-medium">Gerando PDF...</div>
      )}
      {pdfUrl && (
        <div className="mt-4">
          <iframe
            src={pdfUrl}
            title="Pré-visualização do PDF"
            width="100%"
            height="500px"
            style={{ border: "1px solid #ccc", borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
}
