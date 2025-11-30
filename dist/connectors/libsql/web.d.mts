import type { Config, Client } from "@libsql/client";
import type { Connector } from "sqldialects";
export type ConnectorOptions = Config;
export default function libSqlConnector(opts: ConnectorOptions): Connector<Client>;
