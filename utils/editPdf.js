import { PDFDocument, rgb } from "pdf-lib";

const PDFpositions = {
  name: [37, 46],
  docRG: [88, 56],
  docCPF: [35, 66],
  course: [30, 75],
  period: [77, 85],
  institution: [31, 95],
  month: [101, 124],
  timesInMonth: [170, 124],
  city: [125, 134],
  sign: [86, 150], // assinatura (imagem)
  signatureName: [91, 170],
};

export async function fillPdf(formData, signatureUrl) {
  try {
    // 1. Carregar o template PDF
    const pdfBytes = await fetch("/template.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(0);

    // 2. Adicionar os campos de texto
    const textOptions = { size: 12, color: rgb(0, 0, 0) };

    // Mapeamento dos campos do formData para PDFpositions
    const fieldMap = {
      name: formData.name,
      docRG: formData.docRG,
      docCPF: formData.docCPF,
      course: formData.course,
      period: formData.period,
      institution: formData.institution,
      month: formData.month,
      timesInMonth: String(formData.timesInMonth),
      city: formData.city,
      signatureName: formData.signatureName,
    };

    // Escreve os textos nos locais definidos
    Object.entries(PDFpositions).forEach(([key, [x, y]]) => {
      if (key === "sign") return; // assinatura é imagem, não texto
      if (fieldMap[key]) {
        page.drawText(fieldMap[key], {
          x: 210 - x,
          y: 297 - y,
          ...textOptions,
        });
      }
    });

    // 3. Adicionar a assinatura (imagem) se existir
    if (signatureUrl) {
      const pngImage = await pdfDoc.embedPng(signatureUrl);
      const [x, y] = PDFpositions.sign;
      page.drawImage(pngImage, {
        x,
        y,
        width: 120,
        height: 40,
      });
    }

    // 4. Salvar e retornar o PDF modificado
    return await pdfDoc.save();
  } catch (error) {
    console.error("Error editing PDF:", error);
    throw error;
  }
}
