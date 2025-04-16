"use client";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
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
import {
  FileScan,
  ReceiptText,
  Unplug,
  UserCheckIcon,
  Zap,
} from "lucide-react";
import {
  DistrictsResponse,
  RegionsResponse,
  SubstationsResponse,
  TmsResponse,
} from "@/app/(main)/RegionFilter";
import { Subscriber } from "@/lib/type";
import { useSession } from "@/app/(main)/SessionProvider";
import { redirect, useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import Link from "next/link";
import sbTmApply from "./action";
import SubscriberStatusBar from "../SubscriberStatusBar";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriberTmFeed({
  subscriber,
}: {
  subscriber: Subscriber;
}) {
  const [subsValue, setSubsValue] = useState<Subscriber>(subscriber);
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="mx-2"
    >
      {/* <SubscriberStatus id={subscriber.id} /> */}
      <SubscriberStatusBar id={subscriber.id} status={Number(subscriber.status)+1} />
      <motion.div
        variants={fadeIn("up", "spring", 0.2, 1.5)}
        className="mx-auto mt-2 flex flex-col items-start justify-center gap-y-2 rounded-xl border border-muted-foreground/60 bg-card py-2 shadow-md"
      >
        <SubscriberFilter subsValue={subsValue} setSubsValue={setSubsValue} />
      </motion.div>
    </motion.div>
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
  const [isPending, startTransition] = useTransition();
  const { session } = useSession();
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [substationState, setSubstationState] =
    useState<SubstationsResponse | null>(null);
  const [tmState, setTmState] = useState<TmsResponse | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    subsValue.regionId ? String(subsValue.regionId) : null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    subsValue.districtId ? String(subsValue.districtId) : null,
  );

  const [selectedSubstation, setSelectedSubstation] = useState<string | null>(
    null,
  );
  const [selectedTm, setSelectedTm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        if (subsValue.regionId) fetchDistricts(subsValue.regionId);
        if (subsValue.districtId) fetchTerritory(subsValue.districtId);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  const { toast } = useToast();
  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["sb-tm-feed", subsValue.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/region`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    },
    staleTime: Infinity,
  });

  const fetchDistricts = async (id: number): Promise<DistrictsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      },
    );

    const result: DistrictsResponse = await response.json();
    setDistrictState(result);
    return result;
  };
  const fetchTerritory = async (id: number): Promise<SubstationsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/${id}/substations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      },
    );
    if (!response.ok) {
      toast({
        title: "Substations not found on current district",
        variant: "destructive",
      });
      throw new Error(`Error fetching substation: ${response.statusText}`);
    }
    const result: SubstationsResponse = await response.json();

    setSubstationState(result);
    return result;
  };
  const fetchStreet = async (id: number): Promise<TmsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/district/substation/${id}/tms`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      },
    );

    if (!response.ok) {
      toast({
        title: "Tms not found on current substation",
        variant: "destructive",
      });
      throw new Error(`Error fetching tms: ${response.statusText}`);
    }

    const result: TmsResponse = await response.json();
    setTmState(result);
    return result;
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
  const formatNumber = (num: number | string, length: number) => {
    return String(num).padStart(length, "0");
  };

  async function onApply() {
    if (!Number(selectedTm)) {
      toast({
        title: "Choose Tm option first",
        variant: "destructive",
      });

      return;
    }
    const newValues = {
      data: { tmId: Number(selectedTm) },
      subsId: subsValue.id,
    };

    startTransition(async () => {
      const { success, error } = await sbTmApply(newValues);
      if (error) {
        toast({
          title: "Something went wrong",
          description: error,
          variant: "destructive",
        });
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "Subscriber code creating successfully",
        });
        router.push(`/subscriber/${subsValue.id}/sb-contract`);
      }
    });
  }

  return (
    <>
      <div className="mx-auto flex flex-wrap items-start justify-center gap-2 lg:flex-nowrap">
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">Region</p>
          <Select
            value={selectedRegion || "No result"}
            readOnly
            // onValueChange={(value) => {
            //   setSelectedRegion(value);
            //   setSelectedDistrict(null);
            //   setDistrictState(null);
            //   setSelectedSubstation(null);
            //   setSubstationState(null);
            //   setSelectedTm(null);
            //   setTmState(null);
            //   handleRegionChange(value);
            //   fetchDistricts(Number(value));
            // }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions || isLoading ? (
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
                  {(isFetchingRegions || isLoading) && (
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
                        {formatNumber(region.id, 2)}
                        {": "}
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
            value={selectedDistrict || "No result"}
            readOnly

            // onValueChange={(value) => {
            //   setSelectedDistrict(value);
            //   setSelectedSubstation(null);
            //   setSubstationState(null);
            //   setSelectedTm(null);
            //   setTmState(null);
            //   fetchTerritory(Number(value));
            // }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions || isLoading ? (
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
                      {formatNumber(district.id, 2)} {": "}
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
          <p className="text-sm font-bold">Substations</p>
          <Select
            value={selectedSubstation || "No resault"}
            onValueChange={(value) => {
              setSelectedSubstation(value);
              setSelectedTm(null);
              setTmState(null);
              fetchStreet(Number(value));
            }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions || isLoading ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton className="mx-auto h-9 w-[120px] rounded-sm bg-muted-foreground" />
                    </div>
                  ) : (
                    "Select a substtion"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-muted-foreground bg-secondary">
              <SelectGroup>
                <SelectLabel>Substations</SelectLabel>
                {districtState ? (
                  substationState?.substations.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                      {district.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-districts">
                    Choose district options first
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-start gap-y-1">
          <p className="text-sm font-bold">TMS</p>
          <Select
            value={selectedTm || "No resault"}
            onValueChange={(value) => {
              setSelectedTm(value);
            }}
          >
            <SelectTrigger className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
              <SelectValue
                placeholder={
                  isFetchingRegions || isLoading ? (
                    <div className="mx-auto space-y-2">
                      <Skeleton className="mx-auto h-9 w-[120px] rounded-sm bg-muted-foreground" />
                    </div>
                  ) : (
                    "Select a Tm"
                  )
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-sm border border-muted-foreground bg-secondary">
              <SelectGroup>
                <SelectLabel>Tms</SelectLabel>
                {districtState ? (
                  tmState?.tms.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                      {" "}
                      {district.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-districts">
                    Choose substation options first
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mx-auto flex w-full flex-wrap items-start justify-between gap-2 px-[5.6rem] sm:px-10 lg:flex-nowrap">
        <div className="flex w-full flex-col items-start justify-start gap-y-1">
          <LoadingButton
            loading={isPending}
            onClick={onApply}
            disabled={Number(subsValue.status)>3}
            className="mt-4 w-full rounded-sm border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
          >
            Apply
          </LoadingButton>
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
export function SubscriberStatus({ id }: { id: number }) {
  const status = 5;
  const list: listProps[] = [
    {
      name: "Application acceptance",
      src: "/subscriber",
      color: "bg-green-800",
      icon: ReceiptText,
    },
    {
      name: "Generate code",
      color: "bg-green-700",
      src: `/subscriber/${id}/code-for-subscriber`,
      icon: FileScan,
    },
    {
      name: "Electric meter",
      color: "bg-green-600",
      src: `/subscriber/${id}/sb-counter`,
      icon: Zap,
    },
    {
      name: "TM connection",
      color: "bg-green-500",
      src: `/subscriber/${id}/sb-tm`,
      icon: Unplug,
    },
    {
      name: "The contract",
      color: "bg-gray-300",
      src: "/subscriber/${id}/sb-contract",
      icon: UserCheckIcon,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-2 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {list.map((item, index) =>
        index + 1 < status ? (
          <Link
            href={item.src}
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
          </Link>
        ) : (
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
        ),
      )}
    </div>
  );
}
