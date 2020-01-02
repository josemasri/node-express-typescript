import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';

const server = new Server;
process.env.DATABASE = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0-tp4og.mongodb.net/fotosgram?retryWrites=true&w=majority`;
console.log(process.env.DATABASE);


// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


// File Upload
server.app.use(fileUpload({ useTempFiles: true }));

// CORS setup
server.app.use(cors({
    origin: true,
    credentials: true
}));
// App routes
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);


// Conectar DB
mongoose.connect(
    process.env.DATABASE || 'mongodb://localhost:27017/fotosgram',
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

