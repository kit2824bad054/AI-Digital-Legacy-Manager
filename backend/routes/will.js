/**
 * ============================================================
 * Will Routes (backend/routes/will.js)
 * ============================================================
 * Endpoints:
 * - POST   /api/will     -> Create or initialize a digital will
 * - GET    /api/will     -> Retrieve the current user's digital will
 * - PUT    /api/will/:id -> Update an existing will by ID
 * - DELETE /api/will/:id -> Delete a will by ID
 *
 * Security:
 * - All routes are guarded by JWT middleware (`protect`).
 * - Users can ONLY access, update, or delete their own will.
 * ============================================================
 */

const express = require('express');
const Will = require('../models/Will');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/will
 * @desc    Create a new digital will for the authenticated user
 * @access  Private (Protected by JWT)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate content presence
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Will content cannot be empty',
      });
    }

    // Check if the user already has a will created
    const existingWill = await Will.findOne({ userId: req.user._id });

    if (existingWill) {
      // Update existing will instead of creating duplicate documents
      existingWill.title = title ? title.trim() : existingWill.title;
      existingWill.content = content;
      const updatedWill = await existingWill.save();

      return res.status(200).json({
        success: true,
        message: 'Digital will updated successfully!',
        will: updatedWill,
      });
    }

    // Create a new will in MongoDB
    const newWill = await Will.create({
      userId: req.user._id,
      title: title && title.trim() ? title.trim() : 'My Last Will and Testament',
      content: content,
    });

    return res.status(201).json({
      success: true,
      message: 'Digital will created and saved securely!',
      will: newWill,
    });
  } catch (error) {
    console.error('❌ [Create Will Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving digital will',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/will
 * @desc    Get the authenticated user's digital will
 * @access  Private (Protected by JWT)
 */
router.get('/', protect, async (req, res) => {
  try {
    const will = await Will.findOne({ userId: req.user._id });

    if (!will) {
      return res.status(200).json({
        success: true,
        will: null,
        message: 'No digital will found for this user yet',
      });
    }

    return res.status(200).json({
      success: true,
      will,
    });
  } catch (error) {
    console.error('❌ [Get Will Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching digital will',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   PUT /api/will/:id
 * @desc    Update a digital will by document ID
 * @access  Private (Protected by JWT)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const will = await Will.findById(req.params.id);

    if (!will) {
      return res.status(404).json({
        success: false,
        message: 'Digital will not found',
      });
    }

    // Verify ownership
    if (will.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to edit this will',
      });
    }

    if (title !== undefined) will.title = title.trim();
    if (content !== undefined) will.content = content;

    const savedWill = await will.save();

    return res.status(200).json({
      success: true,
      message: 'Digital will updated successfully',
      will: savedWill,
    });
  } catch (error) {
    console.error('❌ [Update Will Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating digital will',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/will/:id
 * @desc    Delete a digital will by document ID
 * @access  Private (Protected by JWT)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const will = await Will.findById(req.params.id);

    if (!will) {
      return res.status(404).json({
        success: false,
        message: 'Digital will not found',
      });
    }

    // Verify ownership
    if (will.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this will',
      });
    }

    await Will.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Digital will permanently deleted from secure vault',
    });
  } catch (error) {
    console.error('❌ [Delete Will Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting digital will',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
