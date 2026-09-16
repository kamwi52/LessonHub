'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

export default function PlanCreatePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Lesson Plan</h1>

      <form className="card space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Basic Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plan Title</label>
              <input
                type="text"
                placeholder="e.g., Introduction to Poetry"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select required>
                <option value="">Select subject...</option>
                <option value="English">English</option>
                <option value="Maths">Maths</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <input type="number" min="1" max="12" placeholder="8" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Term</label>
              <select required>
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Week</label>
              <input type="number" min="1" max="20" placeholder="1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Brief overview of the unit or lesson..."
              rows={3}
            />
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Learning Objectives</h2>
          <p className="text-sm text-secondary">
            What should students be able to do by the end of this lesson?
          </p>
          <textarea
            placeholder="e.g., Students will be able to analyze the structure of poetry using key terminology"
            rows={3}
          />
        </div>

        {/* Activities */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Activities & Delivery</h2>
          <textarea
            placeholder="Describe the main learning activities and delivery methods..."
            rows={4}
          />
        </div>

        {/* Assessment */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Assessment</h2>
          <textarea
            placeholder="How will you assess student learning? (formative & summative)"
            rows={3}
          />
        </div>

        {/* Differentiation */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Differentiation</h2>
          <textarea
            placeholder="How will you support different learning needs? (ELL, SEND, gifted)"
            rows={3}
          />
        </div>

        {/* Resources */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Resources</h2>
          <textarea
            placeholder="List required materials, texts, websites, tools..."
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary">
            Publish Plan
          </button>
        </div>
      </form>
    </div>
  );
}
