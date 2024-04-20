import { useState } from "react";
import useAuth from "@/shared/hooks/auth";
import { pb_client } from "@/shared/utils/pb_client";
import toast from "react-hot-toast";

const useAuthFlow = () => {
  const auth = useAuth();
  const [currentAuthLoading, setCurrentAuthLoading] = useState<string | null>(
    null
  );

  const open = async (name: string) => {
    setCurrentAuthLoading(name);

    try {
      const res = await pb_client.collection("users").authWithOAuth2({
        provider: "github",
      });
      if (res.token) {
        // pb_client.authStore.save(res.token);
        auth.refresh();
      }
    } catch (e) {
      // @ts-ignore
      toast.error(e.message || "An error occurred");
    }
    setCurrentAuthLoading(null);
  };
  return {
    open,
    currentAuthLoading,
  };
};

export default useAuthFlow;
