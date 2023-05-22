export interface Message {
  type: "urlChanged";
  url: string | undefined;
}

type timestamps = {
  [key: string]: {
    curr: number;
    total: number;
    title: string;
    streamer: string;
    id: string;
  };
};

export interface LocalStamps {
  timestamps: timestamps;
  lookup: Set<string>;
}

export interface StoredStamps {
  timestamps: timestamps;
  lookup: string[];
}
