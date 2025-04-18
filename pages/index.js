import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function HomePage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const { data, error } = await supabase.storage.from('studylinkqr').list('', { limit: 100 });
    if (data) setFiles(data);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { data, error } = await supabase.storage
      .from('studylinkqr')
      .upload(`${Date.now()}-${file.name}`, file);

    setUploading(false);
    if (data) fetchFiles();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📁 StudyLinkQR - Upload and Share Files</h1>
      <input type="file" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <a href={`https://YOUR_PROJECT.supabase.co/storage/v1/object/public/studylinkqr/${file.name}`} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}