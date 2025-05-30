import { Subscriber } from "./type";

export const formatNumber = (num: number | string, length: number) => {
  return String(num).padStart(length, "0");
};
export const SubsCodeGenerator = (subsValue: Subscriber) => {
  let districtPart = formatNumber(subsValue.districtId, 2);
  let territoryPart = formatNumber(subsValue.territoryId, 2);
  let streetPart = formatNumber(subsValue.streetId, 3);
  let buildingPart = formatNumber(subsValue.building, 4);
  let apartmentPart = formatNumber(subsValue.apartment, 4);

  return `${districtPart}${territoryPart}${streetPart}${buildingPart}${apartmentPart}`;
};
