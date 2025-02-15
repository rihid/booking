import React from 'react';

function Video({
  source,
  captionSrc,
  isCaption = true,
}: {
  source: any;
  isCaption?: boolean;
  captionSrc?: any;
}) {
  return (
    <video width="320" height="240" autoPlay loop playsInline style={{ pointerEvents: 'none'}}>
      <source src={source} type="video/mp4" />
      <source src={source} type="video/webm" />
      {isCaption &&
        <track
          src={captionSrc}
          kind="subtitles"
          srcLang="en"
          label="English"
        />
      }
      Your browser does not support the video tag.
    </video>
  )
}

export default Video