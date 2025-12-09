import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { User, Brain, Clock, TrendingUp, AlertCircle, CheckCircle, ArrowUp, MessageSquare, Star, Zap, FileText, Eye, Shield, Users, BarChart3, Lightbulb, Award, AlertTriangle, Timer, LogOut } from 'lucide-react';

const NewsroomPipeline = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [newStoryForm, setNewStoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [reviewForm, setReviewForm] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch stories on mount and when session is available
  useEffect(() => {
    if (session) {
      fetchStories();
    }
  }, [session]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stories');
      const data = await response.json();

      if (response.ok) {
        setStories(data.stories || []);
        calculateMetrics(data.stories || []);
      } else {
        setError(data.message || 'Failed to fetch stories');
      }
    } catch (err) {
      setError('Error fetching stories');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (allStories) => {
    const pendingCount = allStories.filter(s => s.status === 'PENDING').length;
    const approvedCount = allStories.filter(s => s.status === 'APPROVED').length;
    const killedCount = allStories.filter(s => s.status === 'KILLED').length;
    const avgDays = allStories.length > 0
      ? Math.round(allStories.reduce((sum, s) => sum + s.daysInPipeline, 0) / allStories.length)
      : 0;

    setMetrics({
      storiesInPipeline: pendingCount,
      storiesPublished: approvedCount,
      storiesKilled: killedCount,
      avgApprovalTime: `${avgDays} days`,
      totalStories: allStories.length,
    });
  };

  // Handle story submission
  const handleSubmitStory = async (formData) => {
    try {
      setLoading(true);
      setError('');

      // First, analyze the story with AI
      const analysisResponse = await fetch('/api/analyze-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitch: formData.pitch,
          headline: formData.headline,
        }),
      });

      const aiAnalysis = await analysisResponse.json();

      // Create the story
      const storyResponse = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const storyData = await storyResponse.json();

      if (!storyResponse.ok) {
        throw new Error(storyData.message || 'Failed to create story');
      }

      // Update the story with AI analysis
      if (storyData.story && aiAnalysis) {
        const updateResponse = await fetch(`/api/stories/${storyData.story.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aiAnalysis: {
              newsValue: aiAnalysis.newsValue,
              urgencyScore: aiAnalysis.urgencyScore,
              impact: aiAnalysis.publicInterest?.join(', ') || 'Community impact',
              competitorRisk: aiAnalysis.competitorRisk,
              suggestions: aiAnalysis.suggestions || [],
              resourcesNeeded: aiAnalysis.resourcesNeeded || [],
              documentsNeeded: ['Source documentation', 'Supporting evidence'],
            },
          }),
        });

        if (updateResponse.ok) {
          const updatedData = await updateResponse.json();
          setStories([updatedData.story, ...stories]);
        } else {
          setStories([storyData.story, ...stories]);
        }
      } else {
        setStories([storyData.story, ...stories]);
      }

      setNewStoryForm(false);
      fetchStories(); // Refresh stories list
    } catch (err) {
      setError(err.message || 'Error submitting story');
      console.error('Error submitting story:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle story review actions
  const handleStoryAction = async (storyId, action, feedback) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update story');
      }

      // Update local state
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === storyId ? data.story : story
        )
      );

      setReviewForm(null);
      setReviewFeedback('');
      setSelectedStory(null);

      fetchStories(); // Refresh stories list
    } catch (err) {
      setError(err.message || 'Error updating story');
      console.error('Error updating story:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  // Review form component
  const ReviewForm = ({ story }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Review Story</h3>
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold text-lg mb-2">{story.headline}</h4>
          <p className="text-gray-700 text-sm">{story.pitch}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Editorial Feedback
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={reviewFeedback}
            onChange={(e) => setReviewFeedback(e.target.value)}
            placeholder="Provide detailed feedback..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleStoryAction(story.id, 'approve', reviewFeedback)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => handleStoryAction(story.id, 'needs_work', reviewFeedback)}
            className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Needs Work'}
          </button>
          <button
            onClick={() => handleStoryAction(story.id, 'kill', reviewFeedback)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Kill Story'}
          </button>
          <button
            onClick={() => {
              setReviewForm(null);
              setReviewFeedback('');
            }}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Story card component
  const StoryCard = ({ story, index }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'APPROVED': return 'bg-green-100 text-green-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'KILLED': return 'bg-red-100 text-red-800';
        case 'NEEDS_DEVELOPMENT': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
        case 'PENDING': return <Clock className="w-4 h-4" />;
        case 'KILLED': return <AlertCircle className="w-4 h-4" />;
        case 'NEEDS_DEVELOPMENT': return <AlertTriangle className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
      }
    };

    const canReview = () => {
      const userRole = session?.user?.role;
      const storyLevel = story.currentLevel;

      if (userRole === 'EXECUTIVE_PRODUCER' && storyLevel === 2 && story.status === 'PENDING') {
        return true;
      }
      if (userRole === 'NEWS_DIRECTOR' && storyLevel === 3 && story.status === 'PENDING') {
        return true;
      }
      return false;
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{story.headline}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{story.pitch}</p>
          </div>
          <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(story.status)}`}>
            {getStatusIcon(story.status)}
            {story.status.replace(/_/g, ' ')}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{story.user?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUp className="w-4 h-4" />
            <span>Level {story.currentLevel}</span>
          </div>
          {story.newsValue && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{story.newsValue.toFixed(1)}/10</span>
            </div>
          )}
          {story.urgencyScore && (
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Urgency: {story.urgencyScore.toFixed(1)}/10</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{story.daysInPipeline || 0} days in pipeline</span>
          </div>
        </div>

        {story.aiInsights && story.aiInsights.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900 text-sm">AI Insights</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              {story.aiInsights.slice(0, 2).map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedStory(selectedStory?.id === story.id ? null : story)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors text-sm font-medium"
          >
            {selectedStory?.id === story.id ? 'Hide Details' : 'View Details'}
          </button>
          {canReview() && (
            <button
              onClick={() => setReviewForm(story)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
            >
              Review Story
            </button>
          )}
        </div>

        {selectedStory?.id === story.id && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {story.character && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Character/Source</h4>
                  <p className="text-sm text-gray-600">{story.character}</p>
                </div>
              )}
              {story.accountabilityAngle && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Accountability Angle</h4>
                  <p className="text-sm text-gray-600">{story.accountabilityAngle}</p>
                </div>
              )}
              {story.impact && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Impact</h4>
                  <p className="text-sm text-gray-600">{story.impact}</p>
                </div>
              )}
              {story.competitorStatus && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Competitor Risk</h4>
                  <p className="text-sm text-gray-600">{story.competitorStatus}</p>
                </div>
              )}
            </div>

            {story.resources && story.resources.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Resources Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {story.resources.map((resource, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {story.levelHistory && story.levelHistory.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Review History</h4>
                <div className="space-y-2">
                  {story.levelHistory
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((history, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Level {history.level}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(history.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{history.feedback || 'No feedback provided'}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // New story form component
  const NewStoryForm = () => {
    const [formData, setFormData] = useState({
      headline: '',
      pitch: '',
      character: '',
      accountabilityAngle: '',
      publicInterest: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSubmitStory(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-6">Submit New Story Pitch</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline *
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter story headline"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Pitch *
              </label>
              <textarea
                name="pitch"
                value={formData.pitch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Describe your story pitch in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character/Key Source
              </label>
              <input
                type="text"
                name="character"
                value={formData.character}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Who is the main character or source?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accountability Angle
              </label>
              <textarea
                name="accountabilityAngle"
                value={formData.accountabilityAngle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="What is the accountability angle?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Interest
              </label>
              <textarea
                name="publicInterest"
                value={formData.publicInterest}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Why does this matter to the public?"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors font-medium"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Story'}
              </button>
              <button
                type="button"
                onClick={() => setNewStoryForm(false)}
                className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Dashboard metrics for News Director
  const NewsroomDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">In Pipeline</p>
            <p className="text-3xl font-bold text-gray-900">{metrics?.storiesInPipeline || 0}</p>
          </div>
          <FileText className="w-12 h-12 text-blue-500 opacity-50" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Published</p>
            <p className="text-3xl font-bold text-gray-900">{metrics?.storiesPublished || 0}</p>
          </div>
          <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Avg. Time</p>
            <p className="text-3xl font-bold text-gray-900">{metrics?.avgApprovalTime || '0 days'}</p>
          </div>
          <Clock className="w-12 h-12 text-yellow-500 opacity-50" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Stories</p>
            <p className="text-3xl font-bold text-gray-900">{metrics?.totalStories || 0}</p>
          </div>
          <BarChart3 className="w-12 h-12 text-purple-500 opacity-50" />
        </div>
      </div>
    </div>
  );

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  const userRole = session.user.role;
  const userName = session.user.name;
  const userJobTitle = session.user.jobTitle || userRole.replace(/_/g, ' ').toLowerCase();

  // Filter stories based on user role
  const visibleStories = stories.filter(story => {
    if (userRole === 'REPORTER') {
      return story.userId === session.user.id;
    }
    if (userRole === 'EXECUTIVE_PRODUCER') {
      return story.currentLevel === 2 || story.userId === session.user.id;
    }
    if (userRole === 'NEWS_DIRECTOR') {
      return true; // News Director sees all stories
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">NewsFlow</h1>
              <p className="text-blue-100 mt-1">Editorial Workflow System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-blue-100">{userJobTitle}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Dashboard Metrics (for News Director) */}
        {userRole === 'NEWS_DIRECTOR' && metrics && <NewsroomDashboard />}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Story Pipeline
          </button>
          {userRole === 'REPORTER' && (
            <button
              onClick={() => setNewStoryForm(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              + New Story
            </button>
          )}
        </div>

        {/* Stories List */}
        {loading && !stories.length ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading stories...</p>
          </div>
        ) : visibleStories.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Stories Yet</h3>
            <p className="text-gray-400 mb-6">
              {userRole === 'REPORTER'
                ? 'Submit your first story pitch to get started.'
                : 'No stories are currently awaiting your review.'}
            </p>
            {userRole === 'REPORTER' && (
              <button
                onClick={() => setNewStoryForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Your First Story
              </button>
            )}
          </div>
        ) : (
          <div>
            {visibleStories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {newStoryForm && <NewStoryForm />}
      {reviewForm && <ReviewForm story={reviewForm} />}
    </div>
  );
};

export default NewsroomPipeline;
