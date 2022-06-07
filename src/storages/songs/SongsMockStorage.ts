import { SongStorage } from "ntbs/storages/songs/SongStorage";
import { SongEntity } from "ntbs/entities/SongEntity";

export class SongsMockStorage implements SongStorage {
  private songs: Record<string, SongEntity> = buildInitialState();

  async getAll(): Promise<SongEntity[]> {
    return Object.values(this.songs);
  }

  async insert(data: SongEntity): Promise<SongEntity> {
    if (this.songs[data.songId]) {
      throw new Error(`Duplicated song by id: ${data.songId}`);
    }
    this.songs[data.songId] = data;
    return data;
  }

  async getById(args: { songId: string }): Promise<SongEntity | null> {
    return this.songs[args.songId] || null;
  }
}

function buildInitialState() {
  const mockSongId1 = "c6174603-cbd0-438a-8501-c193ba91dd56";
  const mockSongId2 = "b684ba3e-5e58-478d-bd3c-f17bc2b194fc";
  return {
    [mockSongId1]: {
      name: "Zrobię to potem",
      songId: mockSongId1,
      author: "Krulig",
      addedAt: new Date(),
    },
    [mockSongId2]: {
      name: "Ballada o byciu raperem i programistą",
      songId: mockSongId2,
      author: "Krulig",
      addedAt: new Date(),
    },
  };
}
