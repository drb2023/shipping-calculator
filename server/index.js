const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.post("/api/rates", async (req, res) => {
  const { fromZip, toZip, weight, length, width, height } = req.body;
  console.log("Received values:", {
    fromZip,
    toZip,
    weight,
    length,
    width,
    height,
  });

  try {
    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_from: { zip: fromZip, country: "US" },
        address_to: { zip: toZip, country: "US" },
        parcels: [
          {
            length: parseFloat(length).toFixed(2),
            width: parseFloat(width).toFixed(2),
            height: parseFloat(height).toFixed(2),
            distance_unit: "in",
            weight: parseFloat(weight).toFixed(2),
            mass_unit: "lb",
          },
        ],
        async: false,
      }),
    });

    const data = await response.json();
    console.log("Shippo response:", JSON.stringify(data, null, 2));
    res.json(data.rates);
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
