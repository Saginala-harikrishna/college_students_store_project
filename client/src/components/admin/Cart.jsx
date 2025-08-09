import React from "react";

function Cart({ cart, onRemoveFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="card">
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name} x {item.quantity} - ₹{item.price * item.quantity}</span>
              <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <hr />
          <strong>Total: ₹{total}</strong>
        </>
      )}
    </div>
  );
}

export default Cart;
