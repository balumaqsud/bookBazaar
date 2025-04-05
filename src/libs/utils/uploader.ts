import path from "path";
import multer from "multer";
import { v4 } from "uuid";

const getTargetAddress = (address: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/${address}`);
    },
    filename: (req, file, cb) => {
      console.log(file);
      const extension = path.parse(file.originalname).ext;
      const file_name = v4() + extension;
      cb(null, file_name);
    },
  });
};

const uploader = (address: string) => {
  const storage = getTargetAddress(address);
  return multer({ storage: storage });
};

export default uploader;
