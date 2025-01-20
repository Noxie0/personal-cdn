const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();

// Catch uncaught exceptions and display errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);  // Exit with failure status code
});

console.log("Server is starting...");

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
    cb(null, file.originalname);  // Keep the original name of the file
  },
});

const upload = multer({ storage: storage });

console.log("File upload middleware is set up.");

// Serve the uploaded files as static files
app.use('/uploads', express.static('uploads'));

// Endpoint to upload files
app.post('/upload', upload.array('files', 10), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  console.log("Files uploaded:", req.files);  // Debug log
  res.json({ message: 'Files uploaded successfully!', files: req.files });
});

// Endpoint to get the list of uploaded files
app.get('/uploads', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read uploaded files.' });
    }

    // Get details for each file
    const fileDetails = files.map(file => {
      const filePath = path.join('./uploads', file);
      const stats = fs.statSync(filePath);
      const uploadDate = new Date(stats.mtime).toLocaleString(); // Get last modified time as upload date
      const fileSize = stats.size; // File size in bytes

      return {
        name: file,
        uploadDate: uploadDate,
        fileSize: fileSize,
        downloadUrl: `/uploads/${file}`
      };
    });

    res.json(fileDetails); // Send file details as JSON response
  });
});

// Endpoint to handle file deletion
app.delete('/delete/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join('./uploads', fileName);

  // Check if the file exists
  fs.exists(filePath, (exists) => {
    if (!exists) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    // Delete the file
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
