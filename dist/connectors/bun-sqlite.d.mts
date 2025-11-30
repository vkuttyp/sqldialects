// @ts-ignore - bun:sqlite is only available in Bun runtime
import { Database } from "bun:sqlite";
import type { Connector } from "sqldialects";
export interface ConnectorOptions {
	cwd?: string;
	path?: string;
	name?: string;
}
export default function bunSqliteConnector(opts: ConnectorOptions): Connector<Database>;
