import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  // Check if there are actually any items in the cart
  const cartNotEmpty = Object.values(cartItems).some((qty) => qty > 0);

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {cartNotEmpty ? (
        all_product.map((product) => {
          const quantity = cartItems[product.id] || 0;
          if (quantity > 0) {
            return (
              <div key={product.id}>
                <div className="cartitems-format cartitems-format-main">
                  <img src={product.image} alt="" className='carticon-product-icon' />
                  <p>{product.name}</p>
                  <p>${product.new_price}</p>
                  <button className="cartitems-quantity">{quantity}</button>
                  <p>${product.new_price * quantity}</p>
                  <img
                    className='cartitems-remove-icon'
                    src={remove_icon}
                    onClick={() => removeFromCart(product.id)}
                    alt="remove"
                  />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Your cart is empty.</h2>
        </div>
      )}

      {cartNotEmpty && (
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
              </div>
            </div>
            <button>PROCEED TO CHECKOUT</button>
          </div>
          <div className="cartitems-promocode">
            <p>If you have promo code, enter it here</p>
            <div className="cartitems-promobox">
              <input type="text" placeholder='Promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
