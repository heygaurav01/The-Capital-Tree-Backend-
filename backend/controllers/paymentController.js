const axios = require('axios');
const crypto = require('crypto');
const { Transaction, User, Plan } = require('../models');

class PaymentController {
    // Initiate payment
    static async initiatePayment(req, res) {
        try {
            const { planId, useDefaultLink = false } = req.body;
            const userId = req.user.id;

            // Validation
            if (!planId) {
                return res.status(400).json({
                    success: false,
                    code: "MISSING_PLAN_ID",
                    message: "Plan ID is required"
                });
            }

            // Get user and plan
            const [user, plan] = await Promise.all([
                User.findByPk(userId),
                Plan.findByPk(planId)
            ]);
            
            if (!user || !plan) {
                return res.status(404).json({
                    success: false,
                    code: "NOT_FOUND",
                    message: "User or Plan not found"
                });
            }

            // Create transaction
            const transaction = await Transaction.create({
                userId,
                planId,
                amount: plan.price,
                status: 'pending',
                initiatedBy: userId
            });

            // Use default link if requested
            if (useDefaultLink) {
                return res.json({
                    success: true,
                    payment_url: process.env.DEFAULT_PAYMENT_LINK,
                    transaction_id: transaction.id
                });
            }

            // Prepare Instamojo payload
            const payload = {
                purpose: `${plan.name} Subscription`,
                amount: plan.price,
                buyer_name: user.name,
                email: user.email,
                phone: user.phone || '9999999999',
                redirect_url: `${process.env.BACKEND_URL}/api/payments/callback`,
                webhook_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
                allow_repeated_payments: false,
                transaction_id: transaction.id.toString()
            };

            // Call Instamojo API
            const response = await axios.post(
                `${process.env.INSTAMOJO_BASE_URL}/payment-requests/`,
                payload,
                {
                    headers: {
                        'X-Api-Key': process.env.INSTAMOJO_API_KEY,
                        'X-Auth-Token': process.env.INSTAMOJO_AUTH_TOKEN,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update transaction
            await transaction.update({
                paymentRequestId: response.data.id,
                paymentUrl: response.data.longurl,
                paymentData: JSON.stringify(response.data)
            });

            res.json({
                success: true,
                payment_url: response.data.longurl,
                transaction_id: transaction.id,
                instamojo_request_id: response.data.id
            });

        } catch (error) {
            console.error('Payment initiation error:', error);
            res.status(500).json({
                success: false,
                code: "PAYMENT_INIT_FAILED",
                message: "Payment initiation failed",
                error: error.response?.data || error.message
            });
        }
    }

    // Webhook handler
    static async handleWebhook(req, res) {
        try {
            const signature = req.get('X-Signature');
            const webhookData = req.body;

            // Verify signature
            const hmac = crypto.createHmac('sha1', process.env.INSTAMOJO_SALT);
            hmac.update(JSON.stringify(webhookData));
            if (hmac.digest('hex') !== signature) {
                return res.status(403).send('Invalid signature');
            }

            // Find and update transaction
            const transaction = await Transaction.findOne({
                where: { paymentRequestId: webhookData.payment_request_id }
            });
            if (!transaction) return res.status(404).send('Transaction not found');

            const newStatus = webhookData.status === 'Credit' ? 'completed' : 'failed';
            await transaction.update({
                status: newStatus,
                paymentId: webhookData.payment_id,
                paymentData: JSON.stringify(webhookData)
            });

            res.status(200).send('OK');

        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Webhook processing failed');
        }
    }

    // Callback handler
    static async paymentCallback(req, res) {
        try {
            const { payment_request_id, payment_id, status } = req.query;
            
            const transaction = await Transaction.findOne({
                where: { paymentRequestId: payment_request_id }
            });
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    code: "TRANSACTION_NOT_FOUND",
                    message: "Transaction not found"
                });
            }

            const transactionStatus = status === 'success' ? 'completed' : 'failed';
            await transaction.update({
                status: transactionStatus,
                paymentId: payment_id || null
            });

            res.json({
                success: true,
                transaction_id: transaction.id,
                status: transactionStatus
            });

        } catch (error) {
            console.error('Callback error:', error);
            res.status(500).json({
                success: false,
                code: "CALLBACK_FAILED",
                message: "Callback processing failed"
            });
        }
    }

