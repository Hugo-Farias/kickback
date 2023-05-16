import { LocalTimeStamps, StoredTimeStamps } from "./typeDef";
import { deleteFromObject } from "./helper";

export const convertData = function (data: LocalTimeStamps): StoredTimeStamps {
  return {
    timestamps: data.timestamps,
    lookup: new Set(data.lookup),
  };
};

export const deleteTimeStamp = function (urlId: string, obj: StoredTimeStamps) {
  if (obj.lookup.size <= 0) return;
  deleteFromObject(urlId, obj.timestamps);
  obj.lookup.delete(urlId);
  // localStorage.setItem(localStorageTimeStampName, stringLook);
};

export const storeData = function (name: string, data: StoredTimeStamps) {
  localStorage.setItem(
    name,
    JSON.stringify({
      lookup: [...data.lookup],
      timestamps: data.timestamps,
    })
  );
};
