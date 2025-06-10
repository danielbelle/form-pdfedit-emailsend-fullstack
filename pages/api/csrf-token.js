import Tokens from "csrf";

export default function handler(req, res) {
  const tokens = new Tokens();
  const secret = tokens.secretSync();
  const token = tokens.create(secret);

  // Você pode salvar o secret em um cookie seguro para validar depois
  const isDev = process.env.NODE_ENV === "development";
  res.setHeader(
    "Set-Cookie",
    `csrfToken=${secret}; HttpOnly;${isDev ? "" : " Secure;"} SameSite=Strict`
  );
  res.json({ token });
}
