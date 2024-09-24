'use client';

import React from 'react';

function Rating() {
  const [rating, setRating] = React.useState<number | null>(null);
  const [hover, setHover] = React.useState<number | null>(null);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((rate) => {
        const currentRating = rate;
        return (
          <div key={rate} className="relative">
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onChange={() => setRating(currentRating)}
              className="hidden"
              aria-label={`Rating ${currentRating}`}
            />
            <span
              className="cursor-pointer text-4xl m-0.5"
              style={{
                color: currentRating <= (hover ?? rating ?? 0) ? "#ffc107" : "#e4e5e9",
              }}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(currentRating)}
            >
              &#9733;
            </span>
          </div>
          
        );
      })}
      {/* <span>test:{rating}</span> */}
    </div>
  );
}

export default Rating;
