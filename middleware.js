import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Headers de Segurança
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");

  return response;
}
