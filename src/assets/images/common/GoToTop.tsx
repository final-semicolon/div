const GoToTop = () => {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_2594_13033)">
        <rect x="8" y="6" width="96" height="96" rx="28" fill="#423EDF" shape-rendering="crispEdges" />
        <path
          d="M44 60L55.8586 48.1414C55.9367 48.0633 56.0633 48.0633 56.1414 48.1414L68 60"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2594_13033"
          x="0"
          y="0"
          width="112"
          height="112"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2594_13033" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2594_13033" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default GoToTop;
