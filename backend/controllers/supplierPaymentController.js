const SupplierPayment = require('../Model/supplierPaymentModel');

// List all supplier payments
const list = async (req, res) => {
    try {
        const payments = await SupplierPayment.findAll();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single supplier payment by ID
const get = async (req, res) => {
    try {
        const payment = await SupplierPayment.findByPk(req.params.id);
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new supplier payment
const create = async (req, res) => {
    try {
        const payment = await SupplierPayment.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a supplier payment
const update = async (req, res) => {
    try {
        const payment = await SupplierPayment.findByPk(req.params.id);
        if (payment) {
            await payment.update(req.body);
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a supplier payment
const remove = async (req, res) => {
    try {
        const payment = await SupplierPayment.findByPk(req.params.id);
        if (payment) {
            await payment.destroy();
            res.json({ message: 'Payment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    list,
    get,
    create,
    update,
    remove
};


