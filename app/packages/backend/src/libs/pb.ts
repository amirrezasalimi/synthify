import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";
const pocketbase = async () => {
  console.log("Connecting to Pocketbase...", process.env.POCKETBASE_HOST);

  const _ = new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
  await _.admins.authWithPassword(
    process.env.POCKETBASE_EMAIL || "",
    process.env.POCKETBASE_PASSWORD || ""
  );
  return _;
};
const pb = await pocketbase();
const pbInstance = () => {
  return new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
};
export { pb, pbInstance };
