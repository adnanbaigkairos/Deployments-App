import type { FC } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Home } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

interface PageHeaderProps {
  showNav?: boolean;
}

const PageHeader: FC<PageHeaderProps> = ({ showNav = false }) => {
  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 border-b border-border/50 shadow-sm bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" passHref>
          <Logo />
        </Link>
        {showNav && (
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/generate">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Generate
              </Link>
            </Button>
            <ThemeToggleButton />
          </nav>
        )}
        {/* If showNav is false, the theme toggle won't appear with the main nav elements
            per the user request to place it "right side 'Generate' Button".
            If a global theme toggle is needed on all pages, it would be placed outside this conditional.
        */}
      </div>
    </header>
  );
};

export default PageHeader;
