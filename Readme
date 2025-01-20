# File CDN Service

A simple web application for uploading, managing, and downloading files. This application is built using Node.js, Express, and JavaScript, with a clean and intuitive frontend interface. The application is designed for ease of use, allowing users to upload multiple files and manage them seamlessly.

---

## Features

### 1. **File Upload**
- Drag and drop or select multiple files for upload.
- Automatically renames files with duplicate names by appending a unique identifier (e.g., `file-1.txt`, `file-2.txt`).
- Supports large files with proper error handling.

### 2. **File Listing**
- Displays all uploaded files in a list with the following details:
  - File name.
  - Upload date and time.
  - File size (formatted for readability).

### 3. **File Download**
- Each file in the list has a "Download" button for easy retrieval.
- Files are served directly from the `/uploads` directory.

### 4. **File Deletion**
- Files can be deleted using the "Delete" button.
- Confirmations ensure accidental deletions are minimized.

### 5. **Responsive Design**
- The interface is responsive and works well across desktops, tablets, and mobile devices.

---

## How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/file-cdn.git
   cd file-cdn
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   node server.js
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:3456` to access the application.

---

## Directory Structure

```plaintext
file-cdn/
├── public/               # Frontend assets
│   ├── index.html        # Main HTML file
│   ├── script.js         # JavaScript logic
│   ├── style.css         # CSS styles (add this if required)
├── uploads/              # Directory for storing uploaded files
├── server.js             # Backend server code
├── package.json          # Node.js dependencies and metadata
└── README.md             # Project documentation
```

---

## API Endpoints

### **File Upload**
- **Endpoint:** `POST /upload`
- **Payload:** FormData containing files.
- **Response:**
  - Success: `{ success: true, message: "Files uploaded successfully!", files: [...] }`
  - Failure: `{ success: false, message: "No files uploaded." }`

### **List Files**
- **Endpoint:** `GET /uploads`
- **Response:**
  - Success: `[ { name, uploadDate, fileSize, downloadUrl } ]`
  - Failure: `{ message: "Failed to read uploaded files." }`

### **Delete File**
- **Endpoint:** `DELETE /delete/:fileName`
- **Response:**
  - Success: `{ success: true, message: "File deleted successfully." }`
  - Failure: `{ success: false, message: "File not found." }`

---

## Plans for Future Development

1. **Authentication and Authorization**
   - Add user authentication (e.g., login/signup) to secure file access.
   - Implement role-based access control (RBAC) for admins and users.

2. **Search and Filter**
   - Allow users to search and filter files based on name, date, or size.

3. **File Previews**
   - Add file previews for certain file types (e.g., images, PDFs).

4. **Drag-and-Drop Interface**
   - Enhance the frontend to support drag-and-drop functionality for uploads.

5. **File Expiry**
   - Implement optional expiry dates for files to save storage.

6. **Logging and Monitoring**
   - Add logging for server activities and monitor usage stats.

7. **Error Pages**
   - Create custom error pages for better user experience.

---


## License

This project is licensed under the [MIT License](LICENSE).
