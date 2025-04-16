import {
  useMutation,
  useQueryClient,
  QueryFilters,
  InfiniteData,
} from "@tanstack/react-query";
import { UserManagementProps } from "@/lib/type";
import { useToast } from "@/components/ui/use-toast";
import { toggleUserBlockedStatus } from "./action";
type BlockUserResult = {
  id: string;
  check: boolean;
};

export function useToggleUserBlockedMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation<
    { id: number; check: boolean }, // ✅ return type (what toggleUserBlockedStatus resolves with)
    Error, // ❌ error type
    { id: number; check: boolean } // ✅ variables passed into mutationFn
  >({
    mutationFn: toggleUserBlockedStatus,
    onSuccess: async ({ id, check }) => {
      const queryFilter: QueryFilters = { queryKey: ["user-management-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<UserManagementProps | null>(
        queryFilter,

        (oldData) => {
          if (!oldData) return oldData;

          return {
            total: oldData.total,
            page: oldData.page,
            pageSize: oldData.pageSize,
            items: oldData.items.map((user) =>
              user.id === id ? { ...user, isBlocked: check } : user,
            ),
          };
        },
      );

      toast({
        description: `User account is ${!check ? "opened" : "blocked"}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["puser-management-feed"] });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to blocked this. Please try again.",
      });
    },
  });

  return mutation;
}
