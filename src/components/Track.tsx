export default function Track() {
  return (
    <svg
      className="track"
      viewBox="0 0 800 600"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trackGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#b71c1c" />
          <stop offset="100%" stopColor="#7f0000" />
        </linearGradient>
        <linearGradient id="fieldGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f8fbff" />
          <stop offset="100%" stopColor="#e8f4ff" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" rx="28" fill="transparent" />

      <ellipse cx="400" cy="300" rx="315" ry="245" fill="url(#trackGradient)" />
      <ellipse
        cx="400"
        cy="300"
        rx="280"
        ry="215"
        fill="none"
        stroke="#e57373"
        strokeWidth="6"
        opacity="0.3"
      />
      <ellipse
        cx="400"
        cy="300"
        rx="252"
        ry="190"
        fill="none"
        stroke="#ffcdd2"
        strokeWidth="4"
        opacity="0.2"
      />
      <ellipse cx="400" cy="300" rx="230" ry="170" fill="url(#fieldGradient)" />

      <g stroke="#ffffff" strokeWidth="2" strokeDasharray="8 12" opacity="0.4">
        <ellipse cx="400" cy="300" rx="298" ry="230" fill="none" />
        <ellipse cx="400" cy="300" rx="266" ry="202" fill="none" />
        {/* Straightaway dashed lines */}
        <line x1="250" y1="70" x2="550" y2="70" />
        <line x1="250" y1="530" x2="550" y2="530" />
      </g>

      <g stroke="#ffffff" strokeWidth="6" opacity="0.7">
        {/* Start/Finish */}
        <line x1="660" y1="300" x2="708" y2="300" />
        {/* 100m */}
        <line x1="400" y1="470" x2="400" y2="545" />
        {/* 200m */}
        <line x1="92" y1="300" x2="140" y2="300" />
        {/* 300m */}
        <line x1="400" y1="55" x2="400" y2="130" />
      </g>

      <g
        fill="#1a1a1a"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="18"
        textAnchor="middle"
      >
        <text x="750" y="290">זינוק</text>
        <text x="750" y="320">סיום</text>

        <text x="400" y="575">אופניים</text>

        <text x="50" y="305">שחייה</text>

        <text x="400" y="35">ריצה</text>
      </g>
    </svg>
  );
}
