import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // Import Supabase client
import UploadForm from '../components/UploadForm';  // Upload component

export default function Home() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from('youtube_links')
        .select('*');

      if (error) {
        console.error(error);
        return;
      }
      setMedia(data);
    };

    fetchMedia();
  }, []);

  return (
    <div>
      <h1>StudyLink QR - Upload Your Media</h1>
      <UploadForm />
      <div>
        <h2>Uploaded Media:</h2>
        {media.map((link) => (
          <div key={link.id}>
            <iframe
              src={link.url}
              width="560"
              height="315"
              allowFullScreen
              title={link.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
