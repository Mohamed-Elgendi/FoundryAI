/**
 * Progress Ring
 *
 * SVG circular progress indicator.
 */

interface ProgressRingProps {
  size?: number;
  percentage: number;
  strokeWidth?: number;
}

export function ProgressRing({
  size = 48,
  percentage,
  strokeWidth = 4,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference * (1 - clampedPercentage / 100);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-500"
      />
      {/* Percentage text */}
      <text
        x="50%"
        y="50%"
        className="fill-foreground"
        fontSize={size * 0.25}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
      >
        {Math.round(clampedPercentage)}%
      </text>
    </svg>
  );
}
