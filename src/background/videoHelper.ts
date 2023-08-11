import { LocalStamps, StoredStamps } from "../typeDef";
import { intervalSecs } from "../config";

export const convertData = function (data: StoredStamps): LocalStamps {
  return {
    timestamps: data.timestamps,
    lookup: new Set(data.lookup),
  };
};

export const deleteTimeStamp = function (id: string, obj: LocalStamps) {
  if (obj.lookup.size <= 0) return;
  obj.lookup.delete(id);
  delete obj.timestamps[id];
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
  console.log("data");
  const data = localStorage!.getItem(name);
  const parsedData =
    data !== null ? JSON.parse(data) : { timestamps: {}, lookup: [] };

  if (convert) return convertData(parsedData);

  return parsedData;
};

let storeInterval: number;
let storeTimeout: number;

const clearAllTimeouts = function () {
  clearTimeout(storeTimeout);
  clearInterval(storeInterval);
};

export const addListenerToVideo = function (
  type: "play" | "pause" | "seeked",
  action: (v: HTMLVideoElement) => void,
  videoEl: HTMLVideoElement,
  time: undefined | number = intervalSecs
) {
  let func: () => void;

  if (type === "pause") {
    func = () => {
      clearAllTimeouts();
      storeTimeout = setTimeout(() => action(videoEl), time * 1000);
    };
  } else if (type === "play") {
    func = () => {
      clearAllTimeouts();
      storeInterval = setInterval(() => action(videoEl), time * 1000);
    };
  } else if (type === "seeked") {
    func = () => {
      clearTimeout(storeTimeout);
      storeTimeout = setTimeout(() => action(videoEl), time * 1000);
    };
  }

  if (!func!) return;

  videoEl.removeEventListener(type, func);
  videoEl.addEventListener(type, func);
};
