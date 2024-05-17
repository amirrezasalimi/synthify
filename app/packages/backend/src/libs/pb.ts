import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";

let authToken: string | null = null;
const initPb = async (instance: TypedPocketBase) => {
  console.log("Connecting to Pocketbase...", process.env.POCKETBASE_HOST);
  try {
    if (authToken) {
      await instance.authStore.save(authToken);
      try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        instance.authStore.isValid && await instance.admins.authRefresh();
      } catch (e: any) {
        // clear the auth store on failed refresh
        instance.authStore.clear();
        authToken = "";
        console.log("if (authToken) originalError",e.originalError)
      }
      return instance;
    }
    const authData = await instance.admins
      .authWithPassword(
        process.env.POCKETBASE_EMAIL || "",
        process.env.POCKETBASE_PASSWORD || ""
      );
    authToken = authData.token;
    try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
      instance.authStore.isValid && await instance.admins.authRefresh();
    } catch (e: any) {
      // clear the auth store on failed refresh
      instance.authStore.clear();
      console.log("authRefresh originalError",e.originalError)

    }
  } catch (e) {
    console.log("originalError",e.originalError)
    console.log(e?.message);
  }
  return instance;
};


const pbInstance = () => {
  const _ = new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
  _.autoCancellation(false);
  _.beforeSend = function (url, options) {
    console.log("PB: ",url,options);
    
    return { url, options };
};
  return _;
};
const pb = pbInstance();

const initPB = async () => {
  await initPb(pb);
};
export { pb, pbInstance, initPB };
