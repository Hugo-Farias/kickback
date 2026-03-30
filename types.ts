export type Timestamp = {
  curr: number;
  total: number;
  title: string | undefined;
  streamer: string | undefined;
  id: string;
  storageTime: number;
  thumbnailId: string;
  streamerPath: string;
};

export type SettingsT = {
  showProgressBar: boolean;
  showNowPlayingTag: boolean;
  autoCloseChat: boolean;
};

export type SettingsChanges = {
  [K in keyof SettingsT]?: chrome.storage.StorageChange & {
    oldValue?: SettingsT[K];
    newValue?: SettingsT[K];
  };
};

export type StoredData = { [key: string]: Timestamp };
