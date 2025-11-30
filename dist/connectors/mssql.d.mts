import { Connection as TediousConnection, type ConnectionConfiguration, TYPES } from "tedious";
import type { Connector } from "sqldialects";
// Type for tedious DataType
type DataType = (typeof TYPES)[keyof typeof TYPES];
export type ConnectorOptions = ConnectionConfiguration;
export default function mssqlConnector(opts: ConnectorOptions): Connector<TediousConnection>;
// taken from the `kysely` library: https://github.com/kysely-org/kysely/blob/413a88516c20be42dc8cbebade68c27669a3ac1a/src/dialect/mssql/mssql-driver.ts#L440
export declare function getTediousDataType(value: unknown): DataType;
// replace `?` placeholders with `@1`, `@2`, etc.
export declare function prepareSqlParameters(sql: string, parameters?: unknown[]): {
	sql: string;
	parameters: Record<string, {
		name: string;
		type: DataType;
		value: unknown;
	}>;
};
