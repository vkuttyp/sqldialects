import { type Logger, type RelationalSchemaConfig, type Query, type TablesRelationalConfig } from "drizzle-orm";
import { SQLiteAsyncDialect, SQLiteSession, SQLitePreparedQuery } from "drizzle-orm/sqlite-core";
import type { PreparedQueryConfig, SelectedFieldsOrdered, SQLiteExecuteMethod, SQLiteTransactionConfig } from "drizzle-orm/sqlite-core";
import type { Database, Statement } from "sqldialects";
// Used as reference: https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/d1/session.ts
export interface sqldialectsSessionOptions {
	logger?: Logger;
}
export declare class sqldialectsSession<
	TFullSchema extends Record<string, unknown>,
	TSchema extends TablesRelationalConfig
> extends SQLiteSession<"async", unknown, TFullSchema, TSchema> {
	private db;
	private schema;
	private options;
	dialect: SQLiteAsyncDialect;
	private logger;
	constructor(db: Database, dialect: SQLiteAsyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: sqldialectsSessionOptions);
	// @ts-expect-error TODO
	prepareQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, customResultMapper?: (rows: unknown[][]) => unknown): sqldialectsPreparedQuery;
	// TODO: Implement batch
	// TODO: Implement transaction
	transaction<T>(_transaction: (tx: any) => T | Promise<T>, _config?: SQLiteTransactionConfig): Promise<T>;
}
export declare class sqldialectsPreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
	type: "async";
	run: Awaited<ReturnType<Statement["run"]>>;
	all: T["all"];
	get: T["get"];
	values: T["values"];
	execute: T["execute"];
}> {
	private stmt;
	private logger;
	constructor(stmt: Statement, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _customResultMapper?: (rows: unknown[][]) => unknown);
	run(): Promise<{
		success: boolean;
	}>;
	all(): Promise<unknown[]>;
	get(): Promise<unknown>;
	values(): Promise<unknown[]>;
}
