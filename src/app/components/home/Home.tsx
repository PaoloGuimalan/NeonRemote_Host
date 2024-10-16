/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg';

function Home() {
  return (
    <div
      style={{
        background: `url(${NeonPOSSVG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat'
      }}
      className="w-full h-full flex flex-col items-center"
    >
      <p>Hello</p>
    </div>
  );
}

export default Home;
