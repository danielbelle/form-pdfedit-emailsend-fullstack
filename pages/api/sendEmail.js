import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message, attachments } = req.body;

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
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USERNAME,
        to: process.env.EMAIL_RECEIVER,
        subject: `New message from ${name}`,
        text: message,
        replyTo: email,
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
