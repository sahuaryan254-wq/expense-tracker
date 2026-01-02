const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const { sequelize } = require('../config/db');
const { Op, QueryTypes } = require('sequelize');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Total Income
    const totalIncome = await Transaction.sum('amount', {
        where: { userId, type: 'income' }
    }) || 0;

    // Total Expense
    const totalExpense = await Transaction.sum('amount', {
        where: { userId, type: 'expense' }
    }) || 0;

    // Balance
    const balance = totalIncome - totalExpense;

    // Recent Transactions
    const recentTransactions = await Transaction.findAll({
        where: { userId },
        order: [['date', 'DESC']],
        limit: 5,
    });

    // Category Expense
    const categoryExpense = await Transaction.findAll({
        attributes: [
            'category',
            [sequelize.fn('SUM', sequelize.col('amount')), 'total']
        ],
        where: { userId, type: 'expense' },
        group: ['category'],
    });

    // Monthly Spending (Last 6 months)
    // Using raw query for easier date manipulation across different SQL dialects, 
    // but here specifically for MySQL
    const monthlySpending = await sequelize.query(`
        SELECT 
            DATE_FORMAT(date, '%Y-%m') as month, 
            SUM(amount) as total 
        FROM Transactions 
        WHERE userId = :userId 
        AND type = 'expense' 
        AND date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month 
        ORDER BY month ASC
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });

    res.status(200).json({
        totalIncome,
        totalExpense,
        balance,
        recentTransactions,
        categoryExpense,
        monthlySpending,
    });
});

module.exports = {
    getDashboardSummary,
};
