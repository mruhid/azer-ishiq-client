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

export type TmDetailProps = {
  id: number;
  name: string;
  substation: {
    id: number;
    name: string;
    districtId: number;
    district: {
      id: number;
      name: string;
      regionId: number;
      region: {
        id: number;
        name: string;
      };
    };
  };
  location: SubsLocation | null;
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
  fullName: string;
  email: string;
  phoneNumber: string;
  ipAddress: string;
  createdAt: string;
  userRoles: string[];
  isBlocked: boolean;
}

export type SubscriberDataProps = {
  id: number;
  entryName: string;
  action: string;
  entryId: number;
  userId: number;
  userName: string;
  userRoles: string[];
  timestamp: string;
};
// users management table
export interface UserCells {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  ipAddress: string;
  isBlocked: boolean;
  createdAt: string;
  userRoles: string[];
  failedAttempts: number;
  lastFailedAttempt: null | number;
}
export interface UserManagementProps {
  items: UserCells[];
  totalCount: number;
  page?: number;
  pageSize?: number;
}

export interface MyStatusProps {
  id: number;
  fullName: string;
  phoneNumber: string;
  finCode: string;
  populationStatus: string;
  region: string;
  district: string;
  territory: string;
  address: string;
  ats: string;
  subscriberCode: null | string;
  requestStatus: string;
}

// Subscriber debt value
export type DebtResponse = {
  subscriberCode: string;
  districtName: string;
  name: string;
  surname: string;
  totalCurrentValue: number;
  debt: number;
};

// FeedBack data

export type FeedbackObject = {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  topic: number;
  content: string;
  isRead: boolean;
  isReplied: boolean;
  readAt: string;
  repliedAt: string;
  createdAt: string;
};

export type FeedBackProps = {
  items: FeedbackObject[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type FeedbackStatisticsProps = {
  totalAppeals: number;
  readAppeals: number;
  unreadAppeals: number;
  repliedAppeals: number;
  notRepliedAppeals: number;
  byTopic: {
    Qeza: number;
    Sikayet: number;
    InsanQaynaqlari: number;
    OnlaynOdemeMuracieti: number;
    QisaMelumat: number;
  };
  monthlyAppeals: {
    "2025-04": number;
    "2025-05": number;
  };
};
