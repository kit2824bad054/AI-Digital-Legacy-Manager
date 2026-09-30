/**
 * ============================================================
 * Future Letters Routes (backend/routes/letters.js)
 * ============================================================
 * Endpoints:
 * - POST   /api/letters      -> Create a new scheduled future letter
 * - GET    /api/letters      -> Get all letters belonging to current user
 * - PUT    /api/letters/:id  -> Update an existing letter
 * - DELETE /api/letters/:id  -> Delete a letter
 *
 * Security:
 * - All endpoints are protected with JWT (`protect`).
 * - Users can ONLY access, edit, or delete their own letters.
 * ============================================================
 */

const express = require('express');
const Letter = require('../models/Letter');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/letters
 * @desc    Create a new future letter
 * @access  Private (Protected by JWT)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { recipientName, subject, content, deliveryDate } = req.body;

    // Validate required fields
    if (!recipientName || !subject || !content || !deliveryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipientName, subject, content, and deliveryDate',
      });
    }

    // Verify deliveryDate is a valid date
    const parsedDate = new Date(deliveryDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery date provided',
      });
    }

    // Create the letter in MongoDB
    const letter = await Letter.create({
      userId: req.user._id,
      recipientName: recipientName.trim(),
      subject: subject.trim(),
      content: content.trim(),
      deliveryDate: parsedDate,
    });

    return res.status(201).json({
      success: true,
      message: 'Future letter successfully scheduled and encrypted!',
      letter,
    });
  } catch (error) {
    console.error('❌ [Create Letter Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while scheduling future letter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/letters
 * @desc    Get all scheduled letters for authenticated user (sorted by delivery date)
 * @access  Private (Protected by JWT)
 */
router.get('/', protect, async (req, res) => {
  try {
    const letters = await Letter.find({ userId: req.user._id }).sort({ deliveryDate: 1 });

    return res.status(200).json({
      success: true,
      count: letters.length,
      letters,
    });
  } catch (error) {
    console.error('❌ [Get Letters Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving scheduled letters',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   PUT /api/letters/:id
 * @desc    Update an existing scheduled letter
 * @access  Private (Protected by JWT)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { recipientName, subject, content, deliveryDate } = req.body;
    const letter = await Letter.findById(req.params.id);

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: 'Letter not found',
      });
    }

    // Verify ownership
    if (letter.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to edit this letter',
      });
    }

    if (recipientName !== undefined) letter.recipientName = recipientName.trim();
    if (subject !== undefined) letter.subject = subject.trim();
    if (content !== undefined) letter.content = content.trim();
    if (deliveryDate !== undefined) {
      const parsedDate = new Date(deliveryDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid delivery date format',
        });
      }
      letter.deliveryDate = parsedDate;
    }

    const updatedLetter = await letter.save();

    return res.status(200).json({
      success: true,
      message: 'Future letter updated successfully',
      letter: updatedLetter,
    });
  } catch (error) {
    console.error('❌ [Update Letter Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating future letter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/letters/:id
 * @desc    Delete a scheduled letter
 * @access  Private (Protected by JWT)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: 'Letter not found',
      });
    }

    // Verify ownership
    if (letter.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this letter',
      });
    }

    await Letter.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Future letter deleted successfully',
    });
  } catch (error) {
    console.error('❌ [Delete Letter Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting future letter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
