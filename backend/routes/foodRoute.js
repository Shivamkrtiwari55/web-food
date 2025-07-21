import express from 'express';
import { addFood, listFood,removeFood } from '../controllers/foodController.js';

import multer from 'multer';

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads", // Ensure this folder exists
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);


export default foodRouter;