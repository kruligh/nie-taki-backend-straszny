import { Knex, knex as buildKnex } from "knex";
import { SongsMockStorage } from "ntbs/storages/songs/SongsMockStorage";
import { SongStorage } from "ntbs/storages/songs/SongStorage";
import { AppConfig, readAppConfig } from "./config";
import logger from "ntbs/utils/logger";
import { SongsPGStorage } from "ntbs/storages/songs/SongsPGStorage";
import { YoutubeClient } from "ntbs/clients/youtube/YoutubeClient";
import { YoutubeMockClient } from "ntbs/clients/youtube/YoutubeMockClient";

export type AppServices = {
  appConfig: AppConfig;
  storages: Storages;
  youtubeClient: YoutubeClient;
};

export const buildAppServices = async (): Promise<AppServices> => {
  logger.info("Building app services");
  const appConfig = await readAppConfig();

  const storages = await createStorages(appConfig);
  const youtubeClient = await createYoutubeClient();
  return {
    appConfig,
    storages,
    youtubeClient,
  };
};

const createStorages = async (appConfig: AppConfig) => {
  if (appConfig.db.client === "mock") {
    return createMockStorages();
  } else {
    const storages = createPostgresStorages(appConfig);
    await startStorages(storages);
    return storages;
  }
};

const startStorages = async (storages: Storages) => {
  await storages.knex?.raw("CREATE SCHEMA IF NOT EXISTS app;");
  await storages.knex?.migrate.latest();
};

const createPostgresStorages = (appConfig: AppConfig): Storages => {
  const knex = buildKnex(appConfig.db);
  const songs = new SongsPGStorage(knex);

  return {
    knex,
    songs,
  };
};

const createMockStorages = (): Storages => {
  return {
    knex: null,
    songs: new SongsMockStorage(),
  };
};

export type Storages = {
  knex: Knex | null;
  songs: SongStorage;
};

const createYoutubeClient = () => {
  return new YoutubeMockClient();
};
