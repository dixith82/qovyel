import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;
const TOKEN_TTL = "7d";
export const SESSION_COOKIE = "qovyel_session";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signSessionToken(adminUser) {
  return jwt.sign({ sub: adminUser.id, email: adminUser.email }, env.sessionSecret, {
    expiresIn: TOKEN_TTL,
  });
}

export function verifySessionToken(token) {
  return jwt.verify(token, env.sessionSecret);
}

// httpOnly + sameSite=lax keeps the token out of reach of JS (mitigating
// XSS token theft) while still being sent on normal same-site navigation.
// `secure` is enabled in production, where the app is assumed to be served
// over HTTPS; it's left off in development so it also works over plain
// http://localhost.
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}
