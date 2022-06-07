import { Knex } from "knex";
import { SongStorage } from "ntbs/storages/songs/SongStorage";
import { SongEntity } from "ntbs/entities/SongEntity";
import { toMany, toOptional } from "ntbs/storages/common";
import logger from "ntbs/utils/logger";
import { Table } from "ntbs/storages/db-schema";

export class SongsPGStorage implements SongStorage {
  constructor(private readonly database: Knex) {}

  async getAll(): Promise<SongEntity[]> {
    logger.debug("Get all songs");
    return this.database(Table.Songs).select("*").then(toMany(SongEntity));
  }

  async insert(song: SongEntity): Promise<SongEntity> {
    logger.debug("Insert song", { song });
    const [result] = await this.database(Table.Songs)
      .insert(song)
      .returning("*")
      .then(toMany(SongEntity));

    return result;
  }

  getById(args: { songId: string }): Promise<SongEntity | null> {
    logger.debug("Get song by id", args);

    return this.database(Table.Songs)
      .where({ songId: args.songId })
      .select("*")
      .first()
      .then(toOptional(SongEntity));
  }
}
