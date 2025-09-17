import React, { useState, useEffect } from "react";
import axios from "axios";

const MusicSearch = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load top tracks from local Jamendo proxy
  useEffect(() => {
    axios
      .get("https://music-proxy.onrender.com/api/top")
      .then((res) => {
        setTracks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading top tracks", err);
        setLoading(false);
      });
  }, []);

  const searchSongs = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://music-proxy.onrender.com/api/search?q=${encodeURIComponent(query)}`
      );
      setTracks(res.data);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton card while loading
  const SkeletonCard = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-5 animate-pulse">
      <div className="w-full h-56 bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-4 w-2/3 bg-gray-700 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-gray-700 rounded mb-3"></div>
      <div className="h-3 w-full bg-gray-700 rounded"></div>
    </div>
  );

  return (
    <div className="w-[99vw] bg-gradient-to-b from-gray-900 to-gray-800 overflow-x-hidden min-h-[100vh]">
      <div className="px-2 py-12">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold mb-10 text-white tracking-tight">
          🎧 Digital Music Store
        </h1>

        {/* Search Form */}
        <form
          onSubmit={searchSongs}
          className="flex flex-col sm:flex-row mb-12 gap-4 max-w-3xl mx-auto"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for artists, songs, or albums..."
            className="flex-1 px-5 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            Search
          </button>
        </form>

        {/* Tracks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 group"
              >
                <img
                  src={track.album_image}
                  alt={track.name}
                  className="w-full h-56 object-cover rounded-lg mb-4 transform group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="font-bold text-lg text-white line-clamp-2">
                  {track.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{track.artist_name}</p>
                <div className="flex justify-between items-center">
                  <audio
                    controls
                    className="w-3/4 h-10"
                    style={{ background: "transparent" }}
                  >
                    <source src={track.audio} type="audio/mpeg" />
                  </audio>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                    Buy Now
                  </button>
                </div>
                <div className="absolute inset-0 bg-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicSearch;
