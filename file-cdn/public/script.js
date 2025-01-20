// Function to format file size in a human-readable format (KB, MB, GB, etc.)
function formatFileSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} Bytes`;  // If file size is less than 1KB, show Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;  // If file size is less than 1MB, show KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;  // If file size is less than 1GB, show MB
  } else {
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;  // If file size is larger than 1GB, show GB
  }
}

// Function to handle file upload
function uploadFile(event) {
  event.preventDefault();  // Prevent default form submission behavior

  const fileInput = document.getElementById('fileInput');
  const formData = new FormData();
  
  // Check if there's a file selected
  if (fileInput.files.length > 0) {
    const files = fileInput.files;
    // Append all selected files to formData
    Array.from(files).forEach(file => {
      formData.append('files', file);  // Append each file
    });

    // Send the files to the server
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Files uploaded successfully!');
          loadFileList();  // Reload the file list after a successful upload
        } else {
          alert('Failed to upload files!');
        }
      })
      .catch(error => {
        console.error('Error uploading files:', error);
        alert('Error uploading files!');
      });
  } else {
    alert('Please select at least one file to upload!');
  }
}

// Function to handle file deletion with confirmation
function deleteFile(fileName, listItem) {
  if (confirm('Are you sure you want to delete this file?')) {
    fetch(`/delete/${fileName}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('File deleted successfully!');
          listItem.remove();  // Remove the file item from the list
        } else {
          alert(data.message || 'Failed to delete file!');
        }
      })
      .catch(error => {
        console.error('Error deleting file:', error);
        alert('Error deleting file!');
      });
  }
}

// Load uploaded files and display them
function loadFileList() {
  fetch('/uploads')  // Fetch the list of files from the server
    .then(response => response.json())
    .then(files => {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';  // Clear the list before adding new items
      files.forEach(file => {
        const listItem = document.createElement('li');
        
        // File name
        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        // Upload date
        const uploadDate = document.createElement('span');
        uploadDate.textContent = `Uploaded on: ${file.uploadDate}`;
        
        // File size (formatted)
        const fileSize = document.createElement('span');
        fileSize.textContent = `Size: ${formatFileSize(file.fileSize)}`;

        // Download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.className = 'download-button';  // Add class for styling
        downloadButton.onclick = () => {
          window.location.href = file.downloadUrl; // Trigger file download
        };

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';  // Add class for styling
        deleteButton.onclick = () => {
          // Call delete function with file name and list item
          deleteFile(file.name, listItem);
        };

        // Append elements to the list item
        listItem.appendChild(fileName);
        listItem.appendChild(document.createElement('br'));  // Line break
        listItem.appendChild(uploadDate);
        listItem.appendChild(document.createElement('br'));
        listItem.appendChild(fileSize);
        listItem.appendChild(document.createElement('br'));
        listItem.appendChild(downloadButton);
        listItem.appendChild(deleteButton);
        fileList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching file list:', error);
    });
}

// Initial load of file list when the page loads
document.addEventListener('DOMContentLoaded', loadFileList);

// Event listener for the upload button
document.getElementById('uploadButton').addEventListener('click', uploadFile);
