"use client";
import LoadingButton from "@/components/LoadingButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { subscriberSchema, SubscriberValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import addSubscriber from "./action";
import Image from "next/image";
import LImgae from "@/assets/updateGif.gif";
import { Label } from "@/components/ui/label";
import { DistrictsResponse, RegionsResponse } from "@/app/(main)/RegionFilter";
import {
  StreetResponse,
  TerritoryResponse,
} from "@/app/(main)/subscriber/SubscriberDataTable";
import { useSession } from "../../SessionProvider";
import { fetchQueryFN } from "@/app/(main)/fetchQueryFN";

export type valueProps = {
  regionId: number | undefined;
  districtId: number | undefined;
  territoryId: number | undefined;
  streetId: number | undefined;
};
export default function AddSubscriberForm() {
  const { user } = useSession();
  const [values, setValues] = useState<valueProps>({
    regionId: undefined,
    districtId: undefined,
    territoryId: undefined,
    streetId: undefined,
  });
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<SubscriberValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      name: "",
      surname: "",
      patronymic: "",
      finCode: "",
      phoneNumber: "",
      building: "",
      apartment: "",
      populationStatus: 1,
    },
  });
  async function onSubmit(data: SubscriberValues) {
    const newValues = {
      name: data.name,
      surname: data.surname,
      patronymic: data.patronymic,
      finCode: data.finCode,
      phoneNumber: data.phoneNumber,
      populationStatus: Number(data.populationStatus),
      building: data.building,
      apartment: data.apartment,
      regionId: values.regionId,
      districtId: values.districtId,
      territoryId: values.territoryId,
      streetId: values.streetId,
    };
    setError(undefined);
    startTransition(async () => {
      const { success, error, id } = await addSubscriber(newValues);
      if (error) {
        setError(error);
      } else if (success) {
        await queryClient.invalidateQueries({
          queryKey: ["my-subscriber-status"],
        });
        toast({
          title: "Successful Operation",
          description: "New substation has been added",
        });
        router.push(`/user-account/${user?.id}`);
      }
    });
  }

  return (
    <>
      <AddSubscriberSelect values={values} setValues={setValues} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-2 flex flex-wrap items-center justify-around space-y-4 rounded-2xl border border-muted-foreground/40 bg-card/70 p-4 shadow-lg backdrop-blur-md md:flex-nowrap"
      >
        <div className="flex w-full flex-col shadow-xl md:hidden">
          <h1 className="my-8 block w-full rounded-xl border border-muted-foreground/60 bg-card py-2 text-center md:hidden">
            New subscriber
          </h1>
        </div>

        <div className="mx-auto my-2 w-full max-w-[700px]">
          <h1 className="my-8 hidden rounded-xl border border-muted-foreground/60 bg-card py-2 text-center md:block">
            New subscriber
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mb-3 flex flex-col justify-center gap-y-2"
            >
              {error && (
                <motion.p
                  className="text-center text-destructive"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {/* First Column */}
                <div className="">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">Name</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter subscriber name"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">Surname</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter subscriber surname"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patronymic"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">
                          Father{"'  "}s name
                        </Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter father's name"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="finCode"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">Fin Code</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter subscriber's FIN"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Second Column */}
                <div className="">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">Phone number</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter subscriber's phone number"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="populationStatus"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start opacity-0">
                          Name
                        </Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={String(field.value || 1)}
                          >
                            <SelectTrigger className="rounded-xl border border-muted-foreground/50 bg-secondary">
                              <SelectValue placeholder="Select Population Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-muted-foreground/50 bg-secondary">
                              <SelectItem value="1">Country People</SelectItem>
                              <SelectItem value="2">
                                Non-Country People
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">Building</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter subscriber's building number"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apartment"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-start justify-start">
                        <Label className="ml-1 text-start">Apartment</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter subscriber's apartment number"
                            autoComplete="off"
                            className="rounded-xl border border-muted-foreground/50 bg-secondary"
                          />
                        </FormControl>
                        <AnimatePresence>
                          {fieldState.invalid ? (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FormMessage />
                            </motion.div>
                          ) : (
                            <div className="opacity-0">Block</div>
                          )}
                        </AnimatePresence>{" "}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <LoadingButton
                loading={isPending}
                type="submit"
                className="rounded-xlborder w-full border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary sm:w-auto"
                disabled={
                  !values.districtId ||
                  !values.regionId ||
                  !values.territoryId ||
                  !values.streetId
                }
              >
                Add subsciber
              </LoadingButton>
              {/* Loading Overlay Effect */}
              <AnimatePresence>
                {isPending && (
                  <motion.div
                    className="fixed inset-0 flex h-screen items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="flex flex-col items-center rounded-lg bg-muted-foreground/60"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Image
                        src={LImgae}
                        className="rounded-full"
                        alt="Loading"
                        width={400}
                        height={400}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </div>
      </motion.div>
    </>
  );
}

interface SubscriberSelectProps {
  values: valueProps;
  setValues: Dispatch<SetStateAction<valueProps>>;
}

export function AddSubscriberSelect({
  values,
  setValues,
}: SubscriberSelectProps) {
  const [districtState, setDistrictState] = useState<DistrictsResponse | null>(
    null,
  );
  const [territoryState, setTerritoryState] =
    useState<TerritoryResponse | null>(null);
  const [streetState, setStreetState] = useState<StreetResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(
    null,
  );
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const { session } = useSession();

  const { toast } = useToast();
  const {
    data: regionData,
    isFetching: isFetchingRegions,
    isError: isRegionError,
  } = useQuery<RegionsResponse>({
    queryKey: ["Add-subscriber-feed"],
    queryFn: fetchQueryFN<RegionsResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/region`,
      session,
    ),
    staleTime: Infinity,
  });

  const fetchDistricts = async (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/region/${id}/districts`;
    const result = await fetchQueryFN<DistrictsResponse>(url, session)();
    setDistrictState(result);
  };
  const fetchTerritory = async (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/district/${id}/territories`;
    const result = await fetchQueryFN<TerritoryResponse>(url, session)();
    setTerritoryState(result);
  };
  const fetchStreet = async (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/district/territory/${id}/streets`;
    const result = await fetchQueryFN<StreetResponse>(url, session)();
    setStreetState(result);
  };

  const handleRegionChange = (value: string) => {
    const Id = parseInt(value, 10);
    if (Id) {
      setValues((prevValues) => ({
        ...prevValues,
        regionId: Id,
      }));
      setSelectedDistrict(null);
      setSelectedDistrict(null);
      setSelectedTerritory(null);
      setTerritoryState(null);
      setSelectedStreet(null);
      setStreetState(null);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-2 flex flex-col flex-wrap items-center justify-center gap-4 rounded-2xl border border-muted-foreground/40 bg-card/70 p-2 py-2 shadow-lg backdrop-blur-md sm:flex-row"
    >
      <Select onValueChange={(value) => handleRegionChange(value)}>
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a region"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
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

      <Select
        value={selectedDistrict || ""}
        onValueChange={(value) => {
          setSelectedDistrict(value);
          setSelectedTerritory(null);
          setTerritoryState(null);
          setSelectedStreet(null);
          setStreetState(null);
          setValues((prevValues) => ({
            ...prevValues,
            districtId: parseInt(value, 10),
          }));
          fetchTerritory(Number(value));
        }}
      >
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a district"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
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
      <Select
        value={selectedTerritory || ""}
        onValueChange={(value) => {
          setSelectedTerritory(value);
          setSelectedStreet(null);
          setStreetState(null);
          setValues((prevValues) => ({
            ...prevValues,
            territoryId: parseInt(value, 10),
          }));
          fetchStreet(parseInt(value));
        }}
      >
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a territory"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Territories</SelectLabel>
            {districtState ? (
              territoryState?.territories.map((district) => (
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
      <Select
        value={selectedStreet || ""}
        onValueChange={(value) => {
          setSelectedStreet(value);
          setValues((prevValues) => ({
            ...prevValues,
            streetId: parseInt(value, 10),
          }));
        }}
      >
        <SelectTrigger className="h-12 w-48 rounded-2xl border border-muted-foreground bg-secondary">
          <SelectValue
            placeholder={
              isFetchingRegions ? (
                <div className="mx-auto space-y-2">
                  <Skeleton className="mx-auto h-9 w-[146px] rounded-xl bg-muted-foreground" />
                </div>
              ) : (
                "Select a street"
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-muted-foreground bg-secondary">
          <SelectGroup>
            <SelectLabel>Streets</SelectLabel>
            {districtState ? (
              streetState?.streets.map((district) => (
                <SelectItem key={district.id} value={String(district.id)}>
                  {district.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-districts">
                Choose territory options first
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
