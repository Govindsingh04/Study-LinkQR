import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .upload('public/' + file.name, file);

      if (error) {
        console.error(error);
        return;
      }
      alert('File uploaded successfully');
    }

    if (youtubeUrl) {
      const { data, error } = await supabase
        .from('youtube_links')
        .insert([{ url: youtubeUrl }]);

      if (error) {
        console.error(error);
        return;
      }
      alert('YouTube link added successfully');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
