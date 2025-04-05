"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCryptoNews } from "../redux/newsActions";

const NewsPage = () => {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchCryptoNews());
  }, [dispatch]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-light to-secondary-dark">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Crypto News</h1>
          </div>
          <p className="text-white text-lg">
            Top 5 headlines in cryptocurrency news
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 text-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {article.image_url && (
                        <div className="w-full md:w-1/3 flex-shrink-0">
                          <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                            <img
                              src={article.image_url}
                              alt={article.title || "News image"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/640x360?text=No+Image+Available";
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-3">
                          {article.title}
                        </h2>
                        <div className="flex items-center text-gray-300 text-sm mb-4">
                          <span>{article.source_id}</span>
                          <span className="mx-2">•</span>
                          <time>{formatDate(article.pubDate)}</time>
                        </div>
                        <p className="text-gray-200 mb-4">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {article.keywords &&
                              article.keywords.slice(0, 3).map((keyword, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-primary-dark/30 text-xs rounded-full text-gray-200">
                                  {keyword}
                                </span>
                              ))}
                          </div>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors">
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-white py-20">
                <h3 className="text-2xl mb-4">No news articles found</h3>
                <p>Please check back later for updates.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
