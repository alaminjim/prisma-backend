// qus.3 kkhn use krte hbe sb project a

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
