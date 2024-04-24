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
      process.env.POCKETBASE_PASSWORD || "",
      {
        params: {
          external_auth_secret: process.env.POCKETBASE_EXTERNAL_AUTH_TOKEN || "",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
  return _;
};
const pb = await pocketbase();
pb.autoCancellation(false)
const pbInstance = () => {
  return new Pocketbase(process.env.POCKETBASE_HOST) as TypedPocketBase;
};
export { pb, pbInstance };
