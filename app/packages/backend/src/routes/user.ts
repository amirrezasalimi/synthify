import { z } from "zod";
import { publicProcedure, router } from "./config";
import { pb, pbInstance } from "../libs/pb";
import { TRPCError } from "@trpc/server";
import { configs } from "@/constants";
import { UsersRecord } from "@/types/pocketbase";
import { randomUUID } from "crypto";

export const userRouter = router({
  userExists: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(
      async ({
        input,
      }): Promise<
        | {
            has_password: boolean;
          }
        | boolean
      > => {
        try {
          const user = await pb
            .collection("users")
            .getFirstListItem(`email = "${input.email}"`);
          const authMethods = await pb
            .collection("users")
            .listExternalAuths(user.id);
          return {
            has_password: authMethods.length == 0,
          };
        } catch (e) {
          return false;
        }
      }
    ),
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await pb
          .collection("users")
          .getFirstListItem(`email = "${input.email}"`);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
          // optional: pass the original error to retain stack trace
          cause: new Error("User already exists"),
        });
      } catch (e) {}

      try {
        const res = await pb.collection("users").create({
          name: "",
          email: input.email,
          password: input.password,
          passwordConfirm: input.password,
        });
        await pb.collection("users").requestVerification(input.email);
        return res;
      } catch (e) {
        console.log(`error`, e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register user",
          cause: e,
        });
      }
    }),
  externalAuth: publicProcedure
    .input(
      z.object({
        external_user_id: z.string(),
        email: z.string(),
        secret_key: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: implement onBeforeAuth hoo, if you want allow internal auth, to keep external users secure, (externals should'nt be able to use regular auth methods)
      // load secret key
      let secrectKey: string | null = null;
      try {
        const res = await pb
          .collection("config")
          .getFirstListItem(`key = '${configs.EXTERNAL_AUTH_SECRET}'`);
        secrectKey = res.value;
      } catch (e) {
        throw "setup external auth secret key";
      }

      // check secret key
      if (input.secret_key !== secrectKey) {
        throw "invalid secret key";
      }

      // check user should'nt exists
      try {
        const user = await pb
          .collection("users")
          .getFirstListItem(`email = "${input.email}"`);
        throw "user already exists";
      } catch (e) {}

      // check user exists
      let userId: string | null = null;
      let passKey: string | null = null;

      try {
        const user = await pb
          .collection("external_users")
          .getFirstListItem(`external_user_id = "${input.external_user_id}"`);
        userId = user.user;
        passKey = user.pass_key;
      } catch (e) {}

      if (!userId) {
        try {
          passKey = randomUUID();

          // create user
          const user = await pb.collection("users").create({
            name: "",
            email: input.email,
            password: passKey,
            passwordConfirm: passKey,
            verified: true,
            external: true,
          } as UsersRecord);
          userId = user.id;
          const externalUser = await pb.collection("external_users").create({
            external_user_id: input.external_user_id,
            pass_key: passKey,
            user: userId,
          });
        } catch (e) {
          throw "failed to create user";
        }
      }
      if (!userId) {
        throw "no user found";
      }

      if (!passKey) {
        throw "user pass key not found";
      }
      try {
        const res = await pbInstance()
          .collection("users")
          .authWithPassword(input.email, passKey, {
            params: {
              external_auth_secret: input.secret_key,
            },
          });
        if (res.token) {
          return res.token;
        }
      } catch (e) {
        console.log(`error`, e);

        throw "failed to auth";
      }
    }),
});
