export type Timestamp = {
  curr: number;
  total: number;
  title: string | undefined;
  streamer: string | undefined;
  id: string;
  storageTime: number;
  thumbnailId: string;
};

// export type oldStamps = {
//   timestamps: { [key: string]: Timestamp };
//   lookup: string[];
// };

export type StoredData = { [key: string]: Timestamp };
