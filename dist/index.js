"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = new server_1.default;
if (process.env.USER) {
    process.env.DATABASE = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0-tp4og.mongodb.net/fotosgram?retryWrites=true&w=majority`;
    console.log(process.env.DATABASE);
}
mongoose_1.default.Promise = global.Promise;
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// File Upload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// CORS setup
server.app.use(cors_1.default({
    origin: true,
    credentials: true
}));
// App routes
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log('Error conectando la base de datos');
        throw err;
    }
    console.log("Base de datos online");
});
// Start express
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});
