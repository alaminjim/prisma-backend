import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "User not valid" });
    }

    if (!session?.user.emailVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Email not verified" });
    }
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role as string,
    };

    if (roles.length && !roles.includes(req.user.role as Role)) {
      return res
        .status(403)
        .json({ success: false, message: "forbidden access" });
    }
    next();
  };
};

export default auth;
