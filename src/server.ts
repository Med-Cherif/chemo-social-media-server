import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import cors from "cors";
import express from "express";
import { json } from "body-parser";
import { print } from "graphql";
import connectDatabase from "./db";
import { unwrapResolverError } from "@apollo/server/errors";
import { TErrorCode } from "./helpers/errorsHandler";

const PORT = process.env.PORT || 4000;

const loadedTypeDefs = loadFilesSync(path.join(__dirname, "typeDefs"));
const loadedResolvers = loadFilesSync(path.join(__dirname, "resolvers"));

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers(loadedResolvers);

const printedTypeDefs = print(typeDefs);
fs.writeFileSync("joined.graphql", printedTypeDefs);

(async () => {
  const app = express();
  const httpServer = createServer(app);

  app.use("/storage", express.static("storage"));

  const apolloServer = new ApolloServer({
    // schema,
    typeDefs,
    resolvers,
    csrfPrevention: false,
    includeStacktraceInErrorResponses: false,
    formatError(formattedError, error: any) {
      const originalError = unwrapResolverError(error) as any;

      if (originalError?.name === "DocumentNotFoundError") {
        return {
          ...formattedError,
          message: "Document not found",
          extensions: {
            ...formattedError.extensions,
            code: "BAD_REQUEST" as TErrorCode,
          },
        };
      }

      return formattedError;
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await Promise.all([connectDatabase(), apolloServer.start()]);

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    graphqlUploadExpress(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`Server ready at http://localhost:${PORT}/graphql`);
})();
