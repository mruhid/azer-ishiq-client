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
  regionId: number;
  districtId: number;
  longitude: string;
  latitude: string;
  address: string;
  image: null;
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
  populationStatusName: string;
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
  status: number | string;
  ats: string;
  createdAt: string;
  subscriberCode: string;
}

export interface SubscribersProps {
  items: Subscriber[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Operation logs
export interface OperationCells {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  userName: string;
  userId: number;
  userRoles: string[];
  timestamp: string;
}

export interface OperationLogsProps {
  data: OperationCells[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface UserDataProps {
  userName: string;
  email: string;
  phoneNumber: string;
  ipAddress: string;
  createdAt: string;
  userRoles: string[];
  isBlocked: boolean;
}

// users management table
export interface UserCells {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  ipAddress: string;
  isBlocked: false;
  createdAt: string;
  userRoles: string[];
  failedAttempts: number;
  lastFailedAttempt: null | number;
}
export interface UserManagementProps {
  items: UserCells[];
  total: number;
  page?: number;
  pageSize?: number;
}
