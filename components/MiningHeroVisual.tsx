'use client';

import Image from 'next/image';

export default function MiningHeroVisual() {
  return (
    <div className="mining-hero-visual-container">
      {/* High-Tech Open Pit Mine Visual */}
      <div className="mining-hero-bg-wrap">
        <Image
          src="/images/mining-hero-pit.jpg"
          alt="Open-pit Mine Stratified Operations"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="mining-hero-bg-img"
        />
        <div className="mining-hero-overlay-grid" />
        <div className="mining-hero-vignette" />
      </div>

      {/* Blueprint Metadata Caption */}
      <div className="graphic-caption">
        <span>BENCH LEVEL STATUTORY RETRIEVAL ENGINE</span>
        <span className="caption-tag">VER. 2.4</span>
      </div>
    </div>
  );
}
