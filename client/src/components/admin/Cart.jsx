import React, { useEffect, useState } from "react";

function Cart({ studentId, cart, onIncrease, onDecrease, onRemoveFromCart, onClearCart, }) {
  const [balance, setBalance] = useState(0);
  const [fetchingBalance, setFetchingBalance] = useState(false);

  // Fetch student balance when studentId changes
  const fetchBalance = async () => {
    console.log("1");
    if (!studentId) {
      setBalance(0);
      return;
    }
    try {
      setFetchingBalance(true);
    
      const res = await fetch(`http://localhost:5000/api/inventory/student/${studentId}/balance`);
     
      const data = await res.json();
    
      setBalance(Number(data.balance || 0));
    } catch (err) {
      console.error("Error fetching balance:", err);
      setBalance(0);
    } finally {
      setFetchingBalance(false);
    }
  };

useEffect(() => {
  console.log("Fetching balance for studentId:", studentId);
  fetchBalance();
}, [studentId]);


  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const remaining = balance - total;

  // Confirm purchase: update balance on server and clear cart locally
  const confirmPurchase = async () => {
    if (!studentId) {
      alert("Please select a student before confirming purchase.");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    if (total > balance) {
      alert("Insufficient amount in the student's account.");
      return;
    }

    try {
      // PUT new balance to backend (inventory router mount: /api/inventory)
      const newBalance = Number((balance - total).toFixed(2));
      const res = await fetch(`http://localhost:5000/api/inventory/student/${studentId}/balance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBalance }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to update balance:", err);
        alert("Failed to complete purchase on server.");
        return;
      }

      // Clear local cart
      onClearCart?.();

      // Refresh balance from server (just to be safe)
      await fetchBalance();

      alert("Purchase successful!");
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Something went wrong during purchase.");
    }
  };

  return (
    <div className="card">
      <h3>Cart</h3>

      <p>
        Current Balance: {fetchingBalance ? "Loading..." : `₹${balance.toFixed(2)}`}
      </p>

      <p>
        Cart Total: <strong>₹{total.toFixed(2)}</strong>
      </p>

      <p>
        Remaining After Purchase:&nbsp;
        <strong style={{ color: remaining < 0 ? "crimson" : "inherit" }}>
          {remaining < 0 ? `-₹${Math.abs(remaining).toFixed(2)} (Insufficient)` : `₹${remaining.toFixed(2)}`}
        </strong>
      </p>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                <div style={{ fontSize: 13, color: "#555" }}>{item.category}</div>
                <div style={{ fontSize: 13 }}>Price: ₹{Number(item.price).toFixed(2)}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => onDecrease?.(item.id)}
                  aria-label={`Decrease ${item.product_name}`}
                  style={{ width: 30, height: 30 }}
                >
                  −
                </button>

                <div style={{ minWidth: 28, textAlign: "center" }}>{item.quantity}</div>

                <button
                  onClick={() => onIncrease?.(item.id)}
                  aria-label={`Increase ${item.product_name}`}
                  style={{ width: 30, height: 30 }}
                >
                  +
                </button>

                <div style={{ minWidth: 90, textAlign: "right", marginLeft: 12 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => onRemoveFromCart?.(item.id)}
                  style={{ marginLeft: 12 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <strong>Total: ₹{total.toFixed(2)}</strong>
            <div>
              <button onClick={confirmPurchase} style={{ marginRight: 8 }}>
                Confirm Purchase
              </button>
              <button onClick={() => onClearCart?.()}>
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
