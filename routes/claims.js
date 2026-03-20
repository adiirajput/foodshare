const router = require('express').Router();
const Claim  = require('../models/Claim');
const Food   = require('../models/Food');

// POST claim a food item
router.post('/', async (req, res) => {
  try {
    const { foodId, recipientName, recipientPhone } = req.body;
    if (!foodId || !recipientName)
      return res.status(400).json({ error: 'Food and your name are required' });

    const food = await Food.findById(foodId);
    if (!food || food.status !== 'available')
      return res.status(400).json({ error: 'Food is no longer available' });

    const exists = await Claim.findOne({ foodId, recipientName });
    if (exists)
      return res.status(400).json({ error: 'You already claimed this item' });

    const claim = await Claim.create({ foodId, recipientName, recipientPhone });
    food.status = 'claimed';
    await food.save();
    res.status(201).json({ message: '🎉 Claimed! Contact donor for pickup.', claim });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET claims by recipient name
router.get('/recipient/:name', async (req, res) => {
  try {
    const claims = await Claim.find({ recipientName: req.params.name })
      .populate('foodId').sort({ createdAt: -1 });
    res.json(claims);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET claims for donor's food
router.get('/donor/:name', async (req, res) => {
  try {
    const foods = await Food.find({ donorName: req.params.name }).select('_id');
    const ids   = foods.map(f => f._id);
    const claims = await Claim.find({ foodId: { $in: ids } })
      .populate('foodId').sort({ createdAt: -1 });
    res.json(claims);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT mark as completed (pickup done)
router.put('/:id/complete', async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true }).populate('foodId');
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    await Food.findByIdAndUpdate(claim.foodId._id, { status: 'completed' });
    res.json({ message: '✅ Marked as picked up!', claim });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE cancel claim
router.delete('/:id', async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);
    if (claim) await Food.findByIdAndUpdate(claim.foodId, { status: 'available' });
    res.json({ message: 'Claim cancelled' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
