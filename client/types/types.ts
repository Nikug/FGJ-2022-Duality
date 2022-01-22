import type { Socket } from "socket.io-client";

export namespace Game {
  export interface PlayerState {
    x?: number;
    y?: number;
    socket?: Socket;
    lastUpdate?: number;
  }
}
