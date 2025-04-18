
const SUPABASE_URL = 'https://axlufkckmvilzywxhlvu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bHVma2NrbXZpbHp5d3hobHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjA4NjAsImV4cCI6MjA2MDUzNjg2MH0.ZAcd1wf5Cs7A2_iULzGd3fn_3gsoSSWPw-kbj8f-aTY';
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
