import { SongStats, YoutubeClient } from "ntbs/clients/youtube/YoutubeClient";

export class YoutubeMockClient implements YoutubeClient {
  async getSongStats(args: { songId: string }): Promise<SongStats> {
    return {
      comments: 10,
      thumbsUp: 10,
      views: 1000,
    };
  }

  healthCheck(): Promise<void> {
    return Promise.resolve();
  }
}
