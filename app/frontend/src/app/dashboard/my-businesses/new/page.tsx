'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Loader } from '@/components/ui/Loader';
import { Industry } from '@/lib/enums';

type FormValues = {
  name: string;
  sourceUrl: string;
  industry: Industry;
};

export default function NewBusinessPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
      setError('You must be logged in to create a business.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/businesses', {
        ...data,
      });
      console.log('Business created successfully:', response.data);
      router.push('/dashboard/mybusinesses');
    } catch (err: any) {
      console.error('Failed to create business:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create a New Business Profile</h1>
      <p className="mb-6 text-gray-600">
        Start by providing your business name and website URL. We'll analyze it to build your strategic foundation.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <Input
            id="name"
            {...register('name', { required: 'Business name is required' })}
            placeholder="e.g., The Cozy Corner Cafe"
            className="mt-1"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <Input
            id="sourceUrl"
            type="url"
            {...register('sourceUrl', { required: 'Website URL is required' })}
            placeholder="https://www.example.com"
            className="mt-1"
          />
          {errors.sourceUrl && <p className="text-red-500 text-sm mt-1">{errors.sourceUrl.message}</p>}
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <Select
            id="industry"
            {...register('industry', { required: 'Industry is required' })}
            className="mt-1"
          >
            <option value="">Select an industry...</option>
            {Object.values(Industry).map((industry) => (
              <option key={industry} value={industry}>
                {industry.replace(/_/g, ' ')}
              </option>
            ))}
          </Select>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader text="Analyzing & Creating..." /> : 'Create Business'}
          </Button>
        </div>
      </form>
    </div>
  );
}