import { SongEntity } from "ntbs/entities/SongEntity";

export interface SongStorage {
  getAll(): Promise<SongEntity[]>;
  getById(args: { songId: string }): Promise<SongEntity | null>;
  insert(data: SongEntity): Promise<SongEntity>;
}
