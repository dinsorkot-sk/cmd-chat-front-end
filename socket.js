require("dotenv").config();

import { io } from "socket.io-client";

console.log("ENV Value:", process.env.NEXT_PUBLIC_URL_DEVELOPMENT);
const socket = io(process.env.NEXT_PUBLIC_URL_DEVELOPMENT);

export default socket;
