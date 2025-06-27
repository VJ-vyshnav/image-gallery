📸 Responsive Media Gallery
A fully responsive, filterable Media Gallery Web App that displays photos, videos, and stacked image collections with modal previews and carousel navigation.

⚠️ Note: Due to time constraints, a real database was not used. Instead, media data is mocked using a local media.json file to simulate database retrieval.

🌟 Features
✅ Responsive grid layout using CSS Grid

✅ Filter by: All, Photos, or Videos

✅ Image stacks with interactive preview

✅ Modal view with:

🎥 Video player

🖼️ Image lightbox

📚 Carousel for image stacks

✅ Keyboard navigation (← → ESC)

✅ Clean, modern UI with animations

🔧 Project Structure

├── index.html           # Main HTML file
├── style.css            # Styling (fully responsive & themed)
├── script.js            # JavaScript for rendering & interactivity
├── media.json           # ✅ Mock database file (simulated media source)
├── images/              # Folder with all standalone and stack images
├── videos/              # Folder with all video files
└── videocover/          # Thumbnails for videos
📁 How It Works
The app fetches media data from media.json, which mimics database records.

Items are categorized by type: photo, video, or stack.

Clicking a photo opens a lightbox.

Clicking a video plays it in a modal.

Clicking a stack shows a carousel of all images in the stack.

🖥️ Usage
Clone or download the repository.

Place your media in images/, videos/, and videocover/ folders.

Update media.json with the correct paths and structure.

Open index.html in any browser.

📷 Sample media.json Structure
[
  {
    "id": 1,
    "title": "Image Collection",
    "type": "stack",
    "file_paths": [
      "images/image1.jpg",
      "images/image2.jpg"
    ]
  },
  {
    "id": 2,
    "title": "image1",
    "type": "photo",
    "file_path": "images/image1.jpg"
  },
  {
    "id": 3,
    "title": "video1",
    "type": "video",
    "file_path": "videos/video1.mp4",
    "thumbnail_path": "videocover/thumb1.png"
  }
]
🛠️ Tech Stack
HTML5

CSS3

Vanilla JavaScript

JSON (for mock data)

🤝 Contributions
Contributions are welcome! Feel free to fork this repository and submit a pull request.

📄 License
MIT License.

