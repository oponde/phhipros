import React, { useState, useEffect } from 'react';
import { Loader2, Play } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  videoSize?: number;
}

const MAX_VIDEO_MB = 50;

function openVideoStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('phhipros237-media', 1);
    req.onupgradeneeded = () => { req.result.createObjectStore('videos'); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadVideoBlob(id: string): Promise<Blob | null> {
  const idb = await openVideoStore();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('videos', 'readonly');
    const req = tx.objectStore('videos').get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export function VideoPlayer({ videoId, videoSize }: VideoPlayerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    try {
      const blob = await loadVideoBlob(videoId);
      if (blob) {
        setBlobUrl(URL.createObjectURL(blob));
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  if (blobUrl) {
    return (
      <video 
        controls 
        autoPlay 
        className="w-full max-w-[560px] block rounded-[2px] shadow-lg mt-2" 
        src={blobUrl} 
      />
    );
  }

  return (
    <div className="mt-2">
      {error ? (
        <div className="text-[12px] text-[#B23A2E] bg-red-50 p-2 rounded border border-red-100">
          Video not found — it may not have finished uploading or was deleted.
        </div>
      ) : (
        <button
          onClick={handlePlay}
          disabled={loading}
          className="flex items-center gap-2 py-1.5 px-3 border border-[rgba(20,35,28,0.14)] text-[12.5px] font-medium rounded-[2px] hover:bg-[rgba(20,35,28,0.05)] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading video...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Play video {videoSize ? `(${ (videoSize / (1024*1024)).toFixed(1) } MB)` : ''}
            </>
          )}
        </button>
      )}
    </div>
  );
}
