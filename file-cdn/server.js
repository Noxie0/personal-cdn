const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();

// Catch uncaught exceptions and display errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit with failure status code
});

console.log("Server is starting...");

// Function to generate a unique file name if a file with the same name already exists
function generateUniqueFileName(dir, originalName) {
  const ext = path.extname(originalName); // Extract file extension
  const baseName = path.basename(originalName, ext); // Extract base name
  let newName = originalName; // Start with the original name
  let counter = 1;

  while (fs.existsSync(path.join(dir, newName))) {
    newName = `${baseName}-${counter}${ext}`; // Append counter to the base name
    counter += 1; // Increment counter
  }

  return newName; // Return the unique file name
}

// Set up storage engine for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Uploads directory created.");
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFileName('./uploads', file.originalname); // Generate unique file name
    cb(null, uniqueName); // Use the unique name for saving the file
  },
});

const upload = multer({ storage: storage });

console.log("File upload middleware is set up.");

// Serve the uploaded files as static files
app.use('/uploads', express.static('uploads'));

// Endpoint to upload files
app.post('/upload', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }
    res.json({ success: true, message: 'Files uploaded successfully!', files: req.files });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Endpoint to get the list of uploaded files
app.get('/uploads', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read uploaded files.' });
    }

    const fileDetails = files.map(file => {
      const filePath = path.join('./uploads', file);
      const stats = fs.statSync(filePath);
      const uploadDate = new Date(stats.mtime).toLocaleString();
      const fileSize = stats.size;

      return {
        name: file,
        uploadDate: uploadDate,
        fileSize: fileSize,
        downloadUrl: `/uploads/${file}`,
      };
    });

    res.json(fileDetails);
  });
});

// Endpoint to handle file deletion
app.delete('/delete/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join('./uploads', fileName);

  fs.exists(filePath, (exists) => {
    if (!exists) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ success: false, message: 'Error deleting file.' });
      }

      console.log(`File deleted: ${fileName}`);
      return res.json({ success: true, message: 'File deleted successfully.' });
    });
  });
});

// Serve the static HTML files
app.use(express.static('public'));

// Start the server on a specified port
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle other potential errors or exceptions
process.on('exit', (code) => {
  console.log(`Server process exiting with code ${code}`);
});
