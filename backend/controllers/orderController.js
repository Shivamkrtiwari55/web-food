import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'

import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";
  try {
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount / 100, // Convert back to rupees for storage
      address: req.body.address,
    });

    await newOrder.save();

    // Create line items for Stripe with correct amount in paise
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price, // Already in paise from frontend
      },
      quantity: item.quantity,
    }));

    // Add delivery fee (₹2 = 200 paise)
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery charges",
        },
        unit_amount: 200, // ₹2 in paise
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error creating order" 
    });
  }
};

 const verifyOrder =async (req,res) => {
   const {orderId,success} = req.body;
   try {
    if (success=="true") {
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true,message:"paid"})
    }else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"not paid"})
    }
   } catch (error) {
    console.log(error);
        res.json({ success: false, message: "Error" });
   }

 }
 // user orders for frontend 
const userOrders = async (req, res) => {
  try {
    // Use req.userId instead of req.body.userId
    const orders = await orderModel.find({ userId: req.userId })
      .sort({ date: -1 }); // Sort by newest first
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching orders" 
    });
  }
};

// listing orders for admin panel
const listOrders = async (req,res) =>{
   try {
    const orders = await orderModel.find({});
    res.json ({success:true,data:orders})
   } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
     
   }
}

// api for updating order status
 const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}


export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus }


