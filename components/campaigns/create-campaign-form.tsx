'use client';

import React from "react"
import { v4 as generateId } from 'uuid';
import { getCurrentTimestamp } from '@/utils/timestamp';
import { db } from '@/utils/database';
import { brandId } from '@/utils/brandId'; // Declared brandId here

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

const CONTENT_NICHES = [
  'Fashion',
  'Beauty',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Tech',
  'Lifestyle',
  'Photography',
  'Music',
];

interface FormData {
  title: string;
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  requiredNiches: string[];
  requiredFollowers: string;
}

export function CreateCampaignForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    requiredNiches: [],
    requiredFollowers: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) => {
      const updated = prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche];
      setFormData((f) => ({ ...f, requiredNiches: updated }));
      return updated;
    });
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.budget ||
      !formData.startDate ||
      !formData.endDate ||
      formData.requiredNiches.length === 0 ||
      !formData.requiredFollowers
    ) {
      setError('Please fill all required fields');
      return false;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          budget: formData.budget,
          startDate: formData.startDate,
          endDate: formData.endDate,
          requiredNiches: formData.requiredNiches,
          requiredFollowers: formData.requiredFollowers,
          status: 'active',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create campaign');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Failed to create campaign');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>Set up a campaign to find creators</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summer Fashion Campaign 2024"
            />
          </div>

          <div>
            <Label htmlFor="description">Campaign Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your campaign, what you're looking for, deliverables, etc."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget (₹) *</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="requiredFollowers">Min. Followers *</Label>
              <Input
                id="requiredFollowers"
                name="requiredFollowers"
                type="number"
                value={formData.requiredFollowers}
                onChange={handleInputChange}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label>Required Content Niches *</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {CONTENT_NICHES.map((niche) => (
                <button
                  key={niche}
                  type="button"
                  onClick={() => toggleNiche(niche)}
                  className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                    selectedNiches.includes(niche)
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-background text-foreground hover:border-primary'
                  }`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
