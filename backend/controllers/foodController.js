import foodModel from '../models/foodModel.js'; // Import the foodModel
import fs from 'fs'; // Import the file system module

const addFood = async (req, res) => {
    console.log("Request Body:", req.body); // Debug the request body
    console.log("Uploaded File:", req.file); // Debug the uploaded file

    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    let image_filename = req.file ? req.file.filename : null;

    const food = new foodModel({
        name,
        description,
        price,
        category,
        image: image_filename,
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error saving food" });
    }
};
//all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })

    }
}
//  remove food item

const removeFood = async(req,res) =>{
     try {
        const food =await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
}

export { addFood,listFood ,removeFood};