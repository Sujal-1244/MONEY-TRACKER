const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/transaction");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Once
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// ✅ Unified GET route to fetch all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ datetime: -1 }); // Sort by latest
    res.json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST route to add a transaction
app.post("/api/transaction", async (req, res) => {
  try {
    let { name, description, datetime, price } = req.body;
    
    // Ensure price is a number
    price = parseFloat(price);
    if (isNaN(price)) {
      return res.status(400).json({ error: "Invalid price format!" });
    }

    const transaction = new Transaction({ name, description, datetime, price });
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    console.error("❌ Error saving transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
