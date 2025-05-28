import { useState, useEffect } from "react";
import { fillPdf } from "../../utils/editPdf";

export default function EmailPreview({ formData }) {
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
      <h2 className="text-xl font-bold mb-4">Prévia do E-mail</h2>
      <div className="bg-gray-50 p-4 rounded border">
        <p>
          <b>Nome:</b> {formData.name}
        </p>
        <p>
          <b>Email:</b> {formData.email}
        </p>
        <p>
          <b>RG:</b> {formData.docRG}
        </p>
        <p>
          <b>CPF:</b> {formData.docCPF}
        </p>
        <p>
          <b>Telefone:</b> {formData.phone}
        </p>
        <p>
          <b>Cidade Transporte:</b> {formData.city}
        </p>
        <p>
          <b>Instituição:</b> {formData.institution}
        </p>
        <p>
          <b>Curso:</b> {formData.course}
        </p>
        <p>
          <b>Período:</b> {formData.period}
        </p>
        <p>
          <b>Mês:</b> {formData.month}
        </p>
        <p>
          <b>Vezes no mês:</b> {formData.timesInMonth}
        </p>
        <p>
          <b>Comprovante:</b>{" "}
          {formData.attachments && formData.attachments[0]?.name}
        </p>
        <p>
          <b>Assinatura:</b>
        </p>
        {formData.signature && (
          <img
            src={formData.signature}
            alt="Assinatura"
            style={{
              maxWidth: 300,
              border: "1px solid #ccc",
              background: "#fff",
            }}
          />
        )}
      </div>
      {loading && (
        <div className="text-blue-600 font-medium">Gerando PDF...</div>
      )}
      {pdfUrl && (
        <div className="mt-4 space-y-2">
          <a
            href={pdfUrl}
            download="documento-assinado.pdf"
            className="text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Baixar PDF Assinado
          </a>
          <div className="mt-4">
            <iframe
              src={pdfUrl}
              title="Pré-visualização do PDF"
              width="100%"
              height="500px"
              style={{ border: "1px solid #ccc", borderRadius: 8 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
