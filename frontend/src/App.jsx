import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { Route, Switch } from 'wouter';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {  
  return (
    <div>
       <Navbar/>
      <Switch>
      <Route path="/" component={Shop}></Route>
      <Route path="/mens"> {<ShopCategory banner ={men_banner} category="men"/>}</Route>
      <Route path="/womens"> {<ShopCategory banner={women_banner} category="women"/>}</Route>
      <Route path="/kids"> {<ShopCategory banner ={kid_banner} category="kid"/>}</Route>
      <Route path="/product" nest>
        <Route path="/:productId" component={Product}/>
      </Route>
      <Route path="/cart"> {<Cart/>} </Route>
      <Route path="/login"> {<LoginSignup/>}</Route>
      </Switch>
      <Footer/>
       <ToastContainer position="top-center" />
    </div>
  )
}

export default App
