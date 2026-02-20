import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authGuard(requiredRoles) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      req.user = { id: payload.sub, roles: payload.roles || [] };
      if (
        requiredRoles &&
        !requiredRoles.some((r) => req.user.roles.includes(r))
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
}
