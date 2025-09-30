import { useState } from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import Login from './login'
import HomeScreen from './HomeScreen'
import Signup from './signup'
function App() {


  return (
    <>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<HomeScreen/>}/>
      <Route path='/' element={<Signup/>}/>

      
    </Routes>
     
    </>
  )
}

export default App
