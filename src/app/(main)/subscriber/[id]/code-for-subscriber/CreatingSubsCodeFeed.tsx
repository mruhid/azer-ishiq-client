"use client";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileScan,
  ReceiptText,
  Unplug,
  UserCheckIcon,
  Zap,
} from "lucide-react";
import { DistrictsResponse, RegionsResponse } from "@/app/(main)/RegionFilter";
import { Subscriber } from "@/lib/type";
import { formatDate } from "date-fns";

export default function CreatingSubsCodeFeed({
  subscriber,
}: {
  subscriber: Subscriber;
}) {
  const [subsValue, setSubsValue] = useState<Subscriber>(subscriber);
  return (
    <>
      <SubscriberStatus />
      <div className="mx-auto flex flex-col items-start justify-center gap-y-2 rounded-xl border border-muted-foreground/60 bg-card py-2 shadow-md">
        <SubscriberFilter subsValue={subsValue} setSubsValue={setSubsValue} />
      </div>
    </>
  );
}

type SubscriberFilter = {
  subsValue: Subscriber;
  setSubsValue: Dispatch<SetStateAction<Subscriber>>;
};
export function SubscriberFilter({
  subsValue,
  setSubsValue,
}: SubscriberFilter) {
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    subsValue.regionId ? String(subsValue.regionId) : null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    subsValue.districtId ? String(subsValue.districtId) : null,
  );
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(
    subsValue.territoryId ? String(subsValue.territoryId) : null,
  );
  const [selectedStreet, setSelectedStreet] = useState<string | null>(
    subsValue.streetId ? String(subsValue.streetId) : null,
  );
  const { toast } = useToast();
  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["substation-location-feed"],
    queryFn: () =>
      kyInstance
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region`)
        .json<RegionsResponse>(),
    staleTime: Infinity,
  });

  const fetchDistricts = async (id: number) => {
    const response = await kyInstance
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`)
      .json<DistrictsResponse>();
    setDistrictState(response);
  };
  const handleRegionChange = (value: string) => {
    const Id = parseInt(value, 10);
    if (Id) {
      fetchDistricts(Id);
    }
  };

  if (isRegionError) {
    toast({
      title: "Error",
      description: "Server not response,try latter",
      variant: "destructive",
    });
    return;
  }

  const SubsCodeGenerator = () => {
    const formatNumber = (num: number | string, length: number) => {
      return String(num).padStart(length, "0");
    };

    let districtPart = formatNumber(subsValue.districtId, 2);
    let territoryPart = formatNumber(subsValue.territoryId, 2);
    let streetPart = formatNumber(subsValue.streetId, 3);
    let buildingPart = formatNumber(subsValue.building, 4);
    let apartmentPart = formatNumber(subsValue.apartment, 4);

    return `${districtPart}${territoryPart}${streetPart}${buildingPart}${apartmentPart}`;
  };
  const handleBuildingChange = (value: string) => {
    setSubsValue((prevValues) => ({
      ...prevValues,
      building: value,
    }));
  };

  const handleApartmentChange = (value: string) => {
    setSubsValue((prevValues) => ({
      ...prevValues,
      apartment: value,
    }));
  };
  return (
    <>
      <div className="mx-auto flex flex-wrap items-start justify-center gap-2 lg:flex-nowrap">
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Region</p>
          <Select
            value={selectedRegion || ""}
            onValueChange={(value) => {
              setSelectedRegion(value);
              setSelectedDistrict(null);
              setSubsValue((prevValues) => ({
                ...prevValues,
                regionId: parseInt(value, 10),
              }));
              handleRegionChange(value);
            }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton className="mx-auto h-9 w-[120px] rounded-sm bg-muted-foreground" />
                    </div>
                  ) : (
                    "Select a region"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-muted-foreground bg-secondary">
              <SelectGroup>
                <SelectLabel className="text-left">
                  <div className="text-left">Regions</div>
                </SelectLabel>
                <ScrollArea className="h-30 border-t">
                  {isFetchingRegions && (
                    <SelectItem disabled value="error">
                      Loading...
                    </SelectItem>
                  )}
                  {isRegionError ? (
                    <SelectItem disabled value="error">
                      Error fetching regions
                    </SelectItem>
                  ) : (
                    regionData?.region.map((region) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.name}
                      </SelectItem>
                    ))
                  )}
                </ScrollArea>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">District</p>
          <Select
            value={selectedDistrict || ""}
            onValueChange={(value) => {
              setSelectedDistrict(value);
              setSubsValue((prevValues) => ({
                ...prevValues,
                districtId: parseInt(value, 10),
              }));
            }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton className="mx-auto h-9 w-[120px] rounded-sm bg-muted-foreground" />
                    </div>
                  ) : (
                    "Select a district"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-muted-foreground bg-secondary">
              <SelectGroup>
                <SelectLabel>Districts</SelectLabel>
                {districtState ? (
                  districtState.districts.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                      {district.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-districts">
                    Choose region options first
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Therectory</p>
          <Select
            value={selectedDistrict || ""}
            onValueChange={(value) => {
              setSelectedDistrict(value);
              //   setValues((prevValues) => ({
              //     ...prevValues,
              //     districtId: parseInt(value, 10),
              //   }));
            }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton className="mx-auto h-9 w-[120px] rounded-sm bg-muted-foreground" />
                    </div>
                  ) : (
                    "Select a district"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-muted-foreground bg-secondary">
              <SelectGroup>
                <SelectLabel>Districts</SelectLabel>
                {districtState ? (
                  districtState.districts.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                      {district.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-districts">
                    Choose region options first
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Street</p>
          <Select
            value={selectedDistrict || ""}
            onValueChange={(value) => {
              setSelectedDistrict(value);
              //   setValues((prevValues) => ({
              //     ...prevValues,
              //     districtId: parseInt(value, 10),
              //   }));
            }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton className="mx-auto h-9 w-[120px] rounded-sm bg-muted-foreground" />
                    </div>
                  ) : (
                    "Select a district"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-muted-foreground bg-secondary">
              <SelectGroup>
                <SelectLabel>Districts</SelectLabel>
                {districtState ? (
                  districtState.districts.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                      {district.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-districts">
                    Choose region options first
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Building number</p>
          <Input
            className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
            placeholder="0001"
            value={subsValue.building || ""}
            onChange={(e) => handleBuildingChange(e.target.value)}
          />
          <Button
            variant={"outline"}
            className="w-full rounded-sm border border-muted-foreground/60"
          >
            Reset
          </Button>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Apartment number</p>
          <Input
            className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
            placeholder="0401"
            value={subsValue.apartment || ""}
            onChange={(e) => handleApartmentChange(e.target.value)}
          />
          <Button className="w-full rounded-sm bg-primary transition-all hover:bg-primary/70">
            Check
          </Button>
        </div>
      </div>
      <div className="mx-auto flex w-full flex-wrap items-start justify-between gap-2 px-[5.6rem] sm:px-10 lg:flex-nowrap">
        <div className="flex w-full flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Subscriber number</p>
          <Input
            className="w-full rounded-sm border border-muted-foreground bg-secondary shadow-sm"
            placeholder="0001"
            readOnly
            value={SubsCodeGenerator()}
          />
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Remark</p>
          <Input
            className="w-full rounded-sm border border-muted-foreground bg-secondary shadow-sm"
            placeholder="0001"
            readOnly
            value={subsValue.ats}
          />
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Time</p>
          <Input
            className="w-full rounded-sm border border-muted-foreground bg-secondary shadow-sm"
            placeholder="0001"
            readOnly
            value={formatDate(subsValue.createdDate, "MMM d,yyyy")}
          />
        </div>
      </div>
    </>
  );
}

type listProps = {
  name: string;
  src: string;
  icon: React.ElementType;
  color: string;
};
export function SubscriberStatus() {
  const status = 3;
  const list: listProps[] = [
    {
      name: "Application acceptance",
      src: "/",
      color: "bg-green-800",
      icon: ReceiptText,
    },
    { name: "Generate code", color: "bg-green-600", src: "/", icon: FileScan },
    { name: "Electric meter", color: "bg-gray-300", src: "/", icon: Zap },
    { name: "TM connection", color: "bg-gray-300", src: "/", icon: Unplug },
    {
      name: "The contract",
      color: "bg-gray-300",
      src: "/",
      icon: UserCheckIcon,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-2 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {list.map((item, index) => (
        <div
          key={index}
          className={`flex w-full flex-col items-center justify-center p-1 ${item.color} ${index + 1 < status ? `cursor-pointer` : `cursor-not-allowed`} rounded-sm shadow-md`}
        >
          <div className="flex items-center justify-center rounded-full bg-white p-1">
            <item.icon size={32} className="text-black" />
          </div>
          <p
            className={`mt-2 text-center text-sm font-bold ${index + 1 < status ? `text-white` : `text-black`}`}
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}
