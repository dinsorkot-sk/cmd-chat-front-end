require("dotenv").config();

import { io } from "socket.io-client";

const socket = io(process.env.DB_POR);

export default socket;
