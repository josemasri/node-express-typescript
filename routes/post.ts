import { FileUpload } from './../interfaces/file-upload';
import { Post } from './../models/post.model';
import { verificaToken } from './../middlewares/auth';
import { Router, Request, Response } from 'express';
import FileSystem from '../classes/file-system';



const postRoutes = Router();
const fileSystem = new FileSystem;

// Get Posts paginated
postRoutes.get('/', async (req: any, res: Response) => {
    const pagina = Number(req.query.pagina) || 1;
    const skip = (pagina - 1) * 10;

    const posts = await Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    })
});


// Create post
postRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;

    body.usuario = req.usuario._id;

    const images = fileSystem.imagesFromTempToPost(req.usuario._id);
    console.log(images);
    body.imgs = images;


    Post.create(body).then(async postDB => {
        await postDB.populate('usuario', '-password')
            .execPopulate();
        res.status(200).json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.status(401).json({
            ok: false,
            err
        });
    });
});



// Service Upload files
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se subio ningun archivo'
        });
    }
    const file: FileUpload = req.files.image;
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

    await fileSystem.saveTempImage(file, req.usuario._id);

    res.status(200).json({
        ok: true,
        file: file.mimetype
    });
});

// 
postRoutes.get('/imagen/:userId/:img', (req: any, res: Response) => {
    const userId = req.params.userId;
    const img = req.params.img;

    //
    const pathImage = fileSystem.getImageUrl(userId, img);

    res.sendFile(pathImage);
});

export default postRoutes;