import express, { query } from "express";
import { renderPlaygroundPage } from "@apollographql/graphql-playground-html";
import { readFileSync } from "fs";
import { addDevQueryMiddlewares } from "./lib/devQuery";

export function falsey(val: any, keywords?: any) {
  if (!val) return true;
  let words = keywords || [
    "0",
    "false",
    "nada",
    "nil",
    "nay",
    "nah",
    "negative",
    "no",
    "none",
    "nope",
    "nul",
    "null",
    "nix",
    "nyet",
    "uh-uh",
    "veto",
    "zero",
  ];
  if (!Array.isArray(words)) words = [words];
  const lower = typeof val === "string" ? val.toLowerCase() : null;
  for (const word of words) {
    if (word === val) {
      return true;
    }
    if (word === lower) {
      return true;
    }
  }
  return false;
}

export class GraphQLPlaygroundApp {
  _apiPath: string;
  _graphiqlPath: string;

  constructor({
    apiPath = "/admin/api",
    graphiqlPath = "/admin/graphiql",
  } = {}) {
    this._apiPath = apiPath;
    this._graphiqlPath = graphiqlPath;
  }

  /**
   * @return Array<middlewares>
   */
  getMiddleware({ dev }: { dev: boolean }) {
    const graphiqlPath = this._graphiqlPath;
    const apiPath = this._apiPath;
    const app = express();
    if (dev && falsey(process.env.DISABLE_LOGGING)) {
      // NOTE: Must come before we setup the GraphQL API
      const devQueryPath = `${graphiqlPath}/go`;
      addDevQueryMiddlewares(app, apiPath, graphiqlPath, devQueryPath);
    }

    const endpoint = apiPath;
    app.get(graphiqlPath, (req, res) => {
      let tab: any = { endpoint };
      if (req?.query?.query) {
        tab.query = req.query.query;
        tab.variables = req.query.variables;
      }
      const playgroundPkg = JSON.parse(
        readFileSync(
          "./node_modules/@apollographql/graphql-playground-react/package.json",
          "utf8",
        ),
      );
      res.write(
        renderPlaygroundPage({
          endpoint,
          version: playgroundPkg.version,
          tabs: [tab],
          settings: { "request.credentials": "same-origin" },
        }),
      );
      res.end();
    });

    return app;
  }

  /**
   * @param Options { distDir }
   */
  build() {}
}
