import { useState } from 'react'
import MainLayout from './layout/MainLayout'
import { Routes, Route } from "react-router-dom"
import LoginPage from './components/LoginPage'
import SignUp from './components/SignUp'
import UpdateDetails from './components/UpdateDetails'
import ChangePassword from './components/ChangePassword'
import SignUpVerification from './components/SignUpVerification'
import ForgotPassword from './components/ForgotPassword'
import ForgotPasswordVerification from './components/ForgotPasswordVerification'
import Changeonforgotpassword from './components/Changeonforgotpassword'
import FeedBack from './components/FeedBack'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}></Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/updatedetails' element={<UpdateDetails />} />
        <Route path='/changepassword' element={<ChangePassword />} />
        <Route path='/verify' element={<SignUpVerification />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/setnewpassword' element={<ForgotPasswordVerification />} />
        <Route path='/changeonforgotpassword' element={<Changeonforgotpassword />} />
        <Route path='/feedback' element={<FeedBack />} />

      </Routes>
    </>
  )
}

export default App
