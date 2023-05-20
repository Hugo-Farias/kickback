export interface Message {
  type: "urlChanged";
  url: string;
}

type timestamps = {
  [key: string]: { curr: number; total: number; title: string };
};

export interface LocalStamps {
  timestamps: { [key: string]: number };
  lookup: Set<string>;
}

export interface StoredStamps {
  timestamps: { [key: string]: number };
  lookup: string[];
}
