import { useState, useEffect } from "react";
import { fillPdf } from "../../utils/editPdf";
import PdfAndSignaturePreview from "./PdfAndSignaturePreview";

export default function EmailPreview({ formData }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ajuste dos links para os PDFs das leis na pasta public
  const docLei2721 = "/Lei-n-2.721-2011-atualizada.pdf";
  const docLei3647 = "/Lei-n-3.647-2025.pdf";

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
        <p className="mt-1">Olá, equipe da Prefeitura Municipal de Viadutos.</p>
        <p className="mt-4">
          Este é um e-mail preenchido automaticamente pelo(a) estudante(a):
          <span className="font-bold"> {formData.name}</span>.
        </p>
        <p className="mt-4">
          <span>
            No mesmo contém o anexo da Declaração do auxílio transporte,
            previsto na{" "}
            <a
              className="hover:underline text-blue-700"
              href={docLei2721}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lei Municipal nº 2.721/2011
            </a>
            , que regulamenta o auxílio transporte, alterada pela{" "}
            <a
              className="hover:underline text-blue-700"
              href={docLei3647}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lei Municipal nº 3.647/2025
            </a>
            .
          </span>
        </p>
        <p className="mt-4">
          Uma cópia deste e-mail foi enviada para o e-mail do(a) estudante(a):
          <span className="font-bold">{formData.email}</span>.
        </p>
        <p className="mt-4">Atenciosamente, </p>
        <span className="font-bold"> {formData.name}</span>.
      </div>
    </div>
  );
}
