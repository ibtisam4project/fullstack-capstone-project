const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'setasecret';

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            name: req.body.name, // accommodate profile name
            password: hash,
            createdAt: new Date()
        });
        const payload = {
            user: { id: newUser.insertedId.toString() }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const theUser = await collection.findOne({ email: req.body.email });
        if (theUser) {
            const result = await bcrypt.compare(req.body.password, theUser.password);
            if (!result) {
                return res.status(401).json({ error: 'Wrong password' });
            }
            let payload = { user: { id: theUser._id.toString() } };
            const userName = theUser.firstName || theUser.name;
            const userEmail = theUser.email;
            const authtoken = jwt.sign(payload, JWT_SECRET);
            res.status(200).json({ authtoken, userName, userEmail });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

router.put('/update', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        
        // Remove _id from req.body if it exists to avoid MongoDB error
        const updateData = { ...req.body };
        delete updateData._id;

        const updatedUser = await collection.findOneAndUpdate(
            { email: req.body.email },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const payload = { user: { id: updatedUser._id.toString() } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken });
    } catch (e) {
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

module.exports = router;
