import {cn} from '@formizee/ui';
import React from 'react';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({className, fill}: SpotlightProps): JSX.Element {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute z-40 w-full overflow-clip opacity-0 sm:h-[169%] sm:w-[208%] sm:transform-gpu sm:animate-spotlight lg:fixed lg:h-[190%] lg:w-[235%]',
        className
      )}
      fill="none"
      viewBox="0 0 3787 2842"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          fill={fill ?? 'white'}
          fillOpacity="0.15"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="2840.26"
          id="filter"
          width="3785.16"
          x="0.860352"
          y="0.838989"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          />
          <feGaussianBlur
            result="effect1_foregroundBlur_1065_8"
            stdDeviation="151"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default Spotlight;
