import { useQuery } from "@tanstack/react-query";
import { pb_client } from "../utils/pb_client";
import { UsersResponse } from "@synthify/backend/src/types/pocketbase";

const useAuth = () => {
  const isLoginned = useQuery({
    queryKey: ["pb-auth"],
    queryFn: async () => {
      if (pb_client.authStore?.token) {
        await pb_client.collection("users").authRefresh();
        return pb_client.authStore.isValid;
      }
      return false;
    }
  });
  const logout = async () => {
    await pb_client.authStore.clear();
    isLoginned.refetch();
  };
  const refresh = async () => {
    isLoginned.refetch();
  };
  return {
    status: isLoginned.status,
    isLogin: isLoginned.data,
    user: pb_client.authStore.model as UsersResponse,
    logout,
    refresh,
  };
};

export default useAuth;
