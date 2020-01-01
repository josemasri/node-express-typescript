import { Usuario } from './../models/usuario.model';
import { Request, Response, NextFunction } from "express";
import Token from "../classes/token";

export const verificaToken = (req: any, res: Response, next: NextFunction) => {
    const userToken = req.get('x-token') || '';
    Token.comprobarToken(userToken).then((decoded: any) => {
        req.usuario = decoded.usuario;
        next();
    })
    .catch(err => {
        res.status(404).json({
            ok: false,
            mensaje: 'Token no valido',
            err
        });
    });
};