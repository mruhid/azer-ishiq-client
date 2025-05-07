import {
  useMutation,
  useQueryClient,
  QueryFilters,
  InfiniteData,
} from "@tanstack/react-query";
import { UserManagementProps } from "@/lib/type";
import { useToast } from "@/components/ui/use-toast";
import { changeUserRoles, toggleUserBlockedStatus } from "./action";
type BlockUserResult = {
  id: string;
  check: boolean;
};

export function useToggleUserBlockedMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleUserBlockedStatus,
    onSuccess: async ({ id, check }: { id: number; check: boolean }) => {
      const queryFilter: QueryFilters = { queryKey: ["user-management-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<UserManagementProps | null>(
        queryFilter,

        (oldData) => {
          if (!oldData) return oldData;

          return {
            totalCount: oldData.totalCount,
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
      queryClient.invalidateQueries({ queryKey: ["user-management-feed"] });
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

export function useChangeUserRoles() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: changeUserRoles,
    onSuccess: async ({ id, roles }: { id: number; roles: string[] }) => {
      const queryFilter: QueryFilters = { queryKey: ["user-management-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<UserManagementProps | null>(
        queryFilter,

        (oldData) => {
          if (!oldData) return oldData;

          return {
            totalCount: oldData.totalCount,
            page: oldData.page,
            pageSize: oldData.pageSize,
            items: oldData.items.map((user) =>
              user.id === id ? { ...user, userRoles: roles } : user,
            ),
          };
        },
      );

      toast({
        description: `User roles changed succsesfully`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-management-feed"] });
    },
    onError(error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Operation falled,please try latter";

      toast({
        variant: "destructive",
        description: errorMessage,
      });
    },
  });

  return mutation;
}
