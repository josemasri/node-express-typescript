"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const server = new server_1.default;
// App routes
server.app.use('/user', usuario_1.default);
// Start express
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});
