'use client';

import * as React from 'react';
import { Webinar } from '@/ai/flows/recommend-webinars';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TopicIcon, LevelIcon, IndustryIcon, PriceIcon } from '@/components/icons';
import { Check, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebinarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  webinar: Webinar;
  isRegistered: boolean;
  onRegister: (webinarId: string) => void;
  isRecommended?: boolean;
}

export const WebinarCard = React.forwardRef<HTMLDivElement, WebinarCardProps>(
  ({ webinar, isRegistered, onRegister, isRecommended = false, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}
        {...props}
      >
        <CardHeader>
          <div className="relative mb-4">
            <Image
              src={`https://placehold.co/600x400.png?text=${encodeURIComponent(webinar.title)}`}
              alt={webinar.title}
              width={600}
              height={400}
              className="rounded-lg object-cover"
              data-ai-hint={`${webinar.industry} ${webinar.topics[0]}`}
            />
            {isRecommended && (
              <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommended
              </Badge>
            )}
          </div>
          <CardTitle className="font-headline text-xl leading-tight">{webinar.title}</CardTitle>
          <CardDescription className="font-body text-sm pt-1">{webinar.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-primary">
                <Users className="w-4 h-4" />
                <span>{String(webinar.registrants).padStart(2, '0')} learners going</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <PriceIcon className="w-4 h-4 text-primary" />
                <Badge variant={webinar.isFree ? "secondary" : "outline"} className="capitalize">{webinar.isFree ? 'Free' : 'Paid'}</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <LevelIcon className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="capitalize">{webinar.skillLevel}</Badge>
            </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IndustryIcon className="w-4 h-4 text-primary" />
                <Badge variant="outline">{webinar.industry}</Badge>
            </div>
          </div>
          <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Topics:</p>
              <div className="flex flex-wrap gap-2">
              {webinar.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1.5">
                      <TopicIcon topic={topic} className="w-3 h-3" />
                      {topic}
                  </Badge>
              ))}
              </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => onRegister(webinar.webinarId)}
            disabled={isRegistered}
          >
            {isRegistered ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Registered
              </>
            ) : (
              'Register Now'
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }
);
WebinarCard.displayName = 'WebinarCard';
