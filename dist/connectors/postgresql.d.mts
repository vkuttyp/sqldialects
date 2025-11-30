import pg from "pg";
import type { Connector } from "sqldialects";
export type ConnectorOptions = {
	url: string;
} | pg.ClientConfig;
export default function postgresqlConnector(opts: ConnectorOptions): Connector<pg.Client>;
