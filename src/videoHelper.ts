import { LocalStamps, StoredStamps } from "./typeDef";
import { deleteFromObject } from "./helper";

export const convertData = function (data: StoredStamps): LocalStamps {
  return {
    timestamps: data.timestamps,
    lookup: new Set(data.lookup),
  };
};

export const deleteTimeStamp = function (urlId: string, obj: LocalStamps) {
  if (obj.lookup.size <= 0) return;
  obj.lookup.delete(urlId);
  deleteFromObject(urlId, obj.timestamps);
  // localStorage.setItem(localStorageTimeStampName, stringLook);
};

export const storeData = function (name: string, data: LocalStamps) {
  localStorage.setItem(
    name,
    JSON.stringify({
      lookup: [...data.lookup],
      timestamps: data.timestamps,
    })
  );
};

export const getData = function (
  name: string,
  convert: boolean = true
): LocalStamps | StoredStamps {
  const data = localStorage!.getItem(name);
  const parsedData =
    data !== null ? JSON.parse(data) : { timestamps: {}, lookup: [] };

  if (convert) return convertData(parsedData);

  return parsedData;
};
