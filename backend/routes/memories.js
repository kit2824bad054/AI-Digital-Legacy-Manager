/**
 * ============================================================
 * Memory Capsule Routes (backend/routes/memories.js)
 * ============================================================
 * Phase 4 — Part A: Memory Capsule API
 *
 * Endpoints:
 * - POST   /api/memories      -> Upload a new memory photo with title, caption, & date
 * - GET    /api/memories      -> Retrieve all memories for authenticated user
 * - DELETE /api/memories/:id  -> Delete a memory and its associated photo file
 *
 * Multer Specifications:
 * - Form field name: 'image'
 * - Allowed formats: .jpg, .jpeg, .png
 * - Maximum file size: 5MB
 * - Upload directory: backend/uploads/
 * ============================================================
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Memory = require('../models/Memory');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 1. Ensure `uploads/` directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: memory-<timestamp>-<random>.<ext>
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `memory-${uniqueSuffix}${extension}`);
  },
});

// 3. File Filter: Accept jpg, jpeg, png only
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const ext = path.extname(file.originalname).toLowerCase();
  const isExtensionValid = allowedExtensions.includes(ext);
  const isMimeValid = allowedMimeTypes.includes(file.mimetype);

  if (isExtensionValid && isMimeValid) {
    return cb(null, true);
  }

  cb(new Error('Invalid file format. Only JPG, JPEG, and PNG images are allowed.'), false);
};

// 4. Initialize Multer instance with 5MB limit
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
  fileFilter,
});

/**
 * @route   POST /api/memories
 * @desc    Upload memory image and store details in MongoDB
 * @access  Private (Protected by JWT)
 */
router.post(
  '/',
  protect,
  (req, res, next) => {
    // Wrap multer upload to handle file validation errors gracefully
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum allowed size is 5MB.',
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, caption, date } = req.body;

      // Validate required photo file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please select a photo to upload for your memory capsule.',
        });
      }

      // Validate required title
      if (!title || !title.trim()) {
        // Clean up uploaded file if validation fails
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({
          success: false,
          message: 'Please provide a title for this memory.',
        });
      }

      // Generate public image URL path
      const imageUrl = `/uploads/${req.file.filename}`;

      // Save memory to MongoDB
      const memory = await Memory.create({
        userId: req.user._id,
        title: title.trim(),
        caption: caption ? caption.trim() : '',
        imageUrl,
        date: date ? new Date(date) : new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Precious memory successfully uploaded and archived!',
        memory,
      });
    } catch (error) {
      console.error('❌ [Upload Memory Error]:', error);
      // Clean up file if server error occurred
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(500).json({
        success: false,
        message: 'Server error while archiving memory',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

/**
 * @route   GET /api/memories
 * @desc    Get all memories for the authenticated user, sorted by date (newest first)
 * @access  Private (Protected by JWT)
 */
router.get('/', protect, async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user._id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    console.error('❌ [Get Memories Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching memories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/memories/:id
 * @desc    Delete a memory and remove its uploaded photo from server disk
 * @access  Private (Protected by JWT)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    // Verify ownership
    if (memory.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this memory',
      });
    }

    // Attempt to remove photo file from disk
    if (memory.imageUrl) {
      const filename = path.basename(memory.imageUrl);
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error removing memory file:', err);
        });
      }
    }

    // Delete record from database
    await Memory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Memory and photo permanently deleted.',
    });
  } catch (error) {
    console.error('❌ [Delete Memory Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting memory',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
