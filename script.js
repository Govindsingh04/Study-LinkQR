
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const youtubeUrlInput = document.getElementById('youtube-url');
const mediaListContainer = document.getElementById('media-list');

async function fetchMedia() {
  const { data, error } = await supabase
    .from('youtube_links')
    .select('*');
  if (error) {
    console.error(error);
    return;
  }
  mediaListContainer.innerHTML = '';
  data.forEach(link => {
    const mediaItem = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.src = link.url;
    iframe.width = '560';
    iframe.height = '315';
    iframe.allow = 'fullscreen';
    mediaItem.appendChild(iframe);
    mediaListContainer.appendChild(mediaItem);
  });
}

async function uploadFile(file) {
  const { data, error } = await supabase
    .storage
    .from('uploads')
    .upload('public/' + file.name, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('File upload error:', error);
    return;
  }
  console.log('File uploaded successfully:', data);
  fetchMedia();
}

uploadButton.addEventListener('click', () => {
  const files = fileInput.files;
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
  }
  const youtubeUrl = youtubeUrlInput.value;
  if (youtubeUrl) {
    supabase
      .from('youtube_links')
      .insert([{ url: youtubeUrl }])
      .then(() => {
        fetchMedia();
        youtubeUrlInput.value = '';
      })
      .catch(console.error);
  }
});

window.onload = fetchMedia;
