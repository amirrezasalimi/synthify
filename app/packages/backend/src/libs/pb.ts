import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";

let authToken: string | null = null;
const initPb = async (_: TypedPocketBase) => {
  console.log("Connecting to Pocketbase...", process.env.POCKETBASE_HOST);
  try {
    if (authToken) {
      await _.authStore.save(authToken);
      try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        _.authStore.isValid && await _.admins.authRefresh();
      } catch (e: any) {
        // clear the auth store on failed refresh
        _.authStore.clear();
        authToken = "";
      }
      return _;
    }
    const authData = await _.admins
      .authWithPassword(
        process.env.POCKETBASE_EMAIL || "",
        process.env.POCKETBASE_PASSWORD || ""
      );
    authToken = authData.token;
    try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
      _.authStore.isValid && await _.admins.authRefresh();
    } catch (e: any) {
      // clear the auth store on failed refresh
      _.authStore.clear();
    }
  } catch (e) {
    console.log(e?.message);
  }
  return _;
};


const pbInstance = () => {
  const _ = new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
  _.autoCancellation(false);
  return _;
};
const pb = pbInstance();

const initPB = async () => {
  await initPb(pb);
};
export { pb, pbInstance, initPB };
