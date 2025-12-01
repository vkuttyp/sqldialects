// Auto-generated using scripts/gen-connectors.
// Do not manually edit!
import type { ConnectorOptions as BetterSQLite3Options } from "sqldialects/connectors/better-sqlite3";
import type { ConnectorOptions as BunSQLiteOptions } from "sqldialects/connectors/bun-sqlite";
import type { ConnectorOptions as CloudflareD1Options } from "sqldialects/connectors/cloudflare-d1";
import type { ConnectorOptions as CloudflareHyperdriveMySQLOptions } from "sqldialects/connectors/cloudflare-hyperdrive-mysql";
import type { ConnectorOptions as CloudflareHyperdrivePostgreSQLOptions } from "sqldialects/connectors/cloudflare-hyperdrive-postgresql";
import type { ConnectorOptions as LibSQLCoreOptions } from "sqldialects/connectors/libsql/core";
import type { ConnectorOptions as LibSQLHttpOptions } from "sqldialects/connectors/libsql/http";
import type { ConnectorOptions as LibSQLNodeOptions } from "sqldialects/connectors/libsql/node";
import type { ConnectorOptions as LibSQLWebOptions } from "sqldialects/connectors/libsql/web";
import type { ConnectorOptions as MSSQLOptions } from "sqldialects/connectors/mssql";
import type { ConnectorOptions as MySQL2Options } from "sqldialects/connectors/mysql2";
import type { ConnectorOptions as NodeSQLiteOptions } from "sqldialects/connectors/node-sqlite";
import type { ConnectorOptions as PgliteOptions } from "sqldialects/connectors/pglite";
import type { ConnectorOptions as PlanetscaleOptions } from "sqldialects/connectors/planetscale";
import type { ConnectorOptions as PostgreSQLOptions } from "sqldialects/connectors/postgresql";
import type { ConnectorOptions as SQLite3Options } from "sqldialects/connectors/sqlite3";

export type ConnectorName =
  | "better-sqlite3"
  | "bun-sqlite"
  | "bun"
  | "cloudflare-d1"
  | "cloudflare-hyperdrive-mysql"
  | "cloudflare-hyperdrive-postgresql"
  | "libsql-core"
  | "libsql-http"
  | "libsql-node"
  | "libsql"
  | "libsql-web"
  | "mssql"
  | "mysql2"
  | "node-sqlite"
  | "sqlite"
  | "pglite"
  | "planetscale"
  | "postgresql"
  | "sqlite3";

export type ConnectorOptions = {
  "better-sqlite3": BetterSQLite3Options;
  "bun-sqlite": BunSQLiteOptions;
  /** alias of bun-sqlite */
  bun: BunSQLiteOptions;
  "cloudflare-d1": CloudflareD1Options;
  "cloudflare-hyperdrive-mysql": CloudflareHyperdriveMySQLOptions;
  "cloudflare-hyperdrive-postgresql": CloudflareHyperdrivePostgreSQLOptions;
  "libsql-core": LibSQLCoreOptions;
  "libsql-http": LibSQLHttpOptions;
  "libsql-node": LibSQLNodeOptions;
  /** alias of libsql-node */
  libsql: LibSQLNodeOptions;
  "libsql-web": LibSQLWebOptions;
  mssql: MSSQLOptions;
  mysql2: MySQL2Options;
  "node-sqlite": NodeSQLiteOptions;
  /** alias of node-sqlite */
  sqlite: NodeSQLiteOptions;
  pglite: PgliteOptions;
  planetscale: PlanetscaleOptions;
  postgresql: PostgreSQLOptions;
  sqlite3: SQLite3Options;
};

export const connectors: Record<ConnectorName, string> = Object.freeze({
  "better-sqlite3": "sqldialects/connectors/better-sqlite3",
  "bun-sqlite": "sqldialects/connectors/bun-sqlite",
  /** alias of bun-sqlite */
  bun: "sqldialects/connectors/bun-sqlite",
  "cloudflare-d1": "sqldialects/connectors/cloudflare-d1",
  "cloudflare-hyperdrive-mysql":
    "sqldialects/connectors/cloudflare-hyperdrive-mysql",
  "cloudflare-hyperdrive-postgresql":
    "sqldialects/connectors/cloudflare-hyperdrive-postgresql",
  "libsql-core": "sqldialects/connectors/libsql/core",
  "libsql-http": "sqldialects/connectors/libsql/http",
  "libsql-node": "sqldialects/connectors/libsql/node",
  /** alias of libsql-node */
  libsql: "sqldialects/connectors/libsql/node",
  "libsql-web": "sqldialects/connectors/libsql/web",
  mssql: "sqldialects/connectors/mssql",
  mysql2: "sqldialects/connectors/mysql2",
  "node-sqlite": "sqldialects/connectors/node-sqlite",
  /** alias of node-sqlite */
  sqlite: "sqldialects/connectors/node-sqlite",
  pglite: "sqldialects/connectors/pglite",
  planetscale: "sqldialects/connectors/planetscale",
  postgresql: "sqldialects/connectors/postgresql",
  sqlite3: "sqldialects/connectors/sqlite3",
} as const);
