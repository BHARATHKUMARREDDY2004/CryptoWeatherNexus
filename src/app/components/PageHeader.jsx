import React from "react";

const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {title}
      </h1>
      {description && <p className="text-white/70">{description}</p>}
    </div>
  );
};

export default PageHeader;
