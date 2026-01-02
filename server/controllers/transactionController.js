const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

// @desc    Get transactions
// @route   GET /api/transaction
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
    const { type, category, search } = req.query;

    let where = { userId: req.user.id };

    if (type) {
        where.type = type;
    }

    if (category) {
        where.category = category;
    }

    if (search) {
        where.note = { [Op.like]: `%${search}%` };
    }

    const transactions = await Transaction.findAll({
        where,
        order: [['date', 'DESC']],
    });

    res.status(200).json({
        success: true,
        count: transactions.length,
        transactions,
    });
});

// @desc    Add transaction
// @route   POST /api/transaction
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
    const { amount, type, category, note, date } = req.body;

    const transaction = await Transaction.create({
        userId: req.user.id,
        amount,
        type,
        category,
        note,
        date,
    });

    res.status(201).json({
        success: true,
        data: transaction,
    });
});

// @desc    Update transaction
// @route   PUT /api/transaction/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Make sure user owns transaction
    if (transaction.userId !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTransaction = await transaction.update(req.body);

    res.status(200).json({
        success: true,
        data: updatedTransaction,
    });
});

// @desc    Delete transaction
// @route   DELETE /api/transaction/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Make sure user owns transaction
    if (transaction.userId !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.destroy();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
};
