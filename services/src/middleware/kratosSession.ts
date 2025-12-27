import { Request, Response, NextFunction } from "express";
import { Configuration, FrontendApi, Session } from "@ory/client";

const kratosAdminUrl = process.env.KRATOS_ADMIN_URL || "http://localhost:4434";

const kratosClient = new FrontendApi(
  new Configuration({
    basePath: kratosAdminUrl,
  })
);

export interface AuthenticatedRequest extends Request {
  session?: Session;
  userId?: string;
}

export async function kratosSessionMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const cookie = req.headers.cookie;

  if (!cookie) {
    next();
    return;
  }

  try {
    const { data: session } = await kratosClient.toSession({
      cookie,
    });

    req.session = session;
    req.userId = session.identity?.id;
  } catch (error) {
    // Session invalid or expired - continue without session
    console.debug("No valid session found:", error);
  }

  next();
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.session || !req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
