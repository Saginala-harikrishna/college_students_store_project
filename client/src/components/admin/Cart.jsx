import React, { useEffect, useState } from "react";

function Cart({ studentId, cart, onIncrease, onDecrease, onRemoveFromCart, onClearCart }) {
  const [balance, setBalance] = useState(0);
  const [fetchingBalance, setFetchingBalance] = useState(false);

  // Fetch student balance when studentId changes
  const fetchBalance = async () => {
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
    fetchBalance();
  }, [studentId]);

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const remaining = balance - total;

  // Confirm purchase: update balance and save transaction
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
      // 1) Update student balance
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

      // 2) Prepare transaction data
const transactionData = {
  studentId,
  items: cart.map(item => ({
    productId: item.id,
    productName: item.product_name || item.name,  // fallback to 'name'
    category: item.category,
    quantity: item.quantity,
    price: item.price,
  })),
  totalAmount: total,
  balanceBefore: balance,
  balanceAfter: newBalance,
  transactionDate: new Date().toISOString(),
};


console.log("Cart items before confirming purchase:", cart);
const invalidItems = cart.filter(item => !item.name);
if (invalidItems.length > 0) {
  console.warn("Items missing product_name:", invalidItems);
  alert("Some items have missing product names!");
  return;
}



      // 3) Save transaction to backend
      const transactionRes = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!transactionRes.ok) {
        const error = await transactionRes.json();
        console.error("Failed to save transaction:", error);
        alert("Purchase succeeded but failed to save transaction history.");
        return;
      }

      // 4) Clear local cart and refresh balance
      onClearCart?.();
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
          {remaining < 0
            ? `-₹${Math.abs(remaining).toFixed(2)} (Insufficient)`
            : `₹${remaining.toFixed(2)}`}
        </strong>
      </p>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
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

                <button onClick={() => onRemoveFromCart?.(item.id)} style={{ marginLeft: 12 }}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <strong>Total: ₹{total.toFixed(2)}</strong>
            <div>
              <button onClick={confirmPurchase} style={{ marginRight: 8 }}>
                Confirm Purchase
              </button>
              <button onClick={() => onClearCart?.()}>Clear Cart</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
