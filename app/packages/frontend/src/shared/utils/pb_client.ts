import Pocketbase, { LocalAuthStore } from "pocketbase";
const POCKETBASE_HOST = import.meta.env.VITE_POCKETBASE_HOST;
export const pb_client = new Pocketbase(POCKETBASE_HOST, new LocalAuthStore());
pb_client.afterSend = (res,data) => {
    console.log(res);
    if (res.status == 401) {
        pb_client.authStore.clear();
    }
    return Promise.resolve(data);
}