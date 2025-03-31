require("dotenv").config();

import { io } from "socket.io-client";

const socket = io(process.env.URL_DEVELOPMENT);

export default socket;
