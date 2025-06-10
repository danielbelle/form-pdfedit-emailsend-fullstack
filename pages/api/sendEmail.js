import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.headers["x-csrf-token"] !== req.cookies.csrfToken) {
    return res.status(403).json({ error: "Token CSRF inválido" });
  }
  if (req.method === "POST") {
    const { name, message, attachments, month } = req.body;

    // attachments deve ser um array de objetos: [{ filename, content (base64), contentType }]
    const formattedAttachments = Array.isArray(attachments)
      ? attachments.map((att) => ({
          filename: att.filename,
          content: att.content, // base64 string
          encoding: "base64",
          contentType: att.contentType,
        }))
      : [];

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.REFEMAIL_SENDER_N,
        pass: process.env.REFEMAIL_SENDER_P,
      },
    });

    try {
      await transporter.sendMail({
        from: {
          name: "Formulário Transporte",
          address: process.env.REFEMAIL_SENDER_N,
        },
        to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
        subject: `Auxílio Transporte Mês-${month} - ${name}`,
        text: message,
        attachments: formattedAttachments,
      });
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send email." });
    }
  } else {
    res.status(405).json({ message: "Only POST requests allowed." });
  }
}
