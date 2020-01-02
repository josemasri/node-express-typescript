"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../middlewares/auth");
const usuario_model_1 = require("./../models/usuario.model");
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const userRoutes = express_1.Router();
// Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctas'
            });
        }
        if (userDB.comparePassword(body.password)) {
            userDB.password = "";
            const token = token_1.default.getJWTToken(userDB);
            return res.status(200).json({
                ok: true,
                token
            });
        }
        res.status(401).json({
            ok: false,
            mensaje: 'Usuario/contraseña no son correctas'
        });
    });
});
// Create user
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user)
        .then(userDB => {
        userDB.password = "";
        const token = token_1.default.getJWTToken(userDB);
        res.status(201).json({
            ok: true,
            token
        });
    })
        .catch(err => {
        res.status(401).json({
            ok: false,
            err
        });
    });
});
userRoutes.put('/update', [auth_1.verificaToken], (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        userDB.password = "";
        const token = token_1.default.getJWTToken(userDB);
        res.status(201).json({
            ok: true,
            token
        });
    });
});
userRoutes.get('/', [auth_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.status(200).json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
