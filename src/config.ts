import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";
import { transformToClass } from "ntbs/utils/validation";
import { createEnvReader } from "ntbs/utils/env";
import { Type } from "class-transformer";
import { join } from "path";

export enum Environment {
  dev = "dev",
  local = "local",
  stage = "stage",
  prod = "prod",
}

export async function readAppConfig(): Promise<AppConfig> {
  // explain js destructuring
  const { readRequiredString, readOptionalString } = createEnvReader(
    process.env
  );

  const environment = readRequiredString("ENVIRONMENT") as Environment;

  const db = await readDbConfig();
  return transformToClass(AppConfig, {
    environment,
    db,
    adminApiKey: readOptionalString("ADMIN_API_KEY", "ptaki-lataja-kluczem"),
  });
}

function readDbConfig(): DbClientConfig {
  const { readOptionalString, readRequiredString, readOptionalBool } =
    createEnvReader(process.env);
  const pgMock = readOptionalBool("PGMOCK", false);
  const pgUser = readRequiredString("PGUSER");
  const pgHost = readRequiredString("PGHOST");
  const pgPort = readOptionalString("PGPORT", "5433");
  const pgDB = readRequiredString("PGDATABASE");
  return {
    client: pgMock ? "mock" : "pg",
    connection: `postgres://${pgUser}:changeme@${pgHost}:${pgPort}/${pgDB}?password=changeme`,
    migrations: {
      directory: join(__dirname, "./migrations"),
      loadExtensions: [".ts"],
      schemaName: "app",
    },
  };
}

export class AppConfig {
  @IsString()
  @IsIn(Object.values(Environment))
  readonly environment: Environment;

  @IsString()
  @IsNotEmpty()
  readonly adminApiKey: string;

  @ValidateNested()
  @Type(() => DbClientConfig)
  readonly db: DbClientConfig;
}

export class DbClientConfig {
  @IsNotEmpty()
  @IsString()
  @IsIn(["pg", "mock"])
  readonly client: string;
  @IsNotEmpty()
  @IsString()
  readonly connection: string;
  @ValidateNested()
  @Type(() => DbClientConfigMigrations)
  migrations: DbClientConfigMigrations;
}
export class DbClientConfigMigrations {
  @IsNotEmpty()
  @IsString()
  readonly directory: string;

  @IsArray()
  @IsString({ each: true })
  readonly loadExtensions: string[];

  @IsNotEmpty()
  @IsString()
  readonly schemaName: string;
}
