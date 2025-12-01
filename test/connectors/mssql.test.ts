import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { TYPES } from "tedious";

import {
  getTediousDataType,
  prepareSqlParameters,
} from "../../src/connectors/mssql.js";
import connector from "../../src/connectors/mssql.js";
import { testConnector } from "./_tests.js";
import { createDatabase } from "../../src/index.js";

describe.runIf(
  process.env.MSSQL_HOST &&
    process.env.MSSQL_DB_NAME &&
    process.env.MSSQL_USERNAME &&
    process.env.MSSQL_PASSWORD,
)("connectors: mssql.test", () => {
  testConnector({
    dialect: "mssql",
    connector: connector({
      server: process.env.MSSQL_HOST!,
      authentication: {
        type: "default",
        options: {
          userName: process.env.MSSQL_USERNAME!,
          password: process.env.MSSQL_PASSWORD!,
        },
      },
      options: {
        database: process.env.MSSQL_DB_NAME!,
        port: Number.parseInt(process.env.MSSQL_PORT || "1433", 10),
        trustServerCertificate: true,
        encrypt: false,
      },
    }),
  });
});

describe.runIf(
  process.env.MSSQL_HOST &&
    process.env.MSSQL_DB_NAME &&
    process.env.MSSQL_USERNAME &&
    process.env.MSSQL_PASSWORD,
)("callProcedure", () => {
  const db = createDatabase(
    connector({
      server: process.env.MSSQL_HOST!,
      authentication: {
        type: "default",
        options: {
          userName: process.env.MSSQL_USERNAME!,
          password: process.env.MSSQL_PASSWORD!,
        },
      },
      options: {
        database: process.env.MSSQL_DB_NAME!,
        port: Number.parseInt(process.env.MSSQL_PORT || "1433", 10),
        trustServerCertificate: true,
        encrypt: false,
      },
    }),
  );

  beforeAll(async () => {
    // Drop procedure if it exists
    await db.sql`
      IF OBJECT_ID('dbo.GetUserCount', 'P') IS NOT NULL
        DROP PROCEDURE dbo.GetUserCount
    `;

    // Drop procedure if it exists
    await db.sql`
      IF OBJECT_ID('dbo.AddNumbers', 'P') IS NOT NULL
        DROP PROCEDURE dbo.AddNumbers
    `;

    // Drop procedure if it exists
    await db.sql`
      IF OBJECT_ID('dbo.ProcessUserData', 'P') IS NOT NULL
        DROP PROCEDURE dbo.ProcessUserData
    `;

    // Create a simple stored procedure that returns user count
    await db.sql`
      CREATE PROCEDURE dbo.GetUserCount
        @minAge INT
      AS
      BEGIN
        SELECT COUNT(*) as userCount
        FROM (VALUES (1, 25), (2, 30), (3, 35)) AS Users(id, age)
        WHERE age >= @minAge
      END
    `;

    // Create a stored procedure that adds two numbers
    await db.sql`
      CREATE PROCEDURE dbo.AddNumbers
        @a INT,
        @b INT
      AS
      BEGIN
        SELECT (@a + @b) as result
      END
    `;

    // Create a stored procedure that accepts JSON data
    await db.sql`
      CREATE PROCEDURE dbo.ProcessUserData
        @jsonData NVARCHAR(MAX)
      AS
      BEGIN
        -- Parse JSON and return the data
        SELECT 
          JSON_VALUE(@jsonData, '$.name') as name,
          JSON_VALUE(@jsonData, '$.email') as email,
          JSON_VALUE(@jsonData, '$.age') as age,
          (SELECT * FROM OPENJSON(@jsonData, '$.hobbies') WITH (hobby NVARCHAR(100) '$') FOR JSON PATH) as hobbies
      END
    `;
  });

  afterAll(async () => {
    // Clean up procedures
    await db.sql`
      IF OBJECT_ID('dbo.GetUserCount', 'P') IS NOT NULL
        DROP PROCEDURE dbo.GetUserCount
    `;
    await db.sql`
      IF OBJECT_ID('dbo.AddNumbers', 'P') IS NOT NULL
        DROP PROCEDURE dbo.AddNumbers
    `;
    await db.sql`
      IF OBJECT_ID('dbo.ProcessUserData', 'P') IS NOT NULL
        DROP PROCEDURE dbo.ProcessUserData
    `;
    await db.dispose();
  });

  it("should call a stored procedure with parameters", async () => {
    const stmt = db.prepare("EXEC dbo.GetUserCount @minAge = ?");
    const rows = await stmt.all(30);
    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveProperty("userCount");
    expect((rows[0] as { userCount: number }).userCount).toBe(2);
  });

  it("should call a stored procedure with multiple parameters", async () => {
    const stmt = db.prepare("EXEC dbo.AddNumbers @a = ?, @b = ?");
    const rows = await stmt.all(10, 20);
    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveProperty("result");
    expect((rows[0] as { result: number }).result).toBe(30);
  });

  it("should call a stored procedure using prepare", async () => {
    const stmt = db.prepare("EXEC dbo.AddNumbers @a = ?, @b = ?");
    const rows = await stmt.all(5, 15);
    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveProperty("result");
    expect((rows[0] as { result: number }).result).toBe(20);
  });

  it("should return JSON data using FOR JSON PATH", async () => {
    const stmt = db.prepare(`
      SELECT 
        id, 
        firstName, 
        lastName, 
        email 
      FROM (
        VALUES 
          (1, 'John', 'Doe', 'john@example.com'),
          (2, 'Jane', 'Smith', 'jane@example.com')
      ) AS Users(id, firstName, lastName, email)
      FOR JSON PATH
    `);
    const rows = await stmt.all();
    expect(rows).toBeDefined();
    expect(rows.length).toBeGreaterThan(0);

    // SQL Server returns JSON as a single column result
    // The JSON data is in the first column (usually named "JSON_F52E2B61-18A1-11d1-B105-00805F49916B")
    const jsonColumn = Object.keys(rows[0] as object)[0]!;
    const jsonString = (rows[0] as Record<string, string>)[jsonColumn]!;

    expect(jsonString).toBeDefined();
    const jsonData = JSON.parse(jsonString);
    expect(Array.isArray(jsonData)).toBe(true);
    expect(jsonData.length).toBe(2);
    expect(jsonData[0]).toMatchObject({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });
    expect(jsonData[1]).toMatchObject({
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
    });
  });

  it("should return JSON data with nested structure using FOR JSON PATH", async () => {
    const stmt = db.prepare(`
      SELECT 
        id, 
        firstName, 
        lastName,
        (
          SELECT email, phone
          FROM (VALUES ('john@example.com', '555-1234')) AS Contact(email, phone)
          FOR JSON PATH
        ) AS contact
      FROM (VALUES (1, 'John', 'Doe')) AS Users(id, firstName, lastName)
      FOR JSON PATH
    `);
    const rows = await stmt.all();
    expect(rows).toBeDefined();

    const jsonColumn = Object.keys(rows[0] as object)[0]!;
    const jsonString = (rows[0] as Record<string, string>)[jsonColumn]!;
    const jsonData = JSON.parse(jsonString);

    expect(Array.isArray(jsonData)).toBe(true);
    expect(jsonData[0]).toHaveProperty("id", 1);
    expect(jsonData[0]).toHaveProperty("firstName", "John");
    expect(jsonData[0]).toHaveProperty("contact");

    // The nested contact is already a JSON string that needs to be parsed
    const contactData = jsonData[0].contact;
    const contact =
      typeof contactData === "string" ? JSON.parse(contactData) : contactData;
    expect(Array.isArray(contact)).toBe(true);
    expect(contact[0]).toMatchObject({
      email: "john@example.com",
      phone: "555-1234",
    });
  });

  it("should return single JSON object using FOR JSON PATH, WITHOUT_ARRAY_WRAPPER", async () => {
    const stmt = db.prepare(`
      SELECT 
        id, 
        firstName, 
        lastName, 
        email,
        age
      FROM (
        VALUES (1, 'John', 'Doe', 'john@example.com', 30)
      ) AS Users(id, firstName, lastName, email, age)
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    `);
    const rows = await stmt.all();
    expect(rows).toBeDefined();
    expect(rows.length).toBeGreaterThan(0);

    // SQL Server returns JSON as a single column result
    const jsonColumn = Object.keys(rows[0] as object)[0]!;
    const jsonString = (rows[0] as Record<string, string>)[jsonColumn]!;

    expect(jsonString).toBeDefined();
    const jsonData = JSON.parse(jsonString);

    // WITHOUT_ARRAY_WRAPPER returns a single object, not an array
    expect(Array.isArray(jsonData)).toBe(false);
    expect(jsonData).toMatchObject({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      age: 30,
    });
  });

  it("should call a stored procedure with JSON parameter", async () => {
    const userData = {
      name: "Alice Johnson",
      email: "alice@example.com",
      age: "28",
      hobbies: ["reading", "hiking", "photography"],
    };

    const jsonString = JSON.stringify(userData);
    const stmt = db.prepare("EXEC dbo.ProcessUserData @jsonData = ?");
    const rows = await stmt.all(jsonString);

    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveProperty("name", "Alice Johnson");
    expect(rows[0]).toHaveProperty("email", "alice@example.com");
    expect(rows[0]).toHaveProperty("age", "28");
    expect(rows[0]).toHaveProperty("hobbies");

    // Parse the hobbies JSON array
    const hobbiesData = (rows[0] as Record<string, string>).hobbies;
    if (hobbiesData) {
      const hobbies = JSON.parse(hobbiesData);
      expect(Array.isArray(hobbies)).toBe(true);
      expect(hobbies.length).toBe(3);
      expect(hobbies[0]).toHaveProperty("hobby", "reading");
      expect(hobbies[1]).toHaveProperty("hobby", "hiking");
      expect(hobbies[2]).toHaveProperty("hobby", "photography");
    }
  });

  it("should call a stored procedure with complex JSON parameter", async () => {
    const complexData = {
      name: "Bob Smith",
      email: "bob@example.com",
      age: "35",
      hobbies: ["gaming", "cooking"],
    };

    const jsonString = JSON.stringify(complexData);
    const stmt = db.prepare("EXEC dbo.ProcessUserData @jsonData = ?");
    const rows = await stmt.all(jsonString);

    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);

    const result = rows[0] as Record<string, string>;
    expect(result.name).toBe("Bob Smith");
    expect(result.email).toBe("bob@example.com");
    expect(result.age).toBe("35");

    // Verify hobbies array
    if (result.hobbies) {
      const hobbies = JSON.parse(result.hobbies);
      expect(Array.isArray(hobbies)).toBe(true);
      expect(hobbies.length).toBe(2);
    }
  });
});

