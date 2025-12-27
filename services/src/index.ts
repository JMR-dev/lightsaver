import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  kratosSessionMiddleware,
  AuthenticatedRequest,
} from "./middleware/kratosSession";

const typeDefs = `
  type User {
    id: ID!
    email: String
    firstName: String
    lastName: String
  }

  type Query {
    me: User
    hello: String!
  }
`;

interface Traits {
  email?: string;
  name?: {
    first?: string;
    last?: string;
  };
}

const resolvers = {
  Query: {
    hello: () => "Hello from Lightsaver API!",
    me: (_: unknown, __: unknown, context: { req: AuthenticatedRequest }) => {
      const { session } = context.req;

      if (!session || !session.identity) {
        return null;
      }

      const traits = session.identity.traits as Traits;

      return {
        id: session.identity.id,
        email: traits.email,
        firstName: traits.name?.first,
        lastName: traits.name?.last,
      };
    },
  },
};

async function startServer() {
  const app = express();

  app.use(kratosSessionMiddleware);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: AuthenticatedRequest }) => ({ req }),
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
}

startServer().catch(console.error);
