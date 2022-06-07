export interface YoutubeClient {
  getSongStats(args: { songId: string }): Promise<SongStats>;
  healthCheck(): Promise<void>;
}

export interface SongStats {
  views: number;
  thumbsUp: number;
  comments: number;
}