describe.runIf(
  process.env.MSSQL_HOST &&
    process.env.MSSQL_USERNAME &&
    process.env.MSSQL_PASSWORD,
)("createDatabase", () => {
  const testDbName = "TestDB_CreateTest";
  let db: ReturnType<typeof createDatabase>;

  beforeAll(() => {
    // Connect to master database to create/drop test database
    db = createDatabase(
      connector({
        server: process.env.MSSQL_HOST!,
        authentication: {
          type: "default",
          options: {
            userName: process.env.MSSQL_USERNAME!,
            password: process.env.MSSQL_PASSWORD!,
          },
        },
        options: {
          database: "master",
          port: Number.parseInt(process.env.MSSQL_PORT || "1433", 10),
          trustServerCertificate: true,
          encrypt: false,
        },
      }),
    );
  });

  afterAll(async () => {
    // Clean up: drop the test database if it exists
    // try {
    //   await db.exec(`
    //     IF EXISTS (SELECT * FROM sys.databases WHERE name = '${testDbName}')
    //     BEGIN
    //       ALTER DATABASE [${testDbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    //       DROP DATABASE [${testDbName}];
    //     END
    //   `);
    // } catch (error) {
    //   // Ignore errors if database doesn't exist
    // }
    await db.dispose();
  });

  it("should create a new database", async () => {
    // Drop database if it exists from previous failed test
    try {
      await db.exec(`
        IF EXISTS (SELECT * FROM sys.databases WHERE name = '${testDbName}')
        BEGIN
          ALTER DATABASE [${testDbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
          DROP DATABASE [${testDbName}];
        END
      `);
    } catch {
      // Ignore errors if database doesn't exist
    }

    // Create the database
    await db.exec(`CREATE DATABASE [${testDbName}]`);

    // Verify the database exists
    const stmt = db.prepare("SELECT name FROM sys.databases WHERE name = ?");
    const rows = await stmt.all(testDbName);
    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect((rows[0] as { name: string }).name).toBe(testDbName);
  });

  it("should check if database exists", async () => {
    const stmt = db.prepare(`
      SELECT CASE 
        WHEN EXISTS (SELECT * FROM sys.databases WHERE name = ?)
        THEN 1
        ELSE 0
      END as dbExists
    `);
    const rows = await stmt.all(testDbName);
    expect(rows).toBeDefined();
    expect(rows.length).toBe(1);
    expect((rows[0] as { dbExists: number }).dbExists).toBe(1);
  });

  it.skip("should drop an existing database", async () => {
    // Drop the database
    await db.exec(`
      ALTER DATABASE [${testDbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
      DROP DATABASE [${testDbName}];
    `);

    // Verify the database no longer exists
    const stmt = db.prepare("SELECT name FROM sys.databases WHERE name = ?");
    const rows = await stmt.all(testDbName);
    expect(rows).toBeDefined();
    expect(rows.length).toBe(0);
  });
});

