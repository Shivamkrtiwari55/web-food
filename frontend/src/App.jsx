import React from 'react';
import Navbar from './Components/Navbar';
import { Route, Routes } from 'react-router-dom';
import  Home from './pages/home/home';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './Components/Footer/Footer'
import LoginPopup from './Components/LoginPopup/LoginPopup';
 import {useState} from 'react'
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';

const App = () => {


  const [showLogin,setShowLogin]=useState(false)
  return (

    <>
    {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

    <div className='app'>
      <Navbar  setShowLogin={setShowLogin} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order' element={<PlaceOrder/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/myorders'element={<MyOrders/>}/>
      </Routes>
    </div>
    <Footer />
    </>
  )
}

export default App;
