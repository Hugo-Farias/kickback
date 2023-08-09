export interface Message {
  type: "urlChanged";
  url: string;
}

export type Timestamp = {
  [key: string]: {
    curr: number;
    total: number;
    title: string | undefined;
    streamer: string | undefined;
    id: string;
  };
};

export interface LocalStamps {
  timestamps: Timestamp;
  lookup: Set<string>;
}

export interface StoredStamps {
  timestamps: Timestamp;
  lookup: string[];
}
