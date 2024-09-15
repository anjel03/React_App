// import React, { useState } from "react";
// import './App.css';

// const App = () => {
//   const [videos, setVideos] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   // Handle video upload
//   const handleVideoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const videoUrl = URL.createObjectURL(file);
//       setVideos([...videos, { file, url: videoUrl }]);
//     }
//   };

//   // Handle selecting a video to play
//   const handleVideoSelect = (video) => {
//     setSelectedVideo(video.url);
//   };

//   return (
//     <div className="app-container">
//       <h1 className="title">Video Uploader</h1>
//       {/* Video Player Section */}
//       <div className="video-player">
//         {selectedVideo ? (
//           <video controls width="600" src={selectedVideo} />
//         ) : (
//           <p>Select a video to play</p>
//         )}
//       </div>

//       {/* Video List Section */}
//       <div className="video-list">
//         {videos.map((video, index) => (
//           <div
//             key={index}
//             className="video-item"
//             onClick={() => handleVideoSelect(video)}
//           >
//             <p>{video.file.name}</p>
//           </div>
//         ))}
//       </div>

//       {/* Upload Button */}
//       <div className="upload-section">
//         <input
//           id="video-upload"
//           type="file"
//           accept="video/*"
//           onChange={handleVideoUpload}
//           style={{ display: "none" }}
//         />
//         <label htmlFor="video-upload" className="upload-button">
//           +
//         </label>
//       </div>
//     </div>
//   );
// };

// export default App;







import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch videos from the backend
  useEffect(() => {
    fetchVideos();
  }, []);

  // Function to fetch videos from the backend
  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("video", event.target.files[0]);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Refresh the video list after successful upload
      fetchVideos();
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // Handle selecting a video to play
  const handleVideoSelect = (video) => {
    setSelectedVideo(video.url);
    setShowSidebar(false); // Hide sidebar when a video is selected
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button><h1>------------------</h1>
        <h2>Video List</h2>
        <ul>
          {videos.map((video, index) => (
            <li key={index} onClick={() => handleVideoSelect(video)}>
              {video.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${showSidebar ? "shifted" : ""}`}>
        {/* Hamburger Menu Button */}
        <button className="menu-btn" onClick={toggleSidebar}>
          &#9776;
        </button>

        {/* Video Player Section */}
        <div className="video-player">
          {selectedVideo ? (
            <video controls width="600" src={selectedVideo} />
          ) : (
            <p>Select a video to play</p>
          )}
        </div>

        {/* Upload Button */}
        <div className="upload-section">
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="video-upload" className="upload-button">
            +
          </label>
        </div>
      </div>
    </div>
  );
};

export default App;
