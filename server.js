const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Appointment Endpoint
app.post('/api/book-appointment', async (req, res) => {
    const { name, phone, date, condition, message } = req.body;

    // 1. Basic Validation
    if (!name || !phone || !date || !condition) {
        return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    // 2. Format the message for WhatsApp
    const whatsappMessage = `*New Appointment Request*

*Name:* ${name}
*Phone:* ${phone}
*Requested Date/Time:* ${date}
*Condition:* ${condition}
*Details:* ${message || 'No additional details provided.'}`;

    try {
        // Meta WhatsApp Business API Call
        // Note: Requires valid tokens in .env to function in production
        const whatsappResponse = await axios.post(
            `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: process.env.RECIPIENT_NUMBER || "923314341212",
                type: "text",
                text: { 
                    preview_url: false,
                    body: whatsappMessage 
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('WhatsApp API Success:', whatsappResponse.data);
        res.status(200).json({ success: true, message: 'Appointment sent successfully!' });

    } catch (error) {
        console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
        
        // Return a meaningful error to the frontend
        const errorData = error.response ? error.response.data : {};
        res.status(500).json({ 
            error: 'WhatsApp delivery failed. Potential issue with API Tokens.',
            details: errorData 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Clinic Backend running on http://localhost:${PORT}`);
    console.log(`WhatsApp Recipient Set to: ${process.env.RECIPIENT_NUMBER || "923314341212"}`);
});
