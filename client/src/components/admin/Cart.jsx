import React, { useEffect, useState } from "react";

function Cart({ studentId, cart, onIncrease, onDecrease, onRemoveFromCart, onClearCart, studentEmail }) {
  const [balance, setBalance] = useState(0);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [modal, setModal] = useState({ visible: false, message: "", type: "" });

  const fetchBalance = async () => {
    if (!studentId) {
      setBalance(0);
      return;
    }
    try {
      setFetchingBalance(true);
      const res = await fetch(`/api/inventory/student/${studentId}/balance`);
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

  const showModal = (message, type = "info") => {
    setModal({ visible: true, message, type });
    if (!purchasing) {
      setTimeout(() => setModal({ visible: false, message: "", type: "" }), 3000);
    }
  };

  const confirmPurchase = async () => {
    if (!studentId) {
      showModal("Please select a student before confirming purchase.", "warning");
      return;
    }
    if (cart.length === 0) {
      showModal("Cart is empty.", "info");
      return;
    }
    if (total > balance) {
      showModal("Insufficient amount in the student's account.", "error");
      return;
    }

    if (purchasing) return;
    setPurchasing(true);
    showModal("Processing purchase...", "info");

    onClearCart?.();

    try {
      const newBalance = Number((balance - total).toFixed(2));
      const res = await fetch(`/api/inventory/student/${studentId}/balance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBalance }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to update balance:", err);
        showModal("Failed to complete purchase on server.", "error");
        return;
      }

      const transactionData = {
        studentId,
        studentEmail,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.product_name || item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        balanceBefore: balance,
        balanceAfter: newBalance,
        transactionDate: new Date().toISOString(),
      };

      const transactionRes = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!transactionRes.ok) {
        const error = await transactionRes.json();
        console.error("Failed to save transaction:", error);
        showModal("Purchase saved but transaction history failed.", "warning");
        return;
      }

      await fetchBalance();
      showModal("Purchase successful!", "success");
    } catch (err) {
      console.error("Purchase error:", err);
      showModal("Something went wrong during purchase.", "error");
    } finally {
      setPurchasing(false);
      setTimeout(() => setModal({ visible: false, message: "", type: "" }), 3000);
    }
  };

  return (
    <div className="card" style={{ position: "relative" }}>
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
            <div key={item.id} className="cart-item"
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
                <button onClick={() => onDecrease?.(item.id)} style={{ width: 30, height: 30 }}>
                  −
                </button>
                <div style={{ minWidth: 28, textAlign: "center" }}>{item.quantity}</div>
                <button onClick={() => onIncrease?.(item.id)} style={{ width: 30, height: 30 }}>
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

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}>
            <strong>Total: ₹{total.toFixed(2)}</strong>
            <div>
              <button onClick={confirmPurchase} disabled={purchasing} style={{ marginRight: 8 }}>
                {purchasing ? "Processing..." : "Confirm Purchase"}
              </button>
              <button onClick={() => onClearCart?.()}>Clear Cart</button>
            </div>
          </div>
        </>
      )}

      {/* Inline modal */}
      {modal.visible && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 250,
              textAlign: "center",
              color:
                modal.type === "error" ? "crimson" :
                modal.type === "success" ? "green" :
                modal.type === "warning" ? "orange" : "black",
              fontWeight: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {purchasing && (
              <div style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                width: 24,
                height: 24,
                animation: "spin 1s linear infinite"
              }} />
            )}
            {modal.message}
          </div>

          {/* Spinner CSS */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Cart;
