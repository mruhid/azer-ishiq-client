export type TMProps = {
  id: number;
  name: string;
};
export type SubstationProps = {
  id: number;
  name: string;
  district: SubsDistrict;
  location: SubsLocation | null;
  images: SubsImg[];
};

type SubsDistrict = {
  id: number;
  name: string;
  region: SubsRegion;
};
type SubsRegion = {
  id: number;
  name: string;
};
type SubsLocation = {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
};
type SubsImg = {
  id: number;
  imageName: string;
};
// Table Props
export type TmRableProps = {
  items: Tmitem[];
  totalCount: number;
  page: number;
  pageSize: number;
};
export type Tmitem = {
  id: number;
  name: string;
  substationId: number;
};
export type SubstationDataTableProps = {
  items: SubstationItemsProps[];
  totalCount: number;
  page: number;
  pageSize: number;
};
export type SubstationItemsProps = {
  id: number;
  name: string;
  substationId: number;
};

// Subscriber props
export interface Subscriber {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  phoneNumber: string;
  finCode: string;
  populationStatus: number;
  regionId: number;
  regionName: string;
  districtId: number;
  districtName: string;
  territoryId: number;
  terriotoryName: string;
  streetId: number;
  streetName: string;
  building: string;
  apartment: string;
  status: number;
  ats: string;
  createdDate: string;
  subscriberCode: string;
}

export interface SubscribersProps {
  items: Subscriber[];
  totalCount: number;
  page: number;
  pageSize: number;
}
