// src/app/admin/lectures/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { uploadVideo, listVideos } from '@/lib/library-utils';

export default function AdminLecturesPage() {
  const [videos, setVideos] = useState<Array<any>>([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    async function fetchVideos() {
      try {
        const data = await listVideos();
        setVideos(data);
      } catch (e) {
        console.error('Failed to load videos', e);
      }
    }
    fetchVideos();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0F172A', marginBottom: '6px' }}>
            Lecture Video Library
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
            Upload MP4 lecture videos (up to 1 GB) for students to view.
          </p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="btn-primary"
          style={{ backgroundColor: '#2563EB', padding: '8px 16px', fontSize: '0.875rem' }}
        >
          Upload Video
        </button>
      </div>

      {/* Video list */}
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {videos.map((vid) => (
          <div key={vid.id} style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <p style={{ fontWeight: '500' }}>{vid.title}</p>
            <a href={vid.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>
              View
            </a>
          </div>
        ))}
      </div>

      {/* Video Upload Modal */}
      {uploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setUploadModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>
              Upload New Lecture Video
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!selectedFile) return;
                try {
                  await uploadVideo(selectedFile);
                  setUploadModal(false);
                  const refreshed = await listVideos();
                  setVideos(refreshed);
                } catch (err: any) {
                  setUploadError(err.message || 'Upload failed');
                }
              }}
            >
              <input
                type="file"
                accept=".mp4"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
                style={{ marginBottom: '12px' }}
              />
              {uploadError && (
                <p style={{ color: '#DC2626', marginBottom: '8px' }}>{uploadError}</p>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="btn-outline"
                  style={{ fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#2563EB', fontSize: '0.875rem' }}>
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
