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

export type oldStamps = {
  timestamps: { [key: string]: Timestamp };
  lookup: string[];
};

export type StoredStamps = { [key: string]: Timestamp };

// Settings

export type OptionsT = {
  id: string;
  label: string;
  type: "checkbox" | "number";
  checked: boolean;
};
