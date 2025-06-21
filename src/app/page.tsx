'use client';

import * as React from 'react';
import { recommendWebinars, RecommendWebinarsOutput, Webinar } from '@/ai/flows/recommend-webinars';
import { ALL_WEBINARS, USER_PROFILE, AVAILABLE_FILTERS } from '@/lib/data';
import { WebinarCard } from '@/components/webinar-card';
import { WebinarFilters, FilterState } from '@/components/webinar-filters';
import { Compass, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const [isHostView, setIsHostView] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
    topics: new Set(),
    industry: 'all',
    price: 'all',
    skillLevel: new Set(),
  });
  const [registeredWebinars, setRegisteredWebinars] = React.useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = React.useState<RecommendWebinarsOutput | null>(null);

  const sortedWebinars = React.useMemo(() => {
    return [...ALL_WEBINARS].sort((a, b) => b.registrants - a.registrants);
  }, []);

  React.useEffect(() => {
    async function getRecommendations() {
      const recs = await recommendWebinars({ userProfile: USER_PROFILE, availableWebinars: sortedWebinars });
      setRecommendations(recs);
    }
    getRecommendations();
  }, [sortedWebinars]);

  const handleRegister = (webinarId: string) => {
    setRegisteredWebinars((prev) => new Set(prev).add(webinarId));
  };

  const filteredWebinars = React.useMemo(() => {
    return sortedWebinars.filter((webinar) => {
      if (filters.topics.size > 0 && ![...filters.topics].some((topic) => webinar.topics.includes(topic))) {
        return false;
      }
      if (filters.industry !== 'all' && webinar.industry !== filters.industry) {
        return false;
      }
      if (filters.price === 'free' && !webinar.isFree) {
        return false;
      }
      if (filters.price === 'paid' && webinar.isFree) {
        return false;
      }
      if (filters.skillLevel.size > 0 && !filters.skillLevel.has(webinar.skillLevel)) {
        return false;
      }
      return true;
    });
  }, [filters, sortedWebinars]);


  const [recommendedWebinarObjects, nonRecommendedWebinars] = React.useMemo(() => {
    if (!recommendations) {
        return [[], filteredWebinars];
    }
    const recommendedIds = new Set(recommendations.map(r => r.webinarId));
    const recommendedMap = new Map(recommendations.map(r => [r.webinarId, r.reason]));

    const recommended: (Webinar & { reason?: string | undefined; })[] = [];
    const nonRecommended: Webinar[] = [];

    for (const webinar of filteredWebinars) {
      if (recommendedIds.has(webinar.webinarId)) {
        recommended.push({ ...webinar, reason: recommendedMap.get(webinar.webinarId) });
      } else {
        nonRecommended.push(webinar);
      }
    }
    return [recommended, nonRecommended];
  }, [filteredWebinars, recommendations]);


  // Host View State and Logic
  const [hostScreen, setHostScreen] = React.useState(1); // 1: Onboarding, 2: Analytics
  const [newSessionDetails, setNewSessionDetails] = React.useState({
    industry: '',
    skillLevel: '',
    price: '',
    targetAttendees: 0,
  });
  const [onboardingComplete, setOnboardingComplete] = React.useState(false);

  const handleHostInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSessionDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setNewSessionDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save newSessionDetails and then likely navigate to the analytics view
    console.log('New session details submitted:', newSessionDetails);
    setOnboardingComplete(true);
    setHostScreen(2);
  };

  return (
    <div className="min-h-screen w-full">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button variant="ghost" onClick={() => setIsHostView(!isHostView)}>
              {isHostView ? 'Attendee View' : 'Host View'}
              </Button>
              <h1 className="text-2xl font-headline font-bold text-primary">Webinar Discovery Hub</h1>
            </div>
        </div>
      </header>

      {isHostView ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {hostScreen === 1 && (
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-headline font-bold mb-6">Onboard New Webinar Session</h2>
              <form onSubmit={handleOnboardingSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="industry">Session Industry</Label>
                  <Select
                    name="industry"
                    value={newSessionDetails.industry}
                    onValueChange={handleSelectChange('industry')}
                  >
                    <SelectTrigger id="industry" className="mt-1">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FILTERS.industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select
                    name="skillLevel"
                    value={newSessionDetails.skillLevel}
                    onValueChange={handleSelectChange('skillLevel')}
                  >
                    <SelectTrigger id="skillLevel" className="mt-1">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FILTERS.skillLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Free/Paid</Label>
                  <Select
                    name="price"
                    value={newSessionDetails.price}
                    onValueChange={handleSelectChange('price')}
                  >
                    <SelectTrigger id="price" className="mt-1">
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetAttendees">Target Number of Attendees</Label>
                  <Input
                    type="number"
                    id="targetAttendees"
                    name="targetAttendees"
                    value={newSessionDetails.targetAttendees}
                    onChange={handleHostInputChange}
                    className="mt-1"
                    min="0"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-accent-foreground bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all"
                >
                  Onboard Session
                </Button>
              </form>
            </div>
          )}

          {hostScreen === 2 && onboardingComplete && (
            <div>
              <h2 className="text-3xl font-headline font-bold mb-6">Webinar Analytics</h2>
              {/* Analytics content would go here */}
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Session Performance Overview</h3>
                {/* Placeholder for charts/data */}
                <p>Analytics for your session will appear here (e.g., Registrations by Channel, Registered vs. Target Attendees).</p>
                {/* Example: */}
                {/* <div>Registered Attendees: [Current Count] / Target: {newSessionDetails.targetAttendees}</div> */}
                {/* <div>Registrations by Channel: [Data Visualization]</div> */}
              </div>
            </div>
          )}
        </div>
      ) : (
      <>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <WebinarFilters filters={filters} onFilterChange={setFilters} availableFilters={AVAILABLE_FILTERS} />
            </aside>

            <main className="lg:col-span-3">
              <TooltipProvider>
                  {recommendations && recommendedWebinarObjects.length > 0 && (
                    <section id="recommendations">
                        <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="text-accent" />
                            Recommended For You
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recommendedWebinarObjects.map((webinar) => (
                            <Tooltip key={webinar.webinarId}>
                                <TooltipTrigger asChild>
                                    <WebinarCard
                                      className="text-left h-full"
                                      webinar={webinar}
                                      isRegistered={registeredWebinars.has(webinar.webinarId)}
                                      onRegister={handleRegister}
                                      isRecommended
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">{webinar.reason}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        </div>
                    </section>
                  )}

                  {recommendations === null && (
                    <section id="recommendations-loading">
                      <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="text-accent" />
                          Recommended For You
                      </h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                      </div>
                    </section>
                  )}


                  <section id="all-webinars" className="mt-12">
                      <h2 className="text-2xl font-headline font-semibold mb-4 flex items-center gap-2">
                          <Compass className="text-primary" />
                          {recommendations && recommendedWebinarObjects.length > 0 ? 'Trending This Week' : 'Explore All Webinars'}
                      </h2>
                      {nonRecommendedWebinars.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {nonRecommendedWebinars.map((webinar) => (
                              <WebinarCard
                              key={webinar.webinarId}
                              webinar={webinar}
                              isRegistered={registeredWebinars.has(webinar.webinarId)}
                              onRegister={handleRegister}
                              />
                          ))}
                          </div>
                      ) : (
                          <div className="text-center py-16 bg-card rounded-lg">
                              <h3 className="text-xl font-semibold font-headline">No Webinars Found</h3>
                              <p className="text-muted-foreground mt-2">Try adjusting your filters to find more events.</p>
                          </div>
                      )}
                  </section>
              </TooltipProvider>
            </main>
          </div>
        </div>
        <footer className="mt-16 py-8 bg-card border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Webinar Discovery Hub. All rights reserved.</p>
            </div>
        </footer>
      </>
      )}
    </div>
  );
}
