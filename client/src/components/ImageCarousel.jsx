import React, { useState } from 'react';

function ImageCarousel({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="carousel-main-image">
        <img src="https://via.placeholder.com/400x400?text=No+Image" alt={productName} />
      </div>
    );
  }

  return (
    <div className="image-carousel">
      {/* Thumbnail strip on the left */}
      <div className="carousel-thumbnails">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`thumbnail ${idx === activeIndex ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(idx)}
            onClick={() => setActiveIndex(idx)}
          >
            <img src={img} alt={`${productName} view ${idx + 1}`} />
          </div>
        ))}
      </div>

      {/* Main preview */}
      <div className="carousel-main-image">
        <img src={images[activeIndex]} alt={productName} />
      </div>
    </div>
  );
}

export default ImageCarousel;
