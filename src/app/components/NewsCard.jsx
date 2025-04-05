import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const NewsCard = ({ data }) => {
  if (!data) return null;

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="bg-secondary-darker rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {data.image_url && (
          <div className="md:w-1/4 flex-shrink-0">
            <div className="relative h-48 md:h-full w-full">
              <img
                src={data.image_url}
                alt={data.title || "News image"}
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

        <div className="p-5 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/60 font-medium">
              {data.source_id}
            </span>
            <span className="text-xs text-white/60">
              {formatDate(data.pubDate)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{data.title}</h3>

          <p className="text-white/70 text-sm mb-4 line-clamp-2">
            {data.description}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {data.keywords &&
                data.keywords.slice(0, 3).map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-primary-dark/30 text-xs rounded-full text-white/80">
                    {keyword}
                  </span>
                ))}
            </div>

            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-light hover:text-primary text-sm font-medium">
              <span>Read More</span>
              <FaExternalLinkAlt size={12} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
