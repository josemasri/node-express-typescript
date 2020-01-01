import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';

const server = new Server;

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


// File Upload
server.app.use(fileUpload({ useTempFiles: true }));

// App routes
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);


// Conectar DB
mongoose.connect(
    'mongodb://localhost:27017/fotosgram',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) {
            throw err;
        }
        console.log("Base de datos online");
    });

// Start express

server.start(() => {
    console.log(`Server running on port ${server.port}`);
});

