export type Message = {
  type: "urlChanged";
  url: string;
  id: string | null;
};

export type Timestamp = {
  curr: number;
  total: number;
  title: string | undefined;
  streamer: string | undefined;
  id: string;
  storageTime: number;
};

// export type LocalStamps = {
//   timestamps: Timestamp;
//   lookup: Set<string>;
// };

export type StoredStamps = {
  timestamps: { [key: string]: Timestamp };
  lookup: string[];
};
