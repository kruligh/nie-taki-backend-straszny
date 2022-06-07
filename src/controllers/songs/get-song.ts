import { Request, Response } from "express";
import { AppServices } from "ntbs/app-services";
import { HttpErrorResponse } from "ntbs/utils/errors";
import { IsString, IsUUID } from "class-validator";
import { transformToClass } from "ntbs/utils/validation";

export function getSongController(services: AppServices) {
  return async (
    req: Request<GetSongParams, {}, {}, {}>, // explain query params
    res: Response<GetSongResponse>
  ) => {
    const requestData = await transformToClass(GetSongRequest, {
      songId: req.params.songId!,
    });

    // explain service method
    const song = await services.storages.songs.getById({
      songId: requestData.songId,
    });

    if (!song) {
      throw new HttpErrorResponse(404, {
        message: "Song with given id does not exist",
      });
    }

    const songStats = await services.youtubeClient
      .getSongStats({
        songId: song.songId,
      })
      .catch(err => null); // explain how important is to handle 3rd party error scenario

    res.status(200).send({
      songId: song.songId,
      name: song.name,
      author: song.author,
      addedAt: song.addedAt,
      listeningCount: songStats?.views || null,
    });
  };
}

interface GetSongParams {
  songId?: string;
}

class GetSongRequest {
  @IsString()
  @IsUUID()
  readonly songId: string;
}

interface GetSongResponse {
  songId: string;
  name: string;
  author: string;
  addedAt: Date;
  listeningCount: number | null;
}
