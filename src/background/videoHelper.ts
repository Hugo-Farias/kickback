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
  const data = localStorage!.getItem(name);
  const parsedData =
    data !== null ? JSON.parse(data) : { timestamps: {}, lookup: [] };

  if (convert) return convertData(parsedData);

  return parsedData;
};

let storeInterval: number;
let pauseTimeout: number;
let seekTimeout: number;

const clearAllTimeouts = function () {
  clearInterval(storeInterval);
  clearTimeout(pauseTimeout);
};

export const addListenerToVideo = function (
  type: "play" | "pause" | "seeked" | "keydown",
  videoEl: HTMLVideoElement,
  action: any,
  time: undefined | number = intervalSecs
) {
  let element = type !== "keydown" ? videoEl : videoEl!.parentNode?.parentNode;

  let func: (a?: any) => any | undefined;
  if (type === "pause") {
    func = () => {
      clearAllTimeouts();
      clearTimeout(seekTimeout);
      pauseTimeout = setTimeout(() => action(videoEl), time * 1000);
    };
  } else if (type === "play") {
    func = () => {
      clearAllTimeouts();
      storeInterval = setInterval(() => action(videoEl), time * 1000);
    };
  } else if (type === "seeked") {
    func = () => {
      clearTimeout(seekTimeout);
      seekTimeout = setTimeout(() => {
        action(videoEl);
      }, time * 1000);
    };
  } else if (type === "keydown") {
    func = (e: KeyboardEvent) => {
      action(videoEl, e);
    };
  }

  if (!func! || !element!) return;

  element.removeEventListener(type, func);
  element.addEventListener(type, func);
};
