import path from "path";
import multer from "multer";
import { v4 } from "uuid";

const getTargetAdress = (address: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/${address}`);
    },
    filename: (req, file, cb) => {
      const extention = path.parse(file.originalname).ext;
      const file_name = v4() + extention;
      cb(null, file_name);
    },
  });
};

const uploader = (address: string) => {
  const storage = getTargetAdress(address);
  return multer({ storage: storage });
};

export default uploader;