describe("getTediousDataType", () => {
  it("should return NVarChar for null", () => {
    // eslint-disable-next-line unicorn/no-null
    expect(getTediousDataType(null)).toBe(TYPES.NVarChar);
  });

  it("should return NVarChar for undefined", () => {
    expect(getTediousDataType(undefined)).toBe(TYPES.NVarChar);
  });

  it("should return NVarChar for strings", () => {
    expect(getTediousDataType("test")).toBe(TYPES.NVarChar);
  });

  it("should return Int for numbers", () => {
    expect(getTediousDataType(123)).toBe(TYPES.Int);
  });

  it("should return BigInt for large integer numbers", () => {
    expect(getTediousDataType(2_147_483_648)).toBe(TYPES.BigInt);
  });

  it("should return Float for floating point numbers", () => {
    expect(getTediousDataType(123.45)).toBe(TYPES.Float);
  });

  it("should return Bit for boolean values", () => {
    expect(getTediousDataType(true)).toBe(TYPES.Bit);
  });

  it("should return DateTime for Date objects", () => {
    expect(getTediousDataType(new Date())).toBe(TYPES.DateTime2);
  });

  it("should return VarBinary for Buffer objects", () => {
    expect(getTediousDataType(Buffer.from("test"))).toBe(TYPES.VarBinary);
  });

  it("should return NVarChar by default for other types", () => {
    expect(getTediousDataType({})).toBe(TYPES.NVarChar);
  });
});

