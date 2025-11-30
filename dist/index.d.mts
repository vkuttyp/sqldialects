import { ConnectorOptions as ConnectorOptions$1 } from "sqldialects/connectors/better-sqlite3";
import { ConnectorOptions as ConnectorOptions$2 } from "sqldialects/connectors/bun-sqlite";
import { ConnectorOptions as ConnectorOptions$3 } from "sqldialects/connectors/cloudflare-d1";
import { ConnectorOptions as ConnectorOptions$4 } from "sqldialects/connectors/cloudflare-hyperdrive-mysql";
import { ConnectorOptions as ConnectorOptions$5 } from "sqldialects/connectors/cloudflare-hyperdrive-postgresql";
import { ConnectorOptions as ConnectorOptions$6 } from "sqldialects/connectors/libsql/core";
import { ConnectorOptions as ConnectorOptions$7 } from "sqldialects/connectors/libsql/http";
import { ConnectorOptions as ConnectorOptions$8 } from "sqldialects/connectors/libsql/node";
import { ConnectorOptions as ConnectorOptions$9 } from "sqldialects/connectors/libsql/web";
import { ConnectorOptions as ConnectorOptions$10 } from "sqldialects/connectors/mssql";
import { ConnectorOptions as ConnectorOptions$11 } from "sqldialects/connectors/mysql2";
import { ConnectorOptions as ConnectorOptions$12 } from "sqldialects/connectors/node-sqlite";
import { ConnectorOptions as ConnectorOptions$13 } from "sqldialects/connectors/pglite";
import { ConnectorOptions as ConnectorOptions$14 } from "sqldialects/connectors/planetscale";
import { ConnectorOptions as ConnectorOptions$15 } from "sqldialects/connectors/postgresql";
import { ConnectorOptions as ConnectorOptions$16 } from "sqldialects/connectors/sqlite3";

//#region src/types.d.ts
type Primitive = string | number | boolean | undefined | null;
type SQLDialect = "mysql" | "postgresql" | "sqlite" | "libsql" | "mssql";
type Statement = {
  bind(...params: Primitive[]): PreparedStatement;
  all(...params: Primitive[]): Promise<unknown[]>;
  run(...params: Primitive[]): Promise<{
    success: boolean;
  }>;
  get(...params: Primitive[]): Promise<unknown>;
};
type PreparedStatement = {
  bind(...params: Primitive[]): PreparedStatement;
  all(): Promise<unknown[]>;
  run(): Promise<{
    success: boolean;
  }>;
  get(): Promise<unknown>;
};
type ExecResult = unknown;
type Connector<TInstance = unknown> = {
  name: string;
  dialect: SQLDialect;
  getInstance: () => TInstance | Promise<TInstance>;
  exec: (sql: string) => ExecResult | Promise<ExecResult>;
  prepare: (sql: string) => Statement;
  dispose?: () => void | Promise<void>;
};
type DefaultSQLResult = {
  lastInsertRowid?: number;
  changes?: number;
  error?: string;
  rows?: {
    id?: string | number;
    [key: string]: unknown;
  }[];
  success?: boolean;
};
interface Database<TConnector extends Connector = Connector> extends AsyncDisposable {
  readonly dialect: SQLDialect;
  readonly disposed: boolean;
  getInstance: () => Promise<Awaited<ReturnType<TConnector["getInstance"]>>>;
  exec: (sql: string) => Promise<ExecResult>;
  prepare: (sql: string) => Statement;
  sql: <T = DefaultSQLResult>(strings: TemplateStringsArray, ...values: Primitive[]) => Promise<T>;
  dispose: () => Promise<void>;
  [Symbol.asyncDispose]: () => Promise<void>;
}
//#endregion
//#region src/database.d.ts
/**
 * Creates and returns a database interface using the specified connector.
 * This interface allows you to execute raw SQL queries, prepare SQL statements,
 * and execute SQL queries with parameters using tagged template literals.
 *
 * @param {Connector} connector - The database connector used to execute and prepare SQL statements. See {@link Connector}.
 * @returns {Database} The database interface that allows SQL operations. See {@link Database}.
 */
declare function createDatabase<TConnector extends Connector = Connector>(connector: TConnector): Database<TConnector>;
//#endregion
//#region src/_connectors.d.ts
type ConnectorName = "better-sqlite3" | "bun-sqlite" | "bun" | "cloudflare-d1" | "cloudflare-hyperdrive-mysql" | "cloudflare-hyperdrive-postgresql" | "libsql-core" | "libsql-http" | "libsql-node" | "libsql" | "libsql-web" | "mssql" | "mysql2" | "node-sqlite" | "sqlite" | "pglite" | "planetscale" | "postgresql" | "sqlite3";
type ConnectorOptions = {
  "better-sqlite3": ConnectorOptions$1;
  "bun-sqlite": ConnectorOptions$2;
  /** alias of bun-sqlite */
  "bun": ConnectorOptions$2;
  "cloudflare-d1": ConnectorOptions$3;
  "cloudflare-hyperdrive-mysql": ConnectorOptions$4;
  "cloudflare-hyperdrive-postgresql": ConnectorOptions$5;
  "libsql-core": ConnectorOptions$6;
  "libsql-http": ConnectorOptions$7;
  "libsql-node": ConnectorOptions$8;
  /** alias of libsql-node */
  "libsql": ConnectorOptions$8;
  "libsql-web": ConnectorOptions$9;
  "mssql": ConnectorOptions$10;
  "mysql2": ConnectorOptions$11;
  "node-sqlite": ConnectorOptions$12;
  /** alias of node-sqlite */
  "sqlite": ConnectorOptions$12;
  "pglite": ConnectorOptions$13;
  "planetscale": ConnectorOptions$14;
  "postgresql": ConnectorOptions$15;
  "sqlite3": ConnectorOptions$16;
};
declare const connectors: Record<ConnectorName, string>;
//#endregion
export { type Connector, type ConnectorName, type ConnectorOptions, type Database, type ExecResult, type PreparedStatement, type Primitive, type SQLDialect, type Statement, connectors, createDatabase };
//# sourceMappingURL=index.d.mts.map