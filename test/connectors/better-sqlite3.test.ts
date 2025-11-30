import { describe } from "vitest";
import connector from "../../src/connectors/better-sqlite3";
import { testConnector } from "./_tests";

describe("connectors: better-sqlite3", () => {
  testConnector({
    dialect: "sqlite",
    connector: connector({
      name: ":memory:",
    }),
  });
});
