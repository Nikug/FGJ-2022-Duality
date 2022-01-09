import { io } from 'socket.io-client';

const backendUrl = 'http://localhost:3000';

const socket = io(backendUrl);
