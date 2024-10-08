const UpButton = () => {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_3003_70236)">
        <rect x="8" y="6" width="96" height="96" rx="28" fill="#F5F5F5" shapeRendering="crispEdges" />
        <path
          d="M44 60L55.8586 48.1414C55.9367 48.0633 56.0633 48.0633 56.1414 48.1414L68 60"
          stroke="#5C5C5C"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3003_70236"
          x="0"
          y="0"
          width="112"
          height="112"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3003_70236" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3003_70236" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default UpButton;
