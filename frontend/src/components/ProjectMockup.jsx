// Lightweight, hand-drawn SVG mockups standing in for real project
// screenshots on the Selected Work cards. Automated screenshot capture of
// the live project URLs isn't available in this environment, so each
// mockup is a clean, dark, premium visual treatment themed to the project
// rather than a generic placeholder — see README for swapping in real
// screenshots later.
export default function ProjectMockup({ type, accent }) {
  if (type === "cinematic") {
    // Avengers: Doomsday — dark cinematic hero panel with a title card
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cinematicGlow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="#0a0a0c" />
        <rect width="400" height="300" fill="url(#cinematicGlow)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={40 + i * 70} y="30" width="1" height="240" fill="#ffffff" opacity="0.04" />
        ))}
        <rect x="24" y="220" width="160" height="3" fill={accent} opacity="0.8" />
        <rect x="24" y="234" width="220" height="10" rx="2" fill="#2a2a2e" />
        <rect x="24" y="252" width="140" height="8" rx="2" fill="#1c1c1f" />
        <polygon points="330,80 360,140 300,140" fill={accent} opacity="0.5" />
        <circle cx="330" cy="60" r="10" fill={accent} opacity="0.6" />
      </svg>
    );
  }

  if (type === "galaxy") {
    // Alien Galaxy Explorer — starfield with a glowing planet
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#07080c" />
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 37) % 400}
            cy={(i * 53) % 300}
            r={i % 5 === 0 ? 1.4 : 0.7}
            fill="#ffffff"
            opacity={0.2 + ((i * 13) % 60) / 100}
          />
        ))}
        <circle cx="260" cy="150" r="70" fill={accent} opacity="0.18" />
        <circle cx="260" cy="150" r="46" fill="#12141a" stroke={accent} strokeWidth="1" opacity="0.9" />
        <ellipse cx="260" cy="150" rx="78" ry="16" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.55" />
        <circle cx="120" cy="90" r="3" fill={accent} opacity="0.8" />
        <rect x="24" y="230" width="130" height="10" rx="2" fill="#22232a" />
        <rect x="24" y="248" width="90" height="8" rx="2" fill="#16171b" />
      </svg>
    );
  }

  if (type === "restaurant") {
    // Anandobrahma — fine dining: warm plated dish silhouette + elegant type block
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#0c0a08" />
        <circle cx="200" cy="140" r="86" fill="#141210" stroke={accent} strokeWidth="1" opacity="0.9" />
        <circle cx="200" cy="140" r="58" fill="#1a1613" />
        <circle cx="185" cy="128" r="10" fill={accent} opacity="0.7" />
        <circle cx="215" cy="145" r="7" fill={accent} opacity="0.55" />
        <circle cx="195" cy="158" r="6" fill={accent} opacity="0.4" />
        <rect x="150" y="240" width="100" height="2" fill={accent} opacity="0.6" />
        <rect x="170" y="252" width="60" height="8" rx="2" fill="#2a2622" />
      </svg>
    );
  }

  if (type === "archives") {
    // Webhead Archives — comic-panel grid with a red accent
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#0a0a0c" />
        {[
          [16, 16, 170, 120],
          [194, 16, 190, 70],
          [194, 94, 190, 42],
          [16, 144, 110, 130],
          [134, 144, 130, 130],
          [272, 144, 112, 60],
          [272, 212, 112, 62],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#141416" stroke="#232326" strokeWidth="1" />
        ))}
        <polygon points="60,60 90,40 110,70 80,95" fill={accent} opacity="0.7" />
        <rect x="30" y="270" width="120" height="8" rx="2" fill="#2a2a2e" />
      </svg>
    );
  }

  // ecommerce — Shopify Sparkle
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#0c0c0e" />
      <rect x="24" y="24" width="352" height="24" rx="6" fill="#17171a" />
      <circle cx="38" cy="36" r="3" fill="#3a3a3f" />
      <circle cx="50" cy="36" r="3" fill="#3a3a3f" />
      <circle cx="62" cy="36" r="3" fill="#3a3a3f" />
      <rect x="24" y="64" width="120" height="10" rx="2" fill={accent} opacity="0.8" />
      <rect x="24" y="90" width="352" height="1" fill="#232326" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${24 + i * 120}, 108)`}>
          <rect width="104" height="96" rx="4" fill="#151517" stroke="#232326" />
          <rect x="12" y="12" width="80" height="52" rx="3" fill="#1e1e21" />
          <rect x="12" y="72" width="60" height="8" rx="2" fill="#3a3a3f" />
          <rect x="12" y="84" width="30" height="6" rx="2" fill={accent} opacity="0.7" />
        </g>
      ))}
      <rect x="24" y="222" width="352" height="1" fill="#232326" />
      <rect x="24" y="240" width="90" height="10" rx="2" fill="#2c2c30" />
      <rect x="286" y="236" width="90" height="20" rx="10" fill={accent} opacity="0.85" />
    </svg>
  );
}
