import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import {
  deserializeYDoc,
  docToJson,
  getProject,
  serializeYDoc,
  updateProjectData,
  type Project,
} from "./utils";
import * as Y from "yjs";
export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) { }
  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const params = new URLSearchParams(conn.uri.split("?")[1]);
    const projectId = this.party.id;
    const token = params.get("x-pb");

    const origin = process.env.BACKEND_HOST as string;

    const isLocalhost = origin.includes("localhost") || origin.includes("backend.synthify.co");
    let project: Project | null;

    if (!isLocalhost) {
      if (!token) {
        conn.close();
        return;
      }
      if (!origin) {
        console.log("Error: Missing BACKEND_HOST environment variable");
        return;
      }
      try {
        project = await getProject(origin, projectId, token);
      } catch (e) {
        console.log(`Error fetching project: `, e);

        conn.close();
        return;
      }
    }

    return onConnect(conn, this.party, {
      readOnly: isLocalhost ? false : project === null,
      persist: {
        mode: "snapshot",
      },
      async load() {
        if (project && project?.data && project?.data !== "") {
          return deserializeYDoc(project.data);
        }
        return new Y.Doc();
      },
      callback: {
        async handler(doc) {
          try {
            const project_data = serializeYDoc(doc);
            const project_json_data = docToJson(doc);
            await updateProjectData(
              origin,
              projectId,
              token,
              project_data,
              project_json_data
            );
          } catch (e) {
            console.log(`Error updating project: `, e);
          }
        },
      },
    });
  }
}
