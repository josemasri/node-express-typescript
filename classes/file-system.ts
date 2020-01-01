import { FileUpload } from './../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqueid from 'uniqid';


export default class FileSystem {
    constructor() { }

    saveTempImage(file: FileUpload, userId: string) {
        return new Promise((resolve, reject) => {
            //Create folders
            const path = this.createUserFolder(userId);
            // Create filename
            const fileName = this.generateUniqueName(file.name);
            // Move the file from temp to our folder
            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err) {
                    // No se pudo mover
                    reject(err);
                } else {
                    // Todo salio bien
                    resolve();
                }

            });
        });

    }

    private generateUniqueName(originalName: string) {
        // download.png
        const nombreArr = originalName.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqueid();
        return `${idUnico}.${extension}`;
    }

    private createUserFolder(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';

        const exist = fs.existsSync(pathUser);
        if (!exist) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    public imagesFromTempToPost(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPosts = path.resolve(__dirname, '../uploads', userId, 'posts');

        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathPosts)) {
            fs.mkdirSync(pathPosts);
        }

        const imagesTmp = this.getTempImages(userId);

        imagesTmp.forEach(image => {
            fs.renameSync(`${pathTemp}/${image}`, `${pathPosts}/${image}`)
        });
        return imagesTmp;
    }

    private getTempImages(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }

    public getImageUrl(userId: string, img: string): string {
        // Path posts image
        const pathImage = path.resolve(__dirname, '../uploads', userId, 'posts', img);
        
        if(!fs.existsSync(pathImage)) {
            return path.resolve(__dirname, '../assets/400xu.jpg');
        }
        return pathImage;
    }

}