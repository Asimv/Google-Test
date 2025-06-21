'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export interface FilterState {
  topics: Set<string>;
  industry: string;
  price: 'all' | 'free' | 'paid';
  skillLevel: Set<string>;
}

interface WebinarFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFilters: {
    topics: string[];
    industries: string[];
    skillLevels: string[];
  };
}

export function WebinarFilters({ filters, onFilterChange, availableFilters }: WebinarFiltersProps) {
    
  const handleTopicChange = (topic: string, checked: boolean) => {
    const newTopics = new Set(filters.topics);
    if (checked) {
      newTopics.add(topic);
    } else {
      newTopics.delete(topic);
    }
    onFilterChange({ ...filters, topics: newTopics });
  };

  const handleSkillLevelChange = (level: string, checked: boolean) => {
    const newSkillLevels = new Set(filters.skillLevel);
    if (checked) {
      newSkillLevels.add(level);
    } else {
      newSkillLevels.delete(level);
    }
    onFilterChange({ ...filters, skillLevel: newSkillLevels });
  };
  
  const handleIndustryChange = (industry: string) => {
    onFilterChange({ ...filters, industry });
  };

  const handlePriceChange = (price: 'all' | 'free' | 'paid') => {
    onFilterChange({ ...filters, price });
  };

  const clearFilters = () => {
    onFilterChange({
        topics: new Set(),
        industry: 'all',
        price: 'all',
        skillLevel: new Set()
    })
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Filter Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-bold text-base">Topics</Label>
          <div className="space-y-2 mt-2">
            {availableFilters.topics.map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`topic-${topic}`}
                  checked={filters.topics.has(topic)}
                  onCheckedChange={(checked) => handleTopicChange(topic, !!checked)}
                />
                <label htmlFor={`topic-${topic}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {topic}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="font-bold text-base" htmlFor="industry-select">Industry</Label>
          <Select value={filters.industry} onValueChange={handleIndustryChange}>
            <SelectTrigger id="industry-select" className="w-full mt-2">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {availableFilters.industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
            <Label className="font-bold text-base">Price</Label>
            <RadioGroup value={filters.price} onValueChange={handlePriceChange} className="mt-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="price-all" />
                    <Label htmlFor="price-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="price-free" />
                    <Label htmlFor="price-free">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="price-paid" />
                    <Label htmlFor="price-paid">Paid</Label>
                </div>
            </RadioGroup>
        </div>

        <div>
            <Label className="font-bold text-base">Skill Level</Label>
            <div className="space-y-2 mt-2">
                {availableFilters.skillLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                        id={`level-${level}`}
                        checked={filters.skillLevel.has(level)}
                        onCheckedChange={(checked) => handleSkillLevelChange(level, !!checked)}
                    />
                    <label htmlFor={`level-${level}`} className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {level}
                    </label>
                </div>
                ))}
            </div>
        </div>

        <Button variant="outline" className="w-full" onClick={clearFilters}>Clear All Filters</Button>
      </CardContent>
    </Card>
  );
}
