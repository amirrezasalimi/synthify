import Pocketbase from "pocketbase";
const pocketbase = async () => {
  console.log("Connecting to Pocketbase...", process.env.POCKETBASE_HOST);

  const _ = new Pocketbase(process.env.POCKETBASE_HOST);
  await _.admins.authWithPassword(
    process.env.POCKETBASE_EMAIL || "",
    process.env.POCKETBASE_PASSWORD || ""
  );
  return _;
};
const pb = await pocketbase();
export { pb };
