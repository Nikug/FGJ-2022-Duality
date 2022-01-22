## Finnish Game Jam Browser Multiplayer Demo

There are two projects: frontend (client) and backend (server)

### Running locally

- Run `npm i` in both folders
- Run both projects simultaneously with `npm run start` in both folders
- Client should open a new page at `localhost:8080`
- Open another browser tab/window to add another player
- _It is gamer time_

### Important configs

- Server can use `.env` file in server root. Variables:

  - `PORT`: The port used by the server, defaults to 3000 if not set

- Client configs are in the `snowpack.config.mjs` file.
  - `SERVER_URL`: Controls where the socket tries to connect. If server is on another machine, set it to the other machine's (local) ip address and the correct port
