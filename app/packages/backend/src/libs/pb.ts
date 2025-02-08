import { TypedPocketBase } from "../types/pocketbase";
import Pocketbase from "pocketbase";

import { env } from "process";

const pbInstance = (token?: string) => {
  const _ = new Pocketbase(env.POCKETBASE_HOST) as TypedPocketBase;
  _.autoCancellation(false);
  if (token) {
    _.beforeSend = (url, options) => {
      // console.log(
      //   url,
      //   options,
      //   token,
      //   env.POCKETBASE_HOST,
      // );

      options.headers = {
        Authorization: token,
        ...options.headers,
      };
      return {
        url,
        options,
      };
    };
  }
  return _;
};

const admin_token = env.POCKETBASE_ADMIN_TOKEN ?? "";

const pb = pbInstance(admin_token);

export { pbInstance, pb };
