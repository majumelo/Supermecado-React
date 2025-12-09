import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login/login'
import Promotion from './Promotion/promotion'
import Products from './Products/products'
import EditUsers from './EditUsers/editusers'  

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/promotion" element={<Promotion/>} />
        <Route path="/editusers" element={<EditUsers/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App