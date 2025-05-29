import sgMail from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { formData, pdfBytes, attachments } = req.body;

    const msg = {
      to: process.env.EMAIL_RECEIVER || "recipient@example.com",
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      subject: formData.name + " - Auxilio Transporte",
      text: "123321",
      html: "<strong>Please find attached your completed form.</strong>",
      attachments: [
        {
          content: Buffer.from(pdfBytes).toString("base64"),
          filename: "completed_form.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
        ...(attachments || []).map((file) => ({
          content: Buffer.from(file).toString("base64"),
          filename: file.name || "attachment",
          type: file.type || "application/octet-stream",
        })),
      ],
    };

    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Falha ao enviar o e-mail" });
  }
}
