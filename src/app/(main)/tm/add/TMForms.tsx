import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewSubstationSchema, NewSubstationValues } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/navigation";
import { valueProps } from "./AddTMFeed";
import addTM from "./action";

export interface TMFormProps {
  Values: valueProps;
  setValues: React.Dispatch<React.SetStateAction<valueProps>>;
}

export function TMForms({ Values, setValues }: TMFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<NewSubstationValues>({
    resolver: zodResolver(NewSubstationSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: NewSubstationValues) {
    const newValues = {
      name: "tm-" + data.name,
      regionId: Values.regionId,
      districtId: Values.districtId,
      substationId: Values.substationId,
      latitude: String(Number(Values.latitude).toFixed(6)),
      longitude: String(Number(Values.longitude).toFixed(6)),
      address: Values.address,
    };
    setError(undefined);
    startTransition(async () => {
      const { success, error, id } = await addTM(newValues);
      if (error) {
        setError(error);
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "New substation has been added",
        });
        router.push(`/tm/${id}`);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-3 w-full space-y-3"
      >
        {error && <p className="text-center text-destructive">{error}</p>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter tm name"
                  autoComplete="off"
                  className="rounded-xl border border-muted-foreground/50 bg-secondary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          loading={isPending}
          disabled={
            !Values.regionId || !Values.districtId || !Values.substationId
          }
          type="submit"
          className="w-full rounded-xl bg-primary transition-all hover:bg-primary/70"
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
