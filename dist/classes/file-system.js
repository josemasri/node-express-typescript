"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveTempImage(file, userId) {
        return new Promise((resolve, reject) => {
            //Create folders
            const path = this.createUserFolder(userId);
            // Create filename
            const fileName = this.generateUniqueName(file.name);
            // Move the file from temp to our folder
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    // No se pudo mover
                    reject(err);
                }
                else {
                    // Todo salio bien
                    resolve();
                }
            });
        });
    }
    generateUniqueName(originalName) {
        // download.png
        const nombreArr = originalName.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagesFromTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPosts = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPosts)) {
            fs_1.default.mkdirSync(pathPosts);
        }
        const imagesTmp = this.getTempImages(userId);
        imagesTmp.forEach(image => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathPosts}/${image}`);
        });
        return imagesTmp;
    }
    getTempImages(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getImageUrl(userId, img) {
        // Path posts image
        const pathImage = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        if (!fs_1.default.existsSync(pathImage)) {
            return path_1.default.resolve(__dirname, '../assets/400xu.jpg');
        }
        return pathImage;
    }
}
exports.default = FileSystem;
