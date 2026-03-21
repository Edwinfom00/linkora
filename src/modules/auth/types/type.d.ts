export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "client" | "entreprise" | "admin";
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    userId: string;
  };
}

export interface AuthActionResult {
  data?: { redirectTo?: string };
  error?: string;
}
