const express = require('express');
const { db } = require('../config/firebase-admin');
const { verifyFirebaseToken } = require('../middleware/firebaseAuth');
const router = express.Router();

// Create user profile
router.post('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.firebaseUser.uid;

    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      name,
      email,
      createdAt: new Date(),
      uid: userId
    });

    res.status(201).json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get user profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.firebaseUser.uid;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get all users (admin only example)
router.get('/all', verifyFirebaseToken, async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;