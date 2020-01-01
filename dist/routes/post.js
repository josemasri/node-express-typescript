"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = require("./../models/post.model");
const auth_1 = require("./../middlewares/auth");
const express_1 = require("express");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default;
// Get Posts paginated
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pagina = Number(req.query.pagina) || 1;
    const skip = (pagina - 1) * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
// Create post
postRoutes.post('/', [auth_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const images = fileSystem.imagesFromTempToPost(req.usuario._id);
    console.log(images);
    body.imgs = images;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password')
            .execPopulate();
        res.status(200).json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.status(401).json({
            ok: false,
            err
        });
    });
});
// Service Upload files
postRoutes.post('/upload', [auth_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            message: 'No se subio ningun archivo con el nombre image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            message: 'Solo puede subir imagenes'
        });
    }
    yield fileSystem.saveTempImage(file, req.usuario._id);
    res.status(200).json({
        ok: true,
        file: file.mimetype
    });
}));
// 
postRoutes.get('/imagen/:userId/:img', (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    //
    const pathImage = fileSystem.getImageUrl(userId, img);
    res.sendFile(pathImage);
});
exports.default = postRoutes;
