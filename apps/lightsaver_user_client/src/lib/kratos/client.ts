import { Configuration, FrontendApi } from "@ory/client";

const kratosPublicUrl =
  process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL || "http://localhost:4433";

export const kratosClient = new FrontendApi(
  new Configuration({
    basePath: kratosPublicUrl,
    baseOptions: {
      withCredentials: true,
    },
  })
);

export function createServerKratosClient(baseUrl?: string) {
  const url = baseUrl || process.env.KRATOS_ADMIN_URL || "http://localhost:4434";
  return new FrontendApi(
    new Configuration({
      basePath: url,
    })
  );
}
