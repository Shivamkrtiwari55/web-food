import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext, } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    state: '',
    zipcode: '',
    country: '',
    city: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (getTotalCartAmount() === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const orderItems = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({
          name: item.name,
          price: Math.round(item.price * 100), // Convert to smallest currency unit (paise)
          quantity: cartItems[item._id],
        }));

         const orderData = {
        address: data,
        items: orderItems,
        amount: Math.round((getTotalCartAmount() + 2) * 100), // Convert to paise
      };

      // Only send Authorization header if token is valid
      const config = {};
      if (token && token !== "setContext") {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        config
      );
       if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order Error:', error.response?.data || error);
      alert(error.response?.data?.message || 'An error occurred while placing the order.');
    }
  };

  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;
  const totalAmount = getTotalCartAmount() + deliveryFee;
 
const navigate = useNavigate()
  useEffect(() => {
  if (!token || getTotalCartAmount() === 0) {
    navigate('/cart');
  }
}, [token, getTotalCartAmount, navigate]); 

  return (
    <form onSubmit={handlePlaceOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p> Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{totalAmount}</b>
          </div>
          <button type="submit" disabled={getTotalCartAmount() === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;