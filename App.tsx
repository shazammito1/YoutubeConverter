import React, { useState, useCallback, FormEvent } from 'react';
import { LinkIcon, MusicNoteIcon, VideoCameraIcon, LoadingSpinner, ShareIcon } from './components/Icons';

interface VideoInfo {
  title: string;
  thumbnail: string;
  author: string;
  duration: string;
}

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [showMp3Options, setShowMp3Options] = useState<boolean>(false);

  const isValidYoutubeUrl = (urlToTest: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}([?&].*)?$/;
    return youtubeRegex.test(urlToTest);
  };

  const handleConvert = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    if (!url || !isValidYoutubeUrl(url)) {
      setError('Please enter a valid YouTube video URL.');
      setVideoInfo(null);
      return;
    }

    setError(null);
    setVideoInfo(null);
    setShareStatus(null);
    setShowMp3Options(false);
    setIsLoading(true);

    // Simulate API call for conversion
    setTimeout(() => {
      setIsLoading(false);
      setVideoInfo({
        title: 'Sample Video: A Journey Through The Mountains',
        author: 'Nature Explorers',
        duration: '12:34',
        thumbnail: `https://picsum.photos/seed/${encodeURIComponent(url)}/500/280`,
      });
    }, 2500);
  }, [url, isLoading]);
  
  const handleDownload = (type: 'MP3' | 'MP4', quality?: string) => {
      const qualityText = quality ? ` (${quality})` : '';
      alert(`This is a demo. In a real app, the ${type}${qualityText} file would start downloading.`);
      if (type === 'MP3') {
        setShowMp3Options(false); // Reset the view after selection
      }
  }
  
  const handleShare = async () => {
    if (!videoInfo || !url) return;

    const shareData = {
      title: videoInfo.title,
      text: `Check out this video: ${videoInfo.title}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link Copied!');
        setTimeout(() => setShareStatus(null), 2000);
      } catch (err) {
        setShareStatus('Copy Failed');
        setTimeout(() => setShareStatus(null), 2000);
      }
    }
  };

  const resetState = () => {
    setUrl('');
    setError(null);
    setVideoInfo(null);
    setIsLoading(false);
    setShareStatus(null);
    setShowMp3Options(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-400 text-transparent bg-clip-text mb-2">
            Video Converter
          </h1>
          <p className="text-gray-400 text-lg">
            Convert YouTube videos to MP3 or download as MP4.
          </p>
        </header>

        <main>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/20 border border-gray-700/50 p-6 md:p-8 transition-all duration-500">
            {!videoInfo ? (
              <form onSubmit={handleConvert}>
                <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube Video URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    id="youtube-url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 placeholder-gray-500"
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || !url}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-100 disabled:scale-100"
                >
                  {isLoading ? (
                    <LoadingSpinner className="w-6 h-6 animate-spin" />
                  ) : (
                    'Convert Video'
                  )}
                </button>
              </form>
            ) : (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <img src={videoInfo.thumbnail} alt={videoInfo.title} className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-lg"/>
                    <div className="flex flex-col justify-center w-full">
                        <p className="text-sm text-gray-400">{videoInfo.author}</p>
                        <h2 className="text-xl font-semibold mt-1 mb-2">{videoInfo.title}</h2>
                        <p className="text-sm text-gray-400">Duration: {videoInfo.duration}</p>
                    </div>
                </div>

                <div className="space-y-4">
                  {/* MP3 Download Section */}
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-200">
                          <MusicNoteIcon className="w-5 h-5" /> Audio Download (MP3)
                      </h3>
                      {!showMp3Options ? (
                          <button onClick={() => setShowMp3Options(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105">
                              Select Audio Quality
                          </button>
                      ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <button onClick={() => handleDownload('MP3', '128kbps')} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">Low <span className="block text-xs text-green-200 opacity-80">128kbps</span></button>
                              <button onClick={() => handleDownload('MP3', '192kbps')} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">Medium <span className="block text-xs text-green-200 opacity-80">192kbps</span></button>
                              <button onClick={() => handleDownload('MP3', '320kbps')} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">High <span className="block text-xs text-green-200 opacity-80">320kbps</span></button>
                          </div>
                      )}
                  </div>
                  
                  {/* MP4 Download Section */}
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-200">
                          <VideoCameraIcon className="w-5 h-5" /> Video Download (MP4)
                      </h3>
                      <button onClick={() => handleDownload('MP4')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105">
                          Download Video
                      </button>
                  </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={handleShare}
                        disabled={!!shareStatus}
                        className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform ${
                            !!shareStatus
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
                        }`}
                        >
                        {shareStatus ? (
                            shareStatus
                        ) : (
                            <>
                                <ShareIcon className="w-5 h-5" />
                                Share
                            </>
                        )}
                    </button>
                </div>
                
                <button
                  onClick={resetState}
                  className="w-full mt-6 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Convert another video
                </button>
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Disclaimer: This is a UI demonstration. No actual video downloading or conversion from YouTube is performed.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;