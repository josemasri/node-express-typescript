import { verificaToken } from './../middlewares/auth';
import { Usuario } from './../models/usuario.model';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctas'
            });
        }
        if (userDB.comparePassword(body.password)) {
            userDB.password = "";
            const token = Token.getJWTToken(userDB);
            return res.status(200).json({
                ok: true,
                token
            });
        }
        res.status(401).json({
            ok: false,
            mensaje: 'Usuario/contraseña no son correctas'
        });
        
    })
    
});


// Create user
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    Usuario.create(user)
    .then( userDB => {
        userDB.password = "";
        const token = Token.getJWTToken(userDB);
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


userRoutes.put('/update', [verificaToken], (req: any, res: Response) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate( req.usuario._id, user, { new: true }, (err, userDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        userDB.password = "";
        const token = Token.getJWTToken(userDB);
        res.status(201).json({
            ok: true,
            token
        });
    });
});

userRoutes.get('/', [verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;

    res.status(200).json({
        ok: true,
        usuario
    })
});


export default userRoutes;