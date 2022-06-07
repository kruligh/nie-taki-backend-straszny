import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class SongEntity {
  @IsUUID()
  readonly songId: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsDate()
  @Type(() => Date)
  readonly addedAt: Date;
}
