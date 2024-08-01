// src/VideoComponent.js

import React, { useRef, useEffect } from 'react';

const VideoComponent = ({ stream, isMuted }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video ref={videoRef} autoPlay muted={isMuted} style={{ width: '300px' }} />
  );
};

export default VideoComponent;
