import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";

let authToken: string | null = null;
const pocketbase = async () => {
  console.log("Connecting to Pocketbase...", process.env.POCKETBASE_HOST);

  const _ = new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;

  try {
    if (authToken) {
      await _.authStore.save(authToken);
      return _;
    }
    await _.admins
      .authWithPassword(
        process.env.POCKETBASE_EMAIL || "",
        process.env.POCKETBASE_PASSWORD || ""
      )
      .then((res) => {
        authToken = res.token;
      });
  } catch (e) {
    console.log(e);
  }
  return _;
};
const pb = await pocketbase();
pb.autoCancellation(false);
const pbInstance = () => {
  return new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
};
const initPB = async () => {
  await pocketbase();
};
export { pb, pbInstance, initPB };
