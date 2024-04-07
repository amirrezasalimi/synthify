import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";


export default class YjsServer implements Party.Server {
  constructor(public party: Party.Room) {}
  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.party, {
      // ...options
    });
  }
}