import type { FC } from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
}

const Logo: FC<LogoProps> = ({ className, iconSize = 24 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sparkles className="text-primary" size={iconSize} />
      <span className="text-2xl font-bold tracking-tight text-foreground">
        VisiCraft <span className="text-primary">AI</span>
      </span>
    </div>
  );
};

export default Logo;
