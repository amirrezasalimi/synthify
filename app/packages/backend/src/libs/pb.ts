import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";
const pocketbase = async () => {
  console.log(
    "Connecting to Pocketbase...",
    process.env.POCKETBASE_HOST,
  );

  const _ = new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;

  try {
    await _.admins.authWithPassword(
      process.env.POCKETBASE_EMAIL || "",
      process.env.POCKETBASE_PASSWORD || ""
    );
  } catch (e) {
    console.log(e);
  }
  return _;
};
const pb = await pocketbase();
const pbInstance = () => {
  return new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
};
export { pb, pbInstance };
