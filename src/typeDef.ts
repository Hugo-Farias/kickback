export interface Message {
  type: "urlChanged";
  url: string;
}

export interface LocalStamps {
  timestamps: { [key: string]: number };
  lookup: Set<string>;
}

export interface StoredStamps {
  timestamps: { [key: string]: number };
  lookup: string[];
}
