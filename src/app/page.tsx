import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Edit3, Film, ImageIcon, Settings2, Palette } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-slate-900 text-foreground">
      <PageHeader />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <section className="text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Unleash Creativity with <span className="text-primary">AI-Powered</span> Image & Video Generation
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Type your idea. Enhance it with AI. See it come to life. VisiCraft AI transforms your prompts into stunning visuals.
          </p>
          <Link href="/generate" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <div className="mt-16 relative max-w-4xl mx-auto">
            <Image 
              src="https://placehold.co/1200x600.png?a=1" 
              alt="AI Generated Art Showcase" 
              width={1200} 
              height={600} 
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="abstract technology"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-xl"></div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <h2 className="text-4xl font-bold text-center mb-16">How VisiCraft AI Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto bg-primary/20 text-primary rounded-full p-4 w-fit mb-4">
                  <Edit3 size={32} />
                </div>
                <CardTitle className="text-2xl">1. Craft Your Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Start with a simple text description of your vision. Let your imagination guide you.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto bg-primary/20 text-primary rounded-full p-4 w-fit mb-4">
                  <Zap size={32} />
                </div>
                <CardTitle className="text-2xl">2. Enhance with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our AI refines your prompt for optimal results, adding detail and clarity.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto bg-primary/20 text-primary rounded-full p-4 w-fit mb-4">
                  <Palette size={32} />
                </div>
                <CardTitle className="text-2xl">3. Generate & Marvel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Watch as VisiCraft AI brings your enhanced prompt to life in image or video format.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card/50 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold text-center mb-12">Features at a Glance</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="flex flex-col items-center p-6">
              <ImageIcon size={40} className="text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">High-Quality Images</h3>
              <p className="text-muted-foreground">Generate crisp JPEG & PNG images suitable for any project.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <Film size={40} className="text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Engaging Videos</h3>
              <p className="text-muted-foreground">Create short video clips in MP4 format from your textual ideas.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <Settings2 size={40} className="text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Powered by Advanced AI</h3>
              <p className="text-muted-foreground">Leveraging state-of-the-art AI for prompt engineering and media synthesis.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 border-t border-border/50">
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} VisiCraft AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
