/**
 * ============================================================
 * Secret Vault Routes (backend/routes/vault.js)
 * ============================================================
 * Phase 4 — Part B: Secret Vault API
 *
 * Endpoints:
 * - POST   /api/vault      -> Store a new encrypted secret item
 * - GET    /api/vault      -> Retrieve all vault items for authenticated user
 * - DELETE /api/vault/:id  -> Permanently delete a vault secret
 *
 * Security:
 * - All routes are protected by JWT middleware (`protect`).
 * - Content is encrypted at rest and hashed with bcrypt.
 * - Decrypted content is only transmitted to verified owner.
 * ============================================================
 */

const express = require('express');
const Vault = require('../models/Vault');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/vault
 * @desc    Add a new encrypted secret to the vault
 * @access  Private (Protected by JWT)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { type, title, content, trustedPerson } = req.body;

    // Validate required fields
    if (!type || !title || !content || !trustedPerson) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: type, title, content, and trustedPerson',
      });
    }

    // Create new vault secret (pre-save hook encrypts content with AES-256 + bcrypt)
    const vaultItem = await Vault.create({
      userId: req.user._id,
      type,
      title: title.trim(),
      content: content.trim(),
      trustedPerson: trustedPerson.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Secret encrypted with AES-256 and safely locked in vault!',
      item: {
        _id: vaultItem._id,
        type: vaultItem.type,
        title: vaultItem.title,
        content: vaultItem.decryptContent(),
        trustedPerson: vaultItem.trustedPerson,
        createdAt: vaultItem.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ [Add Vault Secret Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while storing secret in vault',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/vault
 * @desc    Get all vault items for authenticated user
 * @access  Private (Protected by JWT)
 */
router.get('/', protect, async (req, res) => {
  try {
    const items = await Vault.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Format items and decrypt content for the authorized owner
    const decryptedItems = items.map((item) => ({
      _id: item._id,
      type: item.type,
      title: item.title,
      content: item.decryptContent(),
      trustedPerson: item.trustedPerson,
      createdAt: item.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: decryptedItems.length,
      items: decryptedItems,
    });
  } catch (error) {
    console.error('❌ [Get Vault Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving vault secrets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/vault/:id
 * @desc    Delete a vault secret
 * @access  Private (Protected by JWT)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Vault.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Vault secret not found',
      });
    }

    // Verify ownership
    if (item.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this secret',
      });
    }

    await Vault.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Vault secret permanently deleted.',
    });
  } catch (error) {
    console.error('❌ [Delete Vault Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting vault secret',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
