"use client";
import { feedbackSchema, FeedbackValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Locate, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { appealTopic, numberPrefix } from "@/lib/constant";
import ApplyFeedback from "./action";

export default function Feedback() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 p-2 md:grid-cols-2">
      <ContactUs />
      <FeedBackForm />
    </div>
  );
}

export function ContactUs() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold">Bizimlə əlaqə</h1>

      <p className="text-lg">
        ”Azərişıq” Açıq Səhmdar Cəmiyyətinin rəsmi internet saytı Azərbaycan
        Respublikası Konstitusiyasının 57-ci maddəsinə uyğun olaraq
        vətəndaşların müraciət etmək hüququnun reallaşdırılması vasitəsidir.
        Rəsmi internet saytımızın hər bir istifadəçisinin məktub göndərmək, onu
        maraqlandıran məsələlər barədə fikirlərini və arzularını bildirmək,
        təklif, ərizə və şikayətlə müraciət etmək imkanı vardır.
      </p>

      <p className="text-lg">
        ”Azərişıq” ASC-nin ünvanına elektron formada müraciət göndərməzdən
        əvvəl, xahiş edirik{" "}
        <Link
          href="/about-us/rules/"
          className="font-medium text-primary underline"
        >
          qaydalarla
        </Link>{" "}
        tanış olun.
      </p>

      <ul className="space-y-4">
        <li className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200 bg-secondary">
            <Locate className="text-primary" size={20} />
          </div>
          <span className="text-md">
            Bakı ş., Nəsimi r-nu, Abbasqulu ağa Bakıxanov, 13
          </span>
        </li>

        <li className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200 bg-secondary">
            <Phone className="text-primary" size={20} />
          </div>
          <span className="text-md">199 Çağrı Mərkəzi</span>
        </li>

        <li className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200 bg-secondary">
            <Calendar className="text-primary" size={20} />
          </div>
          <span className="text-md">Bazar ertəsi - Cümə : 09:00 - 18:00</span>
        </li>

        <li className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200 bg-secondary">
            <Mail className="text-primary" size={20} />
          </div>
          <span className="text-md">info@azerishiq.az</span>
        </li>
      </ul>
    </div>
  );
}

export function FeedBackForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [prefixValue, setPrefixValue] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      surname: "",
      phoneNumber: "",
      email: "",
      content: "",
      prefix: "",
      topic: 1,
    },
  });

  async function onSubmit(data: FeedbackValues) {
    const newValues = {
      name: data.name,
      surname: data.surname,
      phoneNumber: data.prefix + data.phoneNumber,
      email: data.email,
      topic: Number(data.topic),
      content: data.content,
    };
    setError(undefined);
    startTransition(async () => {
      const { success, error } = await ApplyFeedback(newValues);
      if (error) {
        setError(error);
      } else if (true) {
        toast({
          title: "Sorğunuz qeydə alındı.",
          description: "Sizə ən yaxın zamanda geri dönüş ediləcək",
        });
        router.push(`/service`);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="mx-auto w-full max-w-xl rounded-md border p-8 shadow-lg"
    >
      <h2 className="mb-6 text-start text-2xl font-bold">Elektron müraciəti</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="border border-muted-foreground/70 bg-secondary"
                      placeholder="Ad"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="surname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soyad</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="border border-muted-foreground/70 bg-secondary"
                      placeholder="Soyad"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="border border-muted-foreground/70 bg-secondary"
                      placeholder="E-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="topic"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mövzu</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger className="border border-muted-foreground/70 bg-secondary">
                        <SelectValue placeholder="Mövzu" />
                      </SelectTrigger>
                      <SelectContent>
                        {appealTopic.map((item, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="prefix"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix seçin</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value ? field.value : "")}
                    >
                      <SelectTrigger className="border border-muted-foreground/70 bg-secondary">
                        <SelectValue placeholder="Prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        {numberPrefix.map((item, i) => (
                          <SelectItem key={i} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Əlaqə</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-muted-foreground/70 bg-secondary"
                      placeholder="Əlaqə (7 rəqəm)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Müraciətin mətni</FormLabel>
                <FormControl>
                  <Textarea
                    autoComplete="off"
                    placeholder="Müraciətin mətni"
                    className="border border-muted-foreground/70 bg-secondary"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isPending}
            type="submit"
            disabled={isPending}
            className="mt-2 w-full"
          >
            Göndər
          </LoadingButton>
        </form>
      </Form>
    </motion.div>
  );
}
