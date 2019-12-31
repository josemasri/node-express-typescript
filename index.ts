import Server from "./classes/server";
import userRoutes from "./routes/usuario";


const server = new Server;

// App routes
server.app.use('/user', userRoutes);

// Start express

server.start(() => {
    console.log(`Server running on port ${server.port}`);
});

