import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary";

interface CustomParams{
  folder: string,
  allowed_formats: string[]
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "renergy_products",
    allowed_formats: ["jpg", "jpeg", "png"]
  } as CustomParams

});

const upload = multer({storage});
export default upload;