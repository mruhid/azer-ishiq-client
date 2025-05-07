import { useToast } from "@/components/ui/use-toast";
import { FeedBackProps } from "@/lib/type";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateMessageReadStatus } from "./action";

export function useupdateMessaageRead() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateMessageReadStatus,
    onSuccess: async ({ id, read }: { id: number; read: boolean }) => {
      const queryFilter: QueryFilters = { queryKey: ["user-feedback"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<FeedBackProps | null>(
        queryFilter,

        (oldData) => {
          if (!oldData) return oldData;

          return {
            totalCount: oldData.totalCount,
            page: oldData.page,
            pageSize: oldData.pageSize,
            items: oldData.items.map((user) =>
              user.id === id ? { ...user, isBlocked: read } : user,
            ),
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-feedback"] });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to change message status. Please try again.",
      });
    },
  });

  return mutation;
}
