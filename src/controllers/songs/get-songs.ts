import { Request, Response } from "express";
import { AppServices } from "ntbs/app-services";

export function getSongsController(services: AppServices) {
  return async (req: Request, res: Response<GetSongsResponse>) => {
    const songs = await services.storages.songs.getAll();

    const responseData = {
      songs: songs.map(song => ({
        songId: song.songId,
        name: song.name,
        author: song.author,
      })),
    };
    res.status(200).send(responseData);
  };
}

export interface GetSongsResponse {
  songs: GetSongsResponseSong[]; // explain why not just array
}

interface GetSongsResponseSong {
  songId: string;
  name: string;
  author: string;
}
