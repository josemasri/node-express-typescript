import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';

const server = new Server;

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
    `mongodb+srv://${process.env.user}:${process.env.password}@cluster0-tp4og.mongodb.net/test?retryWrites=true&w=majority`,
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

