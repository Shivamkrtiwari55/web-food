import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Add expiration time
};

// Login user
const loginUser = async (req, res) => {
const {email,password} = req.body;
 try {
    const user =await userModel.findOne({email});
     
    if(!user){
        return res.json({success:false,message:"User Doesnot exist"})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.json({success:false,message:"Invalid credentials"})
    }
      const token = createToken(user._id);
       res.json({success:true,token})


 } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
 }

};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
        }

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        // Generate a token
        const token = createToken(user._id);

        // Respond with success
        res.status(201).json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { loginUser, registerUser };