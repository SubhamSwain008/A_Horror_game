import { useState } from 'react'
import { Routes,Route,Link } from 'react-router-dom'
import Login from './login'
import HomeScreen from './HomeScreen'
import Signup from './signup'
import GameScreen from './gameScreen'
function App() {


  return (
    <>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<HomeScreen/>}/>
      <Route path='/' element={<Signup/>}/>
      <Route path='/game' element={<GameScreen/>}/>

      
    </Routes>
     
    </>
  )
}

export default App
