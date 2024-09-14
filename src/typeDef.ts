export type Message = {
  type: "urlChanged";
  url: string;
  id: string | null;
};

export type Timestamp = {
  [key: string]: {
    curr: number;
    total: number;
    title: string | undefined;
    streamer: string | undefined;
    id: string;
  };
};

export type LocalStamps = {
  timestamps: Timestamp;
  lookup: Set<string>;
};

export type StoredStamps = {
  timestamps: Timestamp;
  lookup: string[];
};
