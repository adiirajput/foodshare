const router = require('express').Router();
const Food   = require('../models/Food');
const Claim  = require('../models/Claim');

// Auto-expire foods past their expiry date
async function autoExpire() {
  await Food.updateMany(
    { expiry: { $lt: new Date() }, status: 'available' },
    { status: 'expired' }
  );
}

// GET all available food
router.get('/', async (req, res) => {
  try {
    await autoExpire();
    const { category, search } = req.query;
    const query = { status: 'available' };
    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    const foods = await Food.find(query).sort({ expiry: 1 });
    res.json(foods);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET all food by donor name
router.get('/by-donor/:name', async (req, res) => {
  try {
    const foods = await Food.find({ donorName: req.params.name }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET single food
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Not found' });
    res.json(food);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST add food listing
router.post('/', async (req, res) => {
  try {
    const { title, quantity, category, expiry, location, description, donorName, donorPhone } = req.body;
    if (!title || !quantity || !expiry || !location || !donorName)
      return res.status(400).json({ error: 'Please fill all required fields' });
    if (new Date(expiry) <= new Date())
      return res.status(400).json({ error: 'Expiry must be in the future' });
    const food = await Food.create({ title, quantity, category, expiry, location, description, donorName, donorPhone });
    res.status(201).json({ message: '✅ Food listed successfully!', food });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT update food
router.put('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ error: 'Not found' });
    res.json({ message: '✅ Updated!', food });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE food listing
router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    await Claim.deleteMany({ foodId: req.params.id });
    res.json({ message: '🗑️ Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
