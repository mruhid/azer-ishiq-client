import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

type SelectLayoutProps<T extends { id: number | string; name: string }> = {
  title: string;
  value: string | null;
  onChange: (value: string) => void;
  selectData: T[] | null;
  isLoading?: boolean;
  isError?: boolean;
  placeholder?: string;
  disabledPlaceholder?: string;
};

export function SelectLayout<T extends { id: number | string; name: string }>({
  title,
  value,
  onChange,
  selectData,
  isLoading = false,
  isError = false,
  placeholder,
  disabledPlaceholder = `No ${title.toLowerCase()} options`,
}: SelectLayoutProps<T>) {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-1 md:w-36">
      <p className="ml-1 text-sm font-bold">{title}</p>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="w-full rounded-md bg-card text-sm font-normal">
          <SelectValue
            placeholder={
              isLoading ? (
                <Skeleton className="mx-auto h-9 w-[146px] rounded-md bg-muted-foreground" />
              ) : (
                placeholder || `Select a ${title.toLowerCase()}`
              )
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-md bg-card text-sm font-normal">
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            {isError ? (
              <SelectItem disabled value="error">
                Error fetching {title.toLowerCase()}
              </SelectItem>
            ) : selectData && selectData.length > 0 ? (
              selectData.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))
            ) : (
              !isLoading && (
                <SelectItem disabled value={`no-${title.toLowerCase()}`}>
                  {disabledPlaceholder}
                </SelectItem>
              )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
