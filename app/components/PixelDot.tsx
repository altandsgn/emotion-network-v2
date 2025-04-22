interface PixelDotProps {
  color: string;
  className?: string;
}

export default function PixelDot({ color, className = '' }: PixelDotProps) {
  return (
    <div 
      className={`mr-2 ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 4px ${color}`,
        width: '5px',
        height: '5px'
      }}
    />
  );
} 