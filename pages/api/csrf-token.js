// pages/api/csrf-token.js
import { createCsrfToken } from "csrf";

export default function handler(req, res) {
  const token = createCsrfToken();
  res.setHeader(
    "Set-Cookie",
    `csrfToken=${token}; HttpOnly; Secure; SameSite=Strict`
  );
  res.json({ token });
}

// No seu formulário:
fetch("/api/csrf-token")
  .then((res) => res.json())
  .then((data) => {
    setCsrfToken(data.token);
  });
