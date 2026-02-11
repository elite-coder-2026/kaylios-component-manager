const crypto = require("node:crypto");

function unauthorized(message = "Unauthorized") {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

function forbidden(message = "Forbidden") {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function verifyHs256Jwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw unauthorized("Invalid token format.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  let header;
  let payload;
  try {
    header = JSON.parse(decodeBase64Url(encodedHeader));
    payload = JSON.parse(decodeBase64Url(encodedPayload));
  } catch (_error) {
    throw unauthorized("Invalid token payload.");
  }

  if (header.alg !== "HS256") {
    throw unauthorized("Unsupported token algorithm.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const provided = Buffer.from(encodedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    throw unauthorized("Invalid token signature.");
  }

  if (payload.exp && Number.isFinite(payload.exp)) {
    const now = Math.floor(Date.now() / 1000);
    if (now >= payload.exp) {
      throw unauthorized("Token has expired.");
    }
  }

  return payload;
}

function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return next(unauthorized("Missing bearer token."));
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return next(unauthorized("Missing bearer token."));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const error = new Error("Server auth is not configured.");
    error.statusCode = 500;
    return next(error);
  }

  try {
    req.user = verifyHs256Jwt(token, secret);
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireRole(...roles) {
  const allowedRoles = roles.filter(Boolean);

  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      return next(forbidden("User role is required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(forbidden("Insufficient role."));
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
  // verifyHs256Jwt
};
