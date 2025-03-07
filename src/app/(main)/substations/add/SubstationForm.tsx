import { useState } from "react";
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
import { substationSchema, SubstationValues } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/LoadingButton";

export interface SubstationFormProps {
  values: SubstationValues;
  setValues: React.Dispatch<React.SetStateAction<SubstationValues>>;
}

export function SubstationForm({ values, setValues }: SubstationFormProps) {
  const [error, setError] = useState<string>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const form = useForm<SubstationValues>({
    resolver: zodResolver(substationSchema),
    defaultValues: values, // Use the current values passed from parent
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValues((prevValues) => ({
        ...prevValues,
        image: file,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value ? Number(value) : null,
    }));
  };

  async function onSubmit(values: SubstationValues) {
    // Handle form submission logic here (e.g., upload image, etc.)
    toast({
      title: "Substation added successfully",
      description: "Your substation has been added.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mb-3 w-full">
        {error && <p className="text-center text-destructive">{error}</p>}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  name="name"
                  placeholder="Enter substation name"
                  value={values.name}
                  onChange={handleChange}
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
                  accept="image/*"
                  placeholder="Add substation image"
                  onChange={handleImageChange}
                  className="rounded-xl border border-muted-foreground/50 bg-secondary"
                />
              </FormControl>
              <FormMessage />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="mt-2 h-24 w-24 object-cover"
                />
              )}
            </FormItem>
          )}
        />

        <LoadingButton
          loading={false}
          type="submit"
          className="w-full rounded-xl bg-primary  transition-all hover:bg-primary/70"
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
