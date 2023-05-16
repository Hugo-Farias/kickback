export interface Message {
  type: "urlChanged";
  url: string;
}

export interface StoredTimeStamps {
  timestamps: { [key: string]: number };
  lookup: Set<string>;
}

export interface LocalTimeStamps {
  timestamps: { [key: string]: number };
  lookup: string[];
}