describe("prepareSqlParameters", () => {
  it("should replace ? with @1, @2, etc.", () => {
    const sql = "SELECT * FROM users WHERE id = ? AND name = ?";
    const parameters = [1, "John"];
    const result = prepareSqlParameters(sql, parameters);
    expect(result.sql).toBe("SELECT * FROM users WHERE id = @1 AND name = @2");
    expect(result.parameters).toEqual({
      "@1": { name: "1", type: TYPES.Int, value: 1 },
      "@2": { name: "2", type: TYPES.NVarChar, value: "John" },
    });
  });

  it("should handle no parameters", () => {
    const sql = "SELECT * FROM users";
    const parameters: unknown[] = [];
    const result = prepareSqlParameters(sql, parameters);
    expect(result.sql).toBe("SELECT * FROM users");
    expect(result.parameters).toEqual({});
  });

  it("should handle multiple parameters of different types", () => {
    const sql = "SELECT * FROM users WHERE id = ? AND age = ? AND active = ?";
    const parameters = [1, 30, true];
    const result = prepareSqlParameters(sql, parameters);
    expect(result.sql).toBe(
      "SELECT * FROM users WHERE id = @1 AND age = @2 AND active = @3",
    );
    expect(result.parameters).toEqual({
      "@1": { name: "1", type: TYPES.Int, value: 1 },
      "@2": { name: "2", type: TYPES.Int, value: 30 },
      "@3": { name: "3", type: TYPES.Bit, value: true },
    });
  });

  it("should handle null and undefined parameters", () => {
    const sql = "SELECT * FROM users WHERE name = ? AND email = ?";
    // eslint-disable-next-line unicorn/no-null
    const parameters = [null, undefined];
    const result = prepareSqlParameters(sql, parameters);
    expect(result.sql).toBe(
      "SELECT * FROM users WHERE name = @1 AND email = @2",
    );
    expect(result.parameters).toEqual({
      // eslint-disable-next-line unicorn/no-null
      "@1": { name: "1", type: TYPES.NVarChar, value: null },
      "@2": { name: "2", type: TYPES.NVarChar, value: undefined },
    });
  });
});
