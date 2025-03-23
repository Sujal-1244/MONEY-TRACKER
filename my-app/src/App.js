import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions
  useEffect(() => {
    getTransactions();
  }, []);

  async function getTransactions() {
    try {
      const url = 'http://localhost:4000/api/transactions';  // ✅ Fixed API Endpoint
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const json = await response.json();
      console.log("Fetched Transactions:", json);
      setTransactions(Array.isArray(json) ? json : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = 'http://localhost:4000/api/transaction';

    // Extract price
    const splitName = name.trim().split(' ');
    const price = parseFloat(splitName[0]);
    const transactionName = splitName.slice(1).join(' ');

    if (isNaN(price)) {
      alert("Invalid price format! Ensure the input starts with a number.");
      return;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, name: transactionName, description, datetime })
    })
      .then(response => response.json())
      .then(json => {
        setName('');
        setDescription('');
        setDatetime('');
        console.log("Transaction Added:", json);

        // ✅ Force Refresh Transactions
        getTransactions();
      })
      .catch(error => console.error('Error:', error));
  }

  // ✅ Fix Balance Calculation
  const balance = transactions.reduce((acc, transaction) => {
    const price = parseFloat(transaction.price) || 0;
    return acc + price;
  }, 0).toFixed(2);

  const [whole, fraction] = balance.split('.');

  return (
    <main>
      <h1>{whole}Rs<span>.{fraction}</span></h1>

      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="+ 22000 New Samsung phone" />
          <input type="datetime-local" value={datetime} onChange={ev => setDatetime(ev.target.value)} />
        </div>
        <div className="description">
          <input type="text" value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Description" />
        </div>
        <button type="submit">Add New Transaction</button>
      </form>

      {/* ✅ Fixed Transaction Layout */}
      <div className="transactions">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price ? `${transaction.price} Rs` : "No Price"}
              </div>
              <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
