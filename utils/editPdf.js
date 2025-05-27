import { PDFDocument, rgb } from "pdf-lib";

export async function fillPdf(formData, signatureUrl) {
  try {
    // 1. Carregar o template PDF
    const pdfBytes = await fetch("/template.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(0);

    // 2. Adicionar os campos de texto
    const { name, dateOfBirth, placeOfBirth, address, zipCode } = formData;
    const textOptions = { size: 12, color: rgb(0, 0, 0) };

    page.drawText(`Name: ${name}`, { x: 50, y: 700, ...textOptions });
    page.drawText(`Date of Birth: ${dateOfBirth}`, {
      x: 50,
      y: 680,
      ...textOptions,
    });
    page.drawText(`Place of Birth: ${placeOfBirth}`, {
      x: 50,
      y: 660,
      ...textOptions,
    });
    page.drawText(`Address: ${address}`, { x: 50, y: 640, ...textOptions });
    page.drawText(`Zip Code: ${zipCode}`, { x: 50, y: 620, ...textOptions });

    // 3. Adicionar a assinatura (se existir)
    if (signatureUrl) {
      const pngImage = await pdfDoc.embedPng(signatureUrl);
      page.drawImage(pngImage, {
        x: 50,
        y: 550,
        width: 200,
        height: 80,
      });
    }

    // 4. Salvar e retornar o PDF modificado
    return await pdfDoc.save();
  } catch (error) {
    console.error("Error editing PDF:", error);
    throw error;
  }
}
