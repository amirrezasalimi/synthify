import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";

const initPb = async (instance: TypedPocketBase) => {
  console.log("Connecting to Pocketbase...", process.env.POCKETBASE_HOST);

  try {
    const authData = await instance.admins
      .authWithPassword(
        process.env.POCKETBASE_EMAIL || "",
        process.env.POCKETBASE_PASSWORD || ""
      );
    if (authData.token) {
      console.log("Connected to Pocketbase");
    } else {
      console.log("Failed to connect to Pocketbase");
    }
  } catch (e: any) {
    console.log("Failed to connect to Pocketbase");
    instance.authStore.clear();
    console.log("authRefresh originalError", e.originalError)
  }
  return instance;
};


const pbInstance = () => {
  const _ = new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
  _.autoCancellation(false);
  _.beforeSend = function (url, options) {
    console.log("- pb: ", url);
    return { url, options };
  };
  return _;
};
const pb = pbInstance();

const initPB = async () => {
  await initPb(pb);
};
export { pb, pbInstance, initPB };
