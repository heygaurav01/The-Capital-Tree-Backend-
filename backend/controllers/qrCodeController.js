const QRCode = require('qrcode');

exports.generateQRCode = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ message: "Amount is required." });
        }

        const qrCodeData = `upi://pay?pa=your_upi_id@upi&pn=Your Name&am=${amount}&cu=INR`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        res.status(200).json({ qrCodeImage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};