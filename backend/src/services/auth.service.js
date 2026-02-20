import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { TokenService } from "./token.service.js";

class EmailExistsError extends Error {
  constructor(message = "Email already registered") {
    super(message);
    this.name = "EmailExistsError";
  }
}

class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class AuthService {
  constructor(userModel = User, tokenService = new TokenService()) {
    this.userModel = userModel;
    this.tokenService = tokenService;
  }

  async signup({ name, email, password }) {
    const exists = await this.userModel.findOne({ email });
    if (exists) throw new EmailExistsError();

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ name, email, password: hashed });
    const tokens = this.tokenService.signTokens({
      sub: user.id,
      roles: user.roles,
    });

    return { user, tokens };
  }

  async login({ email, password }) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new InvalidCredentialsError();

    const valid = await user.comparePassword(password);
    if (!valid) throw new InvalidCredentialsError();

    const tokens = this.tokenService.signTokens({
      sub: user.id,
      roles: user.roles,
    });

    return { user, tokens };
  }

  async refresh(refreshToken) {
    const payload = this.tokenService.verifyRefresh(refreshToken);
    return this.tokenService.signTokens({
      sub: payload.sub,
      roles: payload.roles,
    });
  }
}

export const errors = { EmailExistsError, InvalidCredentialsError };
