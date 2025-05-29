import { PDFDocument, rgb } from "pdf-lib";

export async function fillPdf(formData, signatureUrl) {
  const PDFpositions = {
    name: [39, 48],
    docRG: [90, 58],
    docCPF: [37, 67],
    course: [32, 77],
    period: [79, 87],
    institution: [33, 96],
    month: [101, 126],
    timesInMonth: [172, 126],
    city: [127, 136],
    sign: [100, 140], // assinatura (imagem)
    signatureName: [92, 171],
  };
  try {
    // 1. Carregar o template PDF
    const pdfBytes = await fetch("/template.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(0);

    // Conversão de cm para pontos
    const CM_TO_PT = 2.83465; // 1 cm = 28.3465 pontos
    const pageHeight = page.getHeight();

    // 2. Adicionar os campos de texto
    const textOptions = { size: 13, color: rgb(0, 0, 0) };

    // Mapeamento dos campos do formData para PDFpositions
    const fieldMap = {
      name: formData.name,
      docRG: formData.docRG,
      docCPF: formData.docCPF,
      course: formData.course,
      // Adiciona " º" ao período se houver valor
      period: formData.period ? `${formData.period} º` : "",
      institution: formData.institution,
      month: formData.month,
      timesInMonth: String(formData.timesInMonth),
      city: formData.city,
      signatureName: formData.name,
    };

    // Escreve os textos nos locais definidos (0,0 no topo esquerdo, medidas em cm)
    Object.entries(PDFpositions).forEach(([key, [xCm, yCm]]) => {
      if (key === "sign") return; // assinatura é imagem, não texto
      if (fieldMap[key]) {
        const x = xCm * CM_TO_PT;
        const y = pageHeight - yCm * CM_TO_PT;
        const options =
          key === "signatureName" || key === "month"
            ? { ...textOptions, size: 9 }
            : textOptions;
        page.drawText(String(fieldMap[key]), {
          x,
          y,
          ...options,
        });
      }
    });

    // 3. Adicionar a assinatura (imagem) se existir
    if (signatureUrl) {
      const pngImage = await pdfDoc.embedPng(signatureUrl);
      const [xCm, yCm] = PDFpositions.sign;
      const x = xCm * CM_TO_PT - 80;
      const y = pageHeight - yCm * CM_TO_PT - 80;
      page.drawImage(pngImage, {
        x,
        y,
        width: 180, // exemplo: 6cm de largura
        height: 60, // exemplo: 2cm de altura
      });
    }

    // 4. Salvar e retornar o PDF modificado
    return await pdfDoc.save();
  } catch (error) {
    console.error("Error editing PDF:", error);
    throw error;
  }
}
