// src/lib/library-utils.ts
import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient();

// Document upload (PDF, DOCX, PPTX, XLSX)
export async function uploadDocument(file: File) {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const allowed = ['pdf', 'docx', 'pptx', 'xlsx'];
  if (!fileExt || !allowed.includes(fileExt)) {
    throw new Error('Unsupported document type');
  }
  const fileId = uuidv4();
  const path = `${fileId}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('library-docs')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { publicURL } = supabase.storage.from('library-docs').getPublicUrl(path);
  // Insert metadata into table
  const { error: dbErr } = await supabase.from('library_documents').insert({
    id: fileId,
    name: file.name,
    url: publicURL,
    uploaded_at: new Date().toISOString(),
  });
  if (dbErr) throw dbErr;
  return { id: fileId, url: publicURL };
}

// Video upload (MP4 up to 1GB)
export async function uploadVideo(file: File) {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (fileExt !== 'mp4') {
    throw new Error('Only MP4 videos are allowed');
  }
  if (file.size > 1024 * 1024 * 1024) {
    throw new Error('File exceeds 1 GB size limit');
  }
  const fileId = uuidv4();
  const path = `${fileId}.mp4`;
  const { data, error } = await supabase.storage
    .from('lecture-videos')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { publicURL } = supabase.storage.from('lecture-videos').getPublicUrl(path);
  // Insert metadata into table
  const { error: dbErr } = await supabase.from('lecture_videos').insert({
    id: fileId,
    title: file.name,
    url: publicURL,
    uploaded_at: new Date().toISOString(),
    duration: null,
  });
  if (dbErr) throw dbErr;
  return { id: fileId, url: publicURL };
}

export async function listDocuments() {
  const { data, error } = await supabase.from('library_documents').select('*');
  if (error) throw error;
  return data;
}

export async function listVideos() {
  const { data, error } = await supabase.from('lecture_videos').select('*');
  if (error) throw error;
  return data;
}
