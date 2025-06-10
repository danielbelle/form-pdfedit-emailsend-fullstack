import nodemailer from "nodemailer";
import Tokens from "csrf";

// ======================
// Configurações de Segurança
// ======================

// 2. Domínios permitidos (CORS)
const allowedOrigins = [
  "https://transporteviadutos.vercel.app",
  process.env.NODE_ENV === "development" && "http://localhost:3000",
].filter(Boolean);

// 3. Tipos MIME permitidos para anexos
const ALLOWED_MIME_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ======================
// Handler Principal
// ======================
async function emailHandler(req, res) {
  try {
    // 1. Verificação de Origem (CORS)
    const origin = req.headers.origin || req.headers.referer;
    if (!allowedOrigins.some((allowed) => origin?.includes(allowed))) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    // 2. Configura CORS headers
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");

    // 3. Verificação CSRF
    const tokens = new Tokens();
    const secret = req.cookies.csrfToken;
    const token = req.headers["x-csrf-token"];
    if (!secret || !token || !tokens.verify(secret, token)) {
      return res.status(403).json({ error: "Token CSRF inválido" });
    }

    // 4. Apenas aceita POST
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método não permitido" });
    }

    const { name, attachments, month } = req.body;

    // 5. Validação de Anexos
    if (attachments) {
      for (const att of attachments) {
        if (!ALLOWED_MIME_TYPES.includes(att.contentType)) {
          return res
            .status(400)
            .json({ error: "Tipo de arquivo não permitido" });
        }
        if (Buffer.from(att.content, "base64").length > MAX_FILE_SIZE) {
          return res.status(400).json({ error: "Arquivo excede 5MB" });
        }
      }
    }

    // 6. Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.REFEMAIL_SENDER_N,
        pass: process.env.REFEMAIL_SENDER_P,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // 7. Formata Anexos
    const formattedAttachments = Array.isArray(attachments)
      ? attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
          encoding: "base64",
          contentType: att.contentType,
        }))
      : [];

    // 8. Envio do E-mail
    await transporter.sendMail({
      from: {
        name: "Formulário Transporte",
        address: process.env.REFEMAIL_SENDER_N,
      },
      to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
      subject: `Auxílio Transporte ${month} - ${name}`,
      text: "ba",
      html: `ab`,
      attachments: formattedAttachments,
    });

    // 9. Log de sucesso (opcional)
    console.log(
      `[SUCCESS] Email enviado para ${
        process.env.NEXT_PUBLIC_EMAIL_RECEIVER
      } às ${new Date().toISOString()}`
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    // 10. Tratamento de Erros
    console.error("[ERROR]", error);

    // Não revela detalhes do erro ao cliente
    return res.status(500).json({
      error: "Falha no envio do e-mail",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
export default emailHandler;
