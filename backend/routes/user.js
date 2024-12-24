const express = require("express");
const { signupSchema, signinSchema, updateSchema } = require("../types");
const { user, account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, password, firstName, lastName } = req.body;
    const newUser = { username, password, firstName, lastName };

    const { success } = signupSchema.safeParse(newUser);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const existingUser = await user.findOne({ username });
    if (existingUser) {
        return res.status(411).json({
            message: "Account already exists"
        });
    }

    const createdUser = await user.create(newUser);

    const balance = (1 + Math.random()) * 10000;
    const newAccount = { userId: createdUser._id, balance };
    await account.create(newAccount);

    const token = jwt.sign({ userId: createdUser._id }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});


router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    
    const { success } = signinSchema.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const validUser = await user.findOne({ username, password });
    if(validUser) {
        const userId = user._id;
        const token = jwt.sign({ userId }, JWT_SECRET);

        res.status(200).json({ token });
        return ;
    }

    return res.status(411).json({
        message: "Error while logging in"
    }) 
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await user.find({
        $or: [{
            firstName: {
                "$regex": filter
            },
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            secondName: user.secondName,
            _id: user._id
        }))
    })
})

router.put("/user", authMiddleware, async (req, res) => {
    const { success } = updateSchema.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message: "Wrong inputs/ some error occurred"
        })
    } 

    await user.updateOne({ _id: req.userId }, req.body);

    res.status(200).json({
        message: "Updated successfull"
    })
})

module.exports = router;