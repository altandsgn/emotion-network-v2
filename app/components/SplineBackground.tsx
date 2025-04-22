'use client';

import Spline from '@splinetool/react-spline';

export default function SplineBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/BdOzDIONaFlcGhhU/scene.splinecode"
      />
    </div>
  );
} 