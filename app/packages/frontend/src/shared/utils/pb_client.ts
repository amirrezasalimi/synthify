import Pocketbase, { LocalAuthStore } from "pocketbase";
const POCKETBASE_HOST = import.meta.env.VITE_POCKETBASE_HOST;
export const pb_client = new Pocketbase(POCKETBASE_HOST, new LocalAuthStore());