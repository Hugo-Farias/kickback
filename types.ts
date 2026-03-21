export type Timestamp = {
  curr: number;
  total: number;
  title: string | undefined;
  streamer: string | undefined;
  id: string;
  storageTime: number;
  thumbnailId: string;
};

export type StoredData = { [key: string]: Timestamp };
