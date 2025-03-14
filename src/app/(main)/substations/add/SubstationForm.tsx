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
import {
  NewSubstationSchema,
  NewSubstationValues,
  substationSchema,
  SubstationValues,
} from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/LoadingButton";
import addSubstation from "./action";
import { useRouter } from "next/navigation";
import { valueProps } from "./SubstationFeed";

export interface SubstationFormProps {
  Values: valueProps;
  setValues: React.Dispatch<React.SetStateAction<valueProps>>;
}

export function SubstationForm({ Values, setValues }: SubstationFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<NewSubstationValues>({
    resolver: zodResolver(NewSubstationSchema),
    defaultValues: {
      name: "",
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValues((prevValues) => ({
        ...prevValues,
        image: file,
      }));
      form.setValue("image", file, { shouldValidate: true });
    }
  };

  async function onSubmit(data: NewSubstationValues) {
    const newValues = {
      name: data.name,
      image: data.image,
      regionId: String(Values.regionId),
      districtId: String(Values.districtId),
      latitude: Number(Values.latitude).toFixed(6),
      longitude: Number(Values.longitude).toFixed(6),
      address: Values.address,
    };
    setError(undefined);
    startTransition(async () => {
      const { success, error, id } = await addSubstation(newValues);
      if (error) {
        setError(error);
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "New substation has been added",
        });
        router.push(`/substations/${id}`);
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
                  placeholder="Enter substation name"
                  autoComplete="off"
                  className="rounded-xl border border-muted-foreground/50 bg-secondary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg, image/png,"
                  placeholder="Add substation image"
                  className="rounded-xl border border-muted-foreground/50 bg-secondary"
                  onChange={handleImageChange} // Update image change handler
                />
              </FormControl>
              <FormMessage />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="mx-auto h-24 w-24 object-cover"
                />
              )}
            </FormItem>
          )}
        />

        <LoadingButton
          loading={isPending}
          disabled={!Values.regionId || !Values.districtId}
          type="submit"
          className="w-full rounded-xl bg-primary transition-all hover:bg-primary/70"
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
