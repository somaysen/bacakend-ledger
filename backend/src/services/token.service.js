import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export class TokenService {
  signTokens(payload) {
    const accessToken = jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });
    const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn,
    });
    return { accessToken, refreshToken };
  }

  verifyRefresh(refreshToken) {
    return jwt.verify(refreshToken, env.jwtRefreshSecret);
  }
}
