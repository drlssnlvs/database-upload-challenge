import multer from "multer";
import { resolve } from "path";

import { v4 } from "uuid";

const tmpFolder = resolve(__dirname, "..", "..", "tmp");

export default {
    directory: tmpFolder,

    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(req, filename, cb) {
            const fileHash = v4();

            const newFilename = `${fileHash}-${filename.originalname}`;

            return cb(null, newFilename);
        },
    }),
};
