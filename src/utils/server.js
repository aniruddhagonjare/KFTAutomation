import express from "express";
import { processIsins, resetAngelOne } from "./exposeAPI.js";
const app = express();
app.use(express.json());

const PORT = 3001;

app.post('/process', async (req, res) => {
    const {
        partyCode,
        model = "success",
        EligibleISINCount = 5,
        InEligibleISINCount = 0,
        statusCode = "success",
        quantity = 0,
        price = 20.888,
        isins
    } = req.body;

    if (!partyCode && !isins) {
        return res.status(400).json({ error: "partyCode or isins list is required" });
    }

    try {
        const result = await processIsins(
            partyCode,
            model,
            EligibleISINCount,
            InEligibleISINCount,
            statusCode,
            quantity,
            price,
            isins
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.all('/angel-one/reset', async (req, res) => {
    const client_id = req.query.client_id || req.body.client_id;
    const soft_reset = req.query.soft_reset !== undefined ? req.query.soft_reset : req.body.soft_reset;
    const apiKey = req.headers['x-api-key'];
    const aoOverride = req.headers['aooverride'];

    if (!client_id) {
        return res.status(400).json({ error: "client_id is required" });
    }
    if (!apiKey) {
        return res.status(400).json({ error: "x-api-key header is required" });
    }

    try {
        const result = await resetAngelOne(client_id, soft_reset, apiKey, aoOverride);
        if (result.success) {
            return res.json({
                success: true,
                data: {},
                message: result.message
            });
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
