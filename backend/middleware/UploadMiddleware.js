import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const productsDir = path.join(uploadsDir, 'products');
const profilesDir = path.join(uploadsDir, 'profiles');

// Ensure directories exist
[uploadsDir, productsDir, profilesDir].forEach(dir => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Storage configuration for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'product-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
    cb(null, fileName);
  }
});

// Storage configuration for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'profile-' + uniqueSuffix + path.extname(file.originalname).toLowerCase();
    cb(null, fileName);
  }
});

// File filter - only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
  }
};

// Create multer instances
const productUpload = multer({ 
  storage: productStorage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

const profileUpload = multer({ 
  storage: profileStorage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 1
  }
});

// Middleware wrapper for product images
export const uploadProductImage = (req, res, next) => {
  productUpload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File terlalu besar. Maksimal 5MB.' });
      }
      return res.status(400).json({ msg: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ msg: err.message });
    }
    
    // Log for debugging
    if (req.file) {
      console.log('✅ Product image uploaded:', req.file.filename);
      console.log('📁 File path:', req.file.path);
      console.log('📏 File size:', req.file.size, 'bytes');
    }
    
    next();
  });
};

// Middleware wrapper for profile images
export const uploadProfileImage = (req, res, next) => {
  profileUpload.single('profileImage')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File terlalu besar. Maksimal 2MB.' });
      }
      return res.status(400).json({ msg: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ msg: err.message });
    }
    
    if (req.file) {
      console.log('✅ Profile image uploaded:', req.file.filename);
      console.log('📁 File path:', req.file.path);
      console.log('📏 File size:', req.file.size, 'bytes');
    }
    
    next();
  });
};
