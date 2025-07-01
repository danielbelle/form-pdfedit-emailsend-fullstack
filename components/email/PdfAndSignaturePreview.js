import { useState, useEffect, useRef } from "react";
import { fillPdf } from "../../utils/editPdf";

export default function PdfAndSignaturePreview({ formData, onPdfGenerated }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevUrl = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const generatePdf = async () => {
      setLoading(true);
      try {
        const pdfBytes = await fillPdf(formData, formData.signature);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        // Revoga o URL anterior para evitar vazamento de memória e recarregamento desnecessário
        if (prevUrl.current) {
          URL.revokeObjectURL(prevUrl.current);
        }
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setPdfUrl(url);
          prevUrl.current = url;
        }

        // Salva o PDF em base64 no formData
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (onPdfGenerated) {
            onPdfGenerated(reader.result); // base64 string
          }
        };
      } catch (err) {
        alert("Erro ao gerar PDF");
      }
      if (isMounted) setLoading(false);
    };
    generatePdf();

    // Cleanup do URL ao desmontar
    return () => {
      isMounted = false;
      if (prevUrl.current) {
        URL.revokeObjectURL(prevUrl.current);
        prevUrl.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formData)]); // Só gera novo PDF se formData realmente mudar

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Assinatura e PDF Gerado</h2>
      <div className="bg-gray-50 p-4 rounded border">
        {formData.signature ? (
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
        ) : (
          <div className="text-red-600 text-sm mt-2">
            Nenhuma assinatura criada.
          </div>
        )}

        {loading && (
          <div className="text-blue-600 font-medium">Gerando PDF...</div>
        )}
        {pdfUrl && !loading && (
          <div className="mt-4">
            {/* Desktop: mostra o iframe, Mobile: mostra botão de download */}
            <div className="block md:hidden">
              <a
                href={pdfUrl}
                download="auxilio-transporte.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Baixar PDF Gerado
              </a>
              <div className="text-xs text-gray-500 mt-2">
                Visualização de PDF não suportada em alguns celulares. Clique para
                baixar.
              </div>
            </div>
            <div className="hidden md:block">
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

        {/* Exibir anexo depois do PDF gerado */}
        {formData.attachments && formData.attachments.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Comprovante Anexado:</h4>
            {formData.attachments.map((file, idx) => {
              // Gera URL local apenas se não existir
              let url = file.url;
              if (!url) {
                url = URL.createObjectURL(file);
              }
              // Permite apenas blobs locais ou arquivos sem http/https
              const isSafeUrl =
                url.startsWith("blob:") ||
                url.startsWith("data:") ||
                (!url.startsWith("http://") && !url.startsWith("https://"));

              // Se não for seguro, apenas mostra o nome do arquivo
              if (!isSafeUrl) {
                return (
                  <div key={idx} className="text-red-600">
                    Arquivo não suportado ou potencialmente inseguro:{" "}
                    {file.name}
                  </div>
                );
              }

              // Se for imagem, mostrar preview
              if (
                file.type &&
                (file.type.startsWith("image/") ||
                  file.name.match(/\.(png|jpg|jpeg|webp)$/i))
              ) {
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={file.name}
                    className="mb-2 max-h-48 border rounded"
                    style={{ maxWidth: 300 }}
                  />
                );
              }
              // Se for PDF, mostrar embed
              if (
                file.type === "application/pdf" ||
                file.name.match(/\.pdf$/i)
              ) {
                return (
                  <iframe
                    key={idx}
                    src={url}
                    title={file.name}
                    width="100%"
                    height="400px"
                    className="border rounded mb-2"
                  />
                );
              }
              // Caso não reconhecido, apenas mostra o nome
              return (
                <div key={idx} className="text-gray-700">
                  {file.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
