import type { StoredData } from "@/types";

export const renderProgressBar = (fullData: StoredData | null) => {
  if (!fullData) return;
  const id = "aksdfjasdf";
  fullData[id].curr;
  console.log("data[id].curr ==>", fullData[id].curr);
  fullData[id].total;
};
