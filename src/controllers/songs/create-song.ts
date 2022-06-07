import { Request, Response } from "express";
import { AppServices } from "ntbs/app-services";
import { IsNotEmpty, IsString } from "class-validator";
import { transformToClass } from "ntbs/utils/validation";
import { uuid } from "ntbs/utils/uuid";

export function createSongController(services: AppServices) {
  return async (
    req: Request<any, any, CreateSongRequest>,
    res: Response<CreateSongResponse>
  ) => {
    const requestBody = await transformToClass(CreateSongRequest, {
      name: req.body.name,
      author: req.body.author,
    });

    const song = await services.storages.songs.insert({
      name: requestBody.name,
      author: requestBody.author,
      songId: uuid(),
      addedAt: new Date(),
    });

    res.status(200).send({
      songId: song.songId,
      name: song.name,
      author: song.author,
    });
  };
}

class CreateSongRequest {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly author: string;
}

interface CreateSongResponse {
  songId: string;
  name: string;
  author: string;
}
