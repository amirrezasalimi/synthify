import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import {
  deserializeYDoc,
  getProject,
  serializeYDoc,
  updateProjectData,
  type Project,
} from "./utils";
import * as Y from "yjs";
export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) {}
  async onConnect(conn: Party.Connection) {
    const params = new URLSearchParams(conn.uri.split("?")[1]);
    const projectId = this.party.id;
    const token = params.get("x-pb");
    if (!token) {
      conn.close();
      return;
    }
    let project: Project | null;
    try {
      project = await getProject(projectId, token);
    } catch (e) {
      conn.close();
      return;
    }


    return onConnect(conn, this.party, {
      async load() {
        if (project && project.data && project.data !== "") {
          return deserializeYDoc(project.data);
        }
        return new Y.Doc();
      },
      callback: {
        async handler(doc) {
          try {
            const project_data = serializeYDoc(doc);
            await updateProjectData(projectId, token, project_data);
          } catch (e) {}
        },
      },
    });
  }
}
