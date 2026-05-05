export default async ({ req, res, log, error }) => {
  const { fromZip, toZip, weight, length, width, height } = req.body;

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
    log(`Fetched ${data.rates?.length ?? 0} rates`);
    return res.json(data.rates);
  } catch (err) {
    error(err.message);
    return res.json({ error: err.message }, 500);
  }
};
