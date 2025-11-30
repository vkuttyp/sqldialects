// Auto-generated using scripts/gen-connectors.
// Do not manually edit!
import type { ConnectorOptions as BetterSQLite3Options } from "kuttydb/connectors/better-sqlite3";
import type { ConnectorOptions as BunSQLiteOptions } from "kuttydb/connectors/bun-sqlite";
import type { ConnectorOptions as CloudflareD1Options } from "kuttydb/connectors/cloudflare-d1";
import type { ConnectorOptions as CloudflareHyperdriveMySQLOptions } from "kuttydb/connectors/cloudflare-hyperdrive-mysql";
import type { ConnectorOptions as CloudflareHyperdrivePostgreSQLOptions } from "kuttydb/connectors/cloudflare-hyperdrive-postgresql";
import type { ConnectorOptions as LibSQLCoreOptions } from "kuttydb/connectors/libsql/core";
import type { ConnectorOptions as LibSQLHttpOptions } from "kuttydb/connectors/libsql/http";
import type { ConnectorOptions as LibSQLNodeOptions } from "kuttydb/connectors/libsql/node";
import type { ConnectorOptions as LibSQLWebOptions } from "kuttydb/connectors/libsql/web";
import type { ConnectorOptions as MSSQLOptions } from "kuttydb/connectors/mssql";
import type { ConnectorOptions as MySQL2Options } from "kuttydb/connectors/mysql2";
import type { ConnectorOptions as NodeSQLiteOptions } from "kuttydb/connectors/node-sqlite";
import type { ConnectorOptions as PgliteOptions } from "kuttydb/connectors/pglite";
import type { ConnectorOptions as PlanetscaleOptions } from "kuttydb/connectors/planetscale";
import type { ConnectorOptions as PostgreSQLOptions } from "kuttydb/connectors/postgresql";
import type { ConnectorOptions as SQLite3Options } from "kuttydb/connectors/sqlite3";

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
  "better-sqlite3": "kuttydb/connectors/better-sqlite3",
  "bun-sqlite": "kuttydb/connectors/bun-sqlite",
  /** alias of bun-sqlite */
  bun: "kuttydb/connectors/bun-sqlite",
  "cloudflare-d1": "kuttydb/connectors/cloudflare-d1",
  "cloudflare-hyperdrive-mysql":
    "kuttydb/connectors/cloudflare-hyperdrive-mysql",
  "cloudflare-hyperdrive-postgresql":
    "kuttydb/connectors/cloudflare-hyperdrive-postgresql",
  "libsql-core": "kuttydb/connectors/libsql/core",
  "libsql-http": "kuttydb/connectors/libsql/http",
  "libsql-node": "kuttydb/connectors/libsql/node",
  /** alias of libsql-node */
  libsql: "kuttydb/connectors/libsql/node",
  "libsql-web": "kuttydb/connectors/libsql/web",
  mssql: "kuttydb/connectors/mssql",
  mysql2: "kuttydb/connectors/mysql2",
  "node-sqlite": "kuttydb/connectors/node-sqlite",
  /** alias of node-sqlite */
  sqlite: "kuttydb/connectors/node-sqlite",
  pglite: "kuttydb/connectors/pglite",
  planetscale: "kuttydb/connectors/planetscale",
  postgresql: "kuttydb/connectors/postgresql",
  sqlite3: "kuttydb/connectors/sqlite3",
} as const);