    // Check payment status
    static async checkPaymentStatus(req, res) {
        try {
            const { transactionId } = req.params;
            const transaction = await Transaction.findByPk(transactionId, {
                include: [
                    { model: Plan, as: 'plan', attributes: ['id', 'name', 'price'] }
                ]
            });
            
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    code: "TRANSACTION_NOT_FOUND",
                    message: "Transaction not found"
                });
            }

            res.json({
                success: true,
                status: transaction.status,
                transaction
            });

        } catch (error) {
            console.error('Status check error:', error);
            res.status(500).json({
                success: false,
                code: "STATUS_CHECK_FAILED",
                message: "Status check failed"
            });
        }
    }

    // ADMIN ROUTES

    // Get all transactions
    static async getAllTransactions(req, res) {
        try {
            const { page = 1, limit = 10, status, userId } = req.query;
            const offset = (page - 1) * limit;
            
            const where = {};
            if (status) where.status = status;
            if (userId) where.userId = userId;

            const { count, rows } = await Transaction.findAndCountAll({
                where,
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    { model: Plan, as: 'plan', attributes: ['id', 'name', 'price'] }
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.json({
                success: true,
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit),
                transactions: rows
            });

        } catch (error) {
            console.error('Get all transactions error:', error);
            res.status(500).json({
                success: false,
                code: "TRANSACTIONS_FETCH_FAILED",
                message: "Failed to fetch transactions"
            });
        }
    }

    // Get transaction details
    static async getTransactionDetails(req, res) {
        try {
            const { transactionId } = req.params;
            const transaction = await Transaction.findByPk(transactionId, {
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    { model: Plan, as: 'plan', attributes: ['id', 'name', 'price'] }
                ]
            });

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    code: "TRANSACTION_NOT_FOUND",
                    message: "Transaction not found"
                });
            }

            res.json({
                success: true,
                transaction
            });

        } catch (error) {
            console.error('Transaction details error:', error);
            res.status(500).json({
                success: false,
                code: "TRANSACTION_DETAILS_FAILED",
                message: "Failed to get transaction details"
            });
        }
    }

    // Refund payment
    static async processRefund(req, res) {
        try {
            const { transactionId } = req.params;
            const { reason } = req.body;

            const transaction = await Transaction.findByPk(transactionId);
            if (!transaction || transaction.status !== 'completed') {
                return res.status(400).json({
                    success: false,
                    code: "INVALID_TRANSACTION",
                    message: "Transaction not found or not eligible for refund"
                });
            }

            // Call Instamojo refund API
            const response = await axios.post(
                `${process.env.INSTAMOJO_BASE_URL}/refunds/`,
                {
                    payment_id: transaction.paymentId,
                    type: "QFL",
                    body: reason || "Customer requested refund"
                },
                {
                    headers: {
                        'X-Api-Key': process.env.INSTAMOJO_API_KEY,
                        'X-Auth-Token': process.env.INSTAMOJO_AUTH_TOKEN
                    }
                }
            );

            // Update transaction
            await transaction.update({
                status: 'refunded',
                refundData: JSON.stringify(response.data)
            });

            res.json({
                success: true,
                message: "Refund processed successfully",
                refund_id: response.data.id
            });

        } catch (error) {
            console.error('Refund error:', error);
            res.status(500).json({
                success: false,
                code: "REFUND_FAILED",
                message: "Refund processing failed",
                error: error.response?.data || error.message
            });
        }
    }
}

module.exports = PaymentController;