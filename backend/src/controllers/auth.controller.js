import { AuthService, errors } from "../services/auth.service.js";

export class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const { user, tokens } = await this.authService.signup({
        name,
        email,
        password,
      });
      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        ...tokens,
      });
    } catch (err) {
      if (err instanceof errors.EmailExistsError) {
        return res.status(409).json({ message: err.message });
      }
      res.status(500).json({ message: "Unable to sign up" });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const { user, tokens } = await this.authService.login({
        email,
        password,
      });
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
        ...tokens,
      });
    } catch (err) {
      if (err instanceof errors.InvalidCredentialsError) {
        return res.status(401).json({ message: err.message });
      }
      res.status(500).json({ message: "Unable to login" });
    }
  };

  refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    try {
      const tokens = await this.authService.refresh(refreshToken);
      res.json(tokens);
    } catch (err) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  };
}

export const authController = new AuthController();
