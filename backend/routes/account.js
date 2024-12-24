const express = require("express");
const { account } = require("../db");
const { authMiddleware } = require('../middleware');
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const Account = await account.findOne({ userId: req.userId });

    if (!Account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.status(200).json({
        balance: Account.balance
    });
});


router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    const { to, amount } = req.body;

    const fromAccount = await account.findOne({
        userId: req.userId
    });

    if(!fromAccount || fromAccount.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficinet balance"
        })
    }

    const toAccount = await account.findOne({ userId: to });

    if(!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await account.updateOne({ userId: req.userId }, { $inc: { balance: -amount }}).session(session);
    await account.updateOne({ userId: to }, { $inc: { balance: +amount }}).session(session);

    await session.commitTransaction();
    res.status(200).json({
        message: "Transfer successfull"
    })
})

module.exports = router;