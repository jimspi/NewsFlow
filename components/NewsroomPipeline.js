import React, { useState, useEffect } from 'react';
import { User, Brain, Clock, TrendingUp, AlertCircle, CheckCircle, ArrowUp, MessageSquare, Star, Zap, FileText, Eye, Shield, Users, BarChart3, Lightbulb, Award, AlertTriangle, Timer, Camera, Mic, Globe } from 'lucide-react';

const NewsroomPipeline = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [newStoryForm, setNewStoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [reviewForm, setReviewForm] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [loginForm, setLoginForm] = useState(null);

  // Handle story review actions
  const handleStoryAction = (storyId, action, feedback) => {
    setStories(prevStories => {
      return prevStories.map(story => {
        if (story.id === storyId) {
          const updatedStory = { ...story };
          const currentLevel = story.currentLevel;
          const currentDate = new Date().toISOString().split('T')[0];
          
          // Update level history
          const updatedHistory = [...story.levelHistory];
          const currentHistoryIndex = updatedHistory.findIndex(h => h.level === currentLevel && h.status === 'pending');
          
          if (currentHistoryIndex !== -1) {
            updatedHistory[currentHistoryIndex] = {
              ...updatedHistory[currentHistoryIndex],
              status: action,
              feedback: feedback,
              date: currentDate,
              timeSpent: 'completed'
            };
          }
          
          // Update story status and level
          if (action === 'approved') {
            if (currentLevel < 3) {
              // Move to next level
              updatedStory.currentLevel = currentLevel + 1;
              updatedStory.status = 'pending';
              // Add new pending entry for next level
              updatedHistory.push({
                level: currentLevel + 1,
                status: 'pending',
                feedback: 'Awaiting review',
                date: currentDate,
                timeSpent: 'ongoing'
              });
            } else {
              // Final approval
              updatedStory.status = 'approved';
            }
          } else if (action === 'denied') {
            updatedStory.status = 'killed';
          } else if (action === 'needs_development') {
            updatedStory.currentLevel = 1; // Send back to reporter
            updatedStory.status = 'needs_development';
            // Add entry for reporter to revise
            updatedHistory.push({
              level: 1,
              status: 'needs_development',
              feedback: feedback,
              date: currentDate,
              timeSpent: 'ongoing'
            });
          }
          
          updatedStory.levelHistory = updatedHistory;
          return updatedStory;
        }
        return story;
      });
    });
    
    setReviewForm(null);
    setReviewFeedback('');
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('pipeline');
    setSelectedStory(null);
    setNewStoryForm(false);
    setReviewForm(null);
    setLoginForm(null);
  };

  // Handle PIN login (simplified for demo)
  const handlePinLogin = (user) => {
    setCurrentUser(user);
    setLoginForm(null);
  };

  const PinLoginForm = ({ user }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Login as {user.name}
        </h3>
        <p className="text-gray-600 mb-4">
          {user.title} • {user.department}
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter PIN (demo: use "1234")
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value === '1234') {
                handlePinLogin(user);
              }
            }}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handlePinLogin(user)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => setLoginForm(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          For demo purposes, use PIN "1234" for any role
        </p>
      </div>
    </div>
  );

  const ReviewForm = ({ story }) => {
    const [localFeedback, setLocalFeedback] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Review: {story.headline}
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 italic">"{story.pitch}"</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Submitted by:</strong> {story.submittedBy}</div>
                <div><strong>News Value:</strong> {story.newsValue}/10</div>
                <div><strong>Bucket:</strong> {story.bucket}</div>
                <div><strong>Key Character:</strong> {story.character}</div>
              </div>
              <div className="mt-2 text-sm">
                <strong>Accountability Angle:</strong> {story.accountabilityAngle}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm font-medium text-blue-900">Impact</div>
                <div className="text-blue-700">{story.impact}</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm font-medium text-green-900">Content Bucket</div>
                <div className="text-green-700">{story.bucket}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-sm font-medium text-purple-900">Key Character</div>
                <div className="text-purple-700">{story.character}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="text-sm font-medium text-orange-900">Accountability</div>
                <div className="text-orange-700 text-sm">{story.accountabilityAngle}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editorial Feedback *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={localFeedback}
                onChange={(e) => setLocalFeedback(e.target.value)}
                placeholder="Provide detailed feedback on the story pitch, sourcing, legal considerations, or required changes..."
              />
            </div>
            
            <div className="flex flex-wrap gap-3 sticky bottom-0 bg-white pt-4 border-t">
              <button
                onClick={() => handleStoryAction(story.id, 'approved', localFeedback)}
                disabled={!localFeedback.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </button>
              
              <button
                onClick={() => handleStoryAction(story.id, 'needs_development', localFeedback)}
                disabled={!localFeedback.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Needs Work</span>
              </button>
              
              <button
                onClick={() => handleStoryAction(story.id, 'denied', localFeedback)}
                disabled={!localFeedback.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Kill Story</span>
              </button>
              
              <button
                onClick={() => {
                  setReviewForm(null);
                  setReviewFeedback('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
            
            {!localFeedback.trim() && (
              <p className="text-sm text-red-600 mt-2">
                Editorial feedback is required for all decisions
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Newsroom hierarchy - simplified 3-level structure
  const hierarchy = [
    { level: 1, title: 'Reporter', name: 'Sarah Martinez', department: 'Newsroom Team', storiesSubmitted: 23 },
    { level: 2, title: 'Executive Producer', name: 'Mike Chen', department: 'Editorial', storiesReviewed: 156 },
    { level: 3, title: 'News Director', name: 'Lisa Thompson', department: 'Leadership', storiesApproved: 89 }
  ];

  // Sample stories with journalism-specific data
  const sampleStories = [
    {
      id: 1,
      headline: 'City Council Water Contract Investigation',
      pitch: 'Investigating potential corruption in $50M water treatment contract. Multiple sources indicate bid rigging and kickbacks to council members.',
      submittedBy: 'Sarah Martinez',
      currentLevel: 2,
      status: 'pending',
      newsValue: 8.5,
      impact: 'High - affects water rates for 200K residents',
      bucket: 'Government Accountability',
      character: 'Council Member Janet Rodriguez (alleged kickback recipient)',
      accountabilityAngle: 'Public officials misusing taxpayer funds for personal gain',
      urgencyScore: 7.8,
      documentsNeeded: ['Contract documents', 'Financial records', 'Email communications'],
      competitorStatus: 'No other outlets investigating',
      daysInPipeline: 4,
      aiInsights: [
        'Strong documentation potential based on public records analysis',
        'Similar stories resulted in successful prosecutions',
        'Timing optimal - budget season approaching'
      ],
      levelHistory: [
        { level: 1, status: 'approved', feedback: 'Strong sources, good documentation trail', date: '2025-07-20', timeSpent: '2 hours research' },
        { level: 2, status: 'pending', feedback: 'Reviewing legal implications and source protection', date: '2025-07-22', timeSpent: 'ongoing' }
      ],
      resources: ['Data analyst', 'Legal review', 'Photography'],
      publicInterest: 'High - affects water rates for 200K residents'
    },
    {
      id: 2,
      headline: 'Local Hospital Safety Violations',
      pitch: 'Anonymous nurse reports systematic safety violations at Regional Medical. Patient safety incidents covered up by administration.',
      submittedBy: 'Sarah Martinez',
      currentLevel: 1,
      status: 'needs_development',
      newsValue: 6.8,
      impact: 'High - patient safety affects entire region',
      bucket: 'Healthcare Accountability',
      character: 'Regional Medical CEO Dr. Marcus Webb',
      accountabilityAngle: 'Healthcare executives prioritizing profits over patient safety',
      urgencyScore: 9.2,
      documentsNeeded: ['Incident reports', 'Staffing records', 'Patient safety data'],
      competitorStatus: 'Competitor may have similar tip',
      daysInPipeline: 2,
      aiInsights: [
        'Healthcare stories require careful sourcing',
        'HIPAA compliance critical for patient information',
        'Hospital likely to respond aggressively to inquiry'
      ],
      levelHistory: [
        { level: 1, status: 'needs_development', feedback: 'Need more sources before proceeding. Single anonymous source insufficient.', date: '2025-07-21', timeSpent: '3 hours interviews' }
      ],
      resources: ['Healthcare reporter', 'Legal expert', 'Data analysis'],
      publicInterest: 'High - patient safety affects entire region'
    },
    {
      id: 3,
      headline: 'School District Budget Discrepancies',
      pitch: 'Whistleblower reports $2M missing from school district capital improvement fund. Potential misallocation of bond money intended for facility upgrades.',
      submittedBy: 'Sarah Martinez',
      currentLevel: 2,
      status: 'pending',
      newsValue: 7.2,
      impact: 'High - affects 15,000 students and families',
      bucket: 'Education Accountability',
      character: 'Superintendent Dr. Patricia Williams',
      accountabilityAngle: 'Education leaders mismanaging funds meant for student facilities',
      urgencyScore: 6.5,
      documentsNeeded: ['Budget reports', 'Bond documentation', 'Contractor payments'],
      competitorStatus: 'Exclusive story',
      daysInPipeline: 1,
      aiInsights: [
        'Public education funding stories drive high engagement',
        'School board meeting records may provide additional leads',
        'Timing good - budget approval season approaching'
      ],
      levelHistory: [
        { level: 1, status: 'approved', feedback: 'Solid financial documentation, good source credibility', date: '2025-07-24', timeSpent: '4 hours research' },
        { level: 2, status: 'pending', feedback: 'Awaiting review from Executive Producer', date: '2025-07-25', timeSpent: 'ongoing' }
      ],
      resources: ['Financial analyst', 'Education reporter', 'Legal review'],
      publicInterest: 'High - affects 15,000 students and families'
    }
  ];

  // Newsroom metrics
  const newsroomMetrics = {
    storiesInPipeline: 15,
    storiesPublished: 42,
    avgApprovalTime: '8 days',
    investigativeImpact: 'High',
    audienceEngagement: '89%',
    competitorAdvantage: '+3.2 days faster',
    legalIssues: 0,
    sourceProtection: '100%'
  };

  useEffect(() => {
    setStories(sampleStories);
  }, []);

  // Real AI analysis using OpenAI API for production
  const mockJournalismAI = async (pitch, headline) => {
    setLoading(true);
    
    try {
      // In production, this will call your API route
      const response = await fetch('/api/analyze-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitch,
          headline,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze story');
      }

      const analysis = await response.json();
      setLoading(false);
      return analysis;
      
    } catch (error) {
      console.error('AI Analysis error:', error);
      setLoading(false);
      
      // Fallback to mock analysis if API fails
      return await fallbackAnalysis(pitch, headline);
    }
  };

  // Fallback analysis for development or API failures
  const fallbackAnalysis = async (pitch, headline) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Safely handle potentially undefined values
    const pitchLower = (pitch || '').toLowerCase();
    const headlineLower = (headline || '').toLowerCase();
    const combinedText = `${headlineLower} ${pitchLower}`.trim();
    
    // Determine news value based on content keywords
    let newsValue = 5.0;
    const highValueKeywords = ['corruption', 'investigation', 'scandal', 'violation', 'fraud', 'safety', 'death', 'lawsuit', 'criminal'];
    const mediumValueKeywords = ['budget', 'contract', 'policy', 'meeting', 'report', 'study', 'proposal', 'change'];
    
    const highValueMatches = combinedText ? highValueKeywords.filter(keyword => combinedText.includes(keyword)).length : 0;
    const mediumValueMatches = combinedText ? mediumValueKeywords.filter(keyword => combinedText.includes(keyword)).length : 0;
    
    if (highValueMatches > 0) {
      newsValue = 7.5 + (highValueMatches * 0.5);
    } else if (mediumValueMatches > 0) {
      newsValue = 6.0 + (mediumValueMatches * 0.3);
    }
    newsValue = Math.min(newsValue, 10);
    
    // Generate contextual public interest based on content
    const publicInterest = [];
    if (combinedText && (combinedText.includes('water') || combinedText.includes('utility'))) {
      publicInterest.push('Affects utility rates and service quality for residents');
    }
    if (combinedText && (combinedText.includes('school') || combinedText.includes('education'))) {
      publicInterest.push('Impacts student education and family resources');
    }
    if (combinedText && (combinedText.includes('hospital') || combinedText.includes('medical') || combinedText.includes('health'))) {
      publicInterest.push('Patient safety and healthcare access concerns');
    }
    if (combinedText && (combinedText.includes('tax') || combinedText.includes('budget') || combinedText.includes('money'))) {
      publicInterest.push('Taxpayer funds and financial accountability');
    }
    if (combinedText && (combinedText.includes('corruption') || combinedText.includes('fraud'))) {
      publicInterest.push('Government transparency and public trust');
    }
    if (combinedText && (combinedText.includes('safety') || combinedText.includes('danger'))) {
      publicInterest.push('Public safety and community welfare');
    }
    
    // Default if no specific matches
    if (publicInterest.length === 0) {
      publicInterest.push('Local community impact and civic awareness');
    }
    
    // Generate contextual suggestions based on story type
    const suggestions = [];
    if (combinedText && (combinedText.includes('anonymous') || combinedText.includes('whistleblower'))) {
      suggestions.push('Develop additional sources to corroborate anonymous claims');
      suggestions.push('Ensure source protection protocols are in place');
    }
    if (combinedText && (combinedText.includes('investigation') || combinedText.includes('corruption'))) {
      suggestions.push('Request public records and financial documents');
      suggestions.push('Consider consulting with legal experts on libel risks');
    }
    if (combinedText && (combinedText.includes('hospital') || combinedText.includes('medical'))) {
      suggestions.push('Verify HIPAA compliance for any patient information');
      suggestions.push('Consult healthcare reporting guidelines');
    }
    if (combinedText && (combinedText.includes('contract') || combinedText.includes('bid'))) {
      suggestions.push('Analyze contract documents and bidding process');
      suggestions.push('Interview other bidders or industry experts');
    }
    if (combinedText && (combinedText.includes('budget') || combinedText.includes('financial'))) {
      suggestions.push('Review financial records and audit reports');
      suggestions.push('Interview budget officials and oversight committee');
    }
    
    // Default suggestions if none match
    if (suggestions.length === 0) {
      suggestions.push('Develop additional sources to strengthen the story');
      suggestions.push('Gather supporting documentation');
      suggestions.push('Consider community impact and stakeholder perspectives');
    }
    
    // Generate recommendations based on story complexity and type
    const recommendations = [];
    if (newsValue > 8) {
      recommendations.push('High-impact story - consider multi-part series');
      recommendations.push('Coordinate with legal team before publication');
    }
    if (combinedText && combinedText.includes('investigation')) {
      recommendations.push('Allow adequate time for thorough investigation');
      recommendations.push('Consider collaboration with data/investigative team');
    }
    if (combinedText && (combinedText.includes('breaking') || combinedText.includes('urgent'))) {
      recommendations.push('Fast-track editorial review due to time sensitivity');
    }
    if (combinedText && (combinedText.includes('government') || combinedText.includes('council') || combinedText.includes('official'))) {
      recommendations.push('Prepare for official response and potential pushback');
      recommendations.push('Consider public records requests to support claims');
    }
    
    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('Standard editorial review and fact-checking process');
      recommendations.push('Monitor for developments that could affect story timing');
    }
    
    return {
      newsValue: Math.round(newsValue * 10) / 10,
      publicInterest: publicInterest,
      suggestions: suggestions.slice(0, 3),
      recommendations: recommendations.slice(0, 3),
      estimatedTimeline: newsValue > 8 ? `${Math.floor(Math.random() * 2 + 3)}-${Math.floor(Math.random() * 3 + 4)} weeks` : `${Math.floor(Math.random() * 2 + 1)}-${Math.floor(Math.random() * 2 + 2)} weeks`,
      competitorRisk: (combinedText && combinedText.includes('exclusive')) ? 'LOW' : (combinedText && combinedText.includes('breaking')) ? 'HIGH' : Math.random() > 0.5 ? 'MEDIUM' : 'LOW',
      legalRisk: (combinedText && (combinedText.includes('corruption') || combinedText.includes('fraud') || combinedText.includes('lawsuit'))) ? 'HIGH' : 
                 (combinedText && (combinedText.includes('investigation') || combinedText.includes('anonymous'))) ? 'MEDIUM' : 'LOW',
      urgencyScore: Math.round((newsValue + ((combinedText && combinedText.includes('breaking')) ? 3 : 0) + ((combinedText && combinedText.includes('urgent')) ? 2 : 0)) * 10) / 10,
      resourcesNeeded: ['Legal review', 'Data analyst', 'Photography']
    };
  };

  const NewsroomDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Stories in Pipeline</h3>
            <p className="text-3xl font-bold">{newsroomMetrics.storiesInPipeline}</p>
            <p className="text-blue-100">Active investigations</p>
          </div>
          <FileText className="h-12 w-12 text-blue-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Published This Month</h3>
            <p className="text-3xl font-bold">{newsroomMetrics.storiesPublished}</p>
            <p className="text-green-100">+23% vs last month</p>
          </div>
          <Globe className="h-12 w-12 text-green-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Avg Approval Time</h3>
            <p className="text-3xl font-bold">{newsroomMetrics.avgApprovalTime}</p>
            <p className="text-purple-100">Industry avg: 12 days</p>
          </div>
          <Timer className="h-12 w-12 text-purple-200" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Audience Engagement</h3>
            <p className="text-3xl font-bold">{newsroomMetrics.audienceEngagement}</p>
            <p className="text-orange-100">Above industry average</p>
          </div>
          <TrendingUp className="h-12 w-12 text-orange-200" />
        </div>
      </div>
    </div>
  );

  const StoryCard = ({ story, isExpanded, onClick }) => {
    const getStatusColor = (status) => {
      switch(status) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'killed': return 'bg-red-100 text-red-800';
        case 'needs_development': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getCurrentLevelName = (level) => {
      return hierarchy.find(h => h.level === level)?.title || 'Unknown';
    };

    // Modified to allow both EP (level 2) and News Director (level 3) to review stories at their level
    const canReview = currentUser && story.currentLevel === currentUser.level && story.status === 'pending' && currentUser.level >= 2;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{story.headline}</h3>
              {story.urgencyScore > 8 && (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              {story.legalRisk === 'HIGH' && (
                <Shield className="h-5 w-5 text-orange-600" />
              )}
              {canReview && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  AWAITING YOUR REVIEW
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3 italic">"{story.pitch}"</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>By: {story.submittedBy}</span>
             <span>•</span>
             <span>At: {getCurrentLevelName(story.currentLevel)}</span>
             <span>•</span>
             <span>{story.daysInPipeline} days in pipeline</span>
           </div>
         </div>
         <div className="flex flex-col items-end space-y-2">
           <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
             {story.status.replace('_', ' ').toUpperCase()}
           </span>
           <div className="flex items-center space-x-1">
             <Star className="h-4 w-4 text-yellow-500" />
             <span className="text-sm font-medium">{story.newsValue}/10</span>
           </div>
         </div>
       </div>
       
       {canReview && (
         <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-2">
               <Eye className="h-4 w-4 text-blue-600" />
               <span className="text-sm font-medium text-blue-900">This story requires your review</span>
             </div>
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 setReviewForm(story);
               }}
               className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
             >
               Review Now
             </button>
           </div>
         </div>
       )}
       
       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
         <div className="bg-blue-50 p-2 rounded text-center">
           <div className="text-xs text-blue-600 font-medium">Impact</div>
           <div className="text-blue-700 font-bold text-xs">{story.impact?.split(' - ')[0] || 'Medium'}</div>
         </div>
         <div className="bg-green-50 p-2 rounded text-center">
           <div className="text-xs text-green-600 font-medium">Bucket</div>
           <div className="text-green-700 font-bold text-xs">{story.bucket}</div>
         </div>
         <div className="bg-purple-50 p-2 rounded text-center">
           <div className="text-xs text-purple-600 font-medium">Character</div>
           <div className="text-purple-700 font-bold text-xs">{story.character.split(' ')[0]} {story.character.split(' ')[1]}</div>
         </div>
         <div className="bg-orange-50 p-2 rounded text-center">
           <div className="text-xs text-orange-600 font-medium">Urgency</div>
           <div className="text-orange-700 font-bold">{story.urgencyScore}/10</div>
         </div>
       </div>
       
       {isExpanded && (
         <div className="mt-4 pt-4 border-t border-gray-200">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
               <h4 className="font-medium text-gray-900 mb-2">Story Framework</h4>
               <div className="space-y-1 text-sm text-gray-600">
                 <div><strong>Impact:</strong> {story.impact}</div>
                 <div><strong>Content Bucket:</strong> {story.bucket}</div>
                 <div><strong>Urgency Score:</strong> {story.urgencyScore}/10</div>
               </div>
             </div>
             <div>
               <h4 className="font-medium text-gray-900 mb-2">Story Focus</h4>
               <div className="space-y-1 text-sm text-gray-600">
                 <div><strong>Key Character:</strong> {story.character}</div>
                 <div><strong>Accountability Angle:</strong> {story.accountabilityAngle}</div>
               </div>
             </div>
           </div>
           
           <div className="mb-4">
             <h4 className="font-medium text-gray-900 mb-2">Documents Needed</h4>
             <ul className="space-y-1">
               {story.documentsNeeded.map((doc, idx) => (
                 <li key={idx} className="text-sm text-gray-600 flex items-start">
                   <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                   {doc}
                 </li>
               ))}
             </ul>
           </div>
           
           <div className="mb-4">
             <h4 className="font-medium text-gray-900 mb-2 flex items-center">
               <Brain className="h-4 w-4 mr-1" />
               AI Editorial Insights
             </h4>
             <ul className="space-y-1">
               {story.aiInsights.map((insight, idx) => (
                 <li key={idx} className="text-sm text-gray-600 flex items-start">
                   <span className="text-blue-500 mr-2">•</span>
                   {insight}
                 </li>
               ))}
             </ul>
           </div>
           
           <div>
             <h4 className="font-medium text-gray-900 mb-2">Editorial Approval Chain</h4>
             <div className="space-y-2">
               {story.levelHistory.map((entry, idx) => (
                 <div key={idx} className="flex items-start space-x-3 text-sm">
                   <div className={`w-3 h-3 rounded-full mt-1 ${
                     entry.status === 'approved' ? 'bg-green-500' : 
                     entry.status === 'pending' ? 'bg-yellow-500' : 
                     entry.status === 'killed' ? 'bg-red-500' : 'bg-orange-500'
                   }`}></div>
                   <div className="flex-1">
                     <div className="flex items-center space-x-2">
                       <span className="font-medium">{hierarchy.find(h => h.level === entry.level)?.title}</span>
                       <span className="text-gray-400">{entry.date}</span>
                     </div>
                     <div className="text-gray-600 mt-1">{entry.feedback}</div>
                     {entry.status === 'needs_development' && (
                       <div className="text-orange-600 text-xs mt-1 font-medium">↳ Returned for revision</div>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

 const NewStoryForm = () => {
   const [formData, setFormData] = useState({
     headline: '',
     pitch: '',
     character: '',
     accountability: '',
     focus: '',
     publicInterest: ''
   });

   const handleSubmit = async () => {
     if (!formData.headline.trim() || !formData.pitch.trim()) {
       alert('Please fill in both headline and story pitch before submitting');
       return;
     }
     
     setLoading(true);
     
     try {
       // Get AI analysis first
       const aiAnalysis = await mockJournalismAI(formData.pitch, formData.headline);
       
       const newStory = {
         id: stories.length + 1,
         headline: formData.headline,
         pitch: formData.pitch,
         submittedBy: currentUser?.name || 'Current User',
         currentLevel: 2, // Start at Executive Producer level for review
         status: 'pending',
         newsValue: aiAnalysis?.newsValue || 7.0,
         impact: aiAnalysis?.publicInterest?.[0] || 'Medium - affects local community',
         bucket: 'Local Interest',
         character: formData.character || 'Local Official or Community Leader',
         accountabilityAngle: formData.accountability || 'Public interest and community impact',
         timeline: aiAnalysis?.estimatedTimeline || '2-3 weeks',
         urgencyScore: aiAnalysis?.urgencyScore || 5.0,
         legalRisk: aiAnalysis?.legalRisk || 'MEDIUM',
         sourceCount: formData.sources ? formData.sources.split(',').length : 1,
         documentsNeeded: ['Initial research', 'Source interviews'],
         competitorStatus: aiAnalysis?.competitorRisk || 'Unknown',
         daysInPipeline: 0,
         aiInsights: aiAnalysis?.recommendations || ['Story has local relevance'],
         resources: aiAnalysis?.resourcesNeeded || ['Reporter time', 'Basic research'],
         publicInterest: formData.publicInterest || aiAnalysis?.publicInterest?.[0] || 'Medium - affects local community',
         levelHistory: [
           { level: 1, status: 'submitted', feedback: 'Story pitch submitted by reporter', date: new Date().toISOString().split('T')[0], timeSpent: 'completed' },
           { level: 2, status: 'pending', feedback: 'Awaiting Executive Producer review', date: new Date().toISOString().split('T')[0], timeSpent: 'ongoing' }
         ]
       };
       
       setStories([newStory, ...stories]);
       setNewStoryForm(false);
       setFormData({ headline: '', pitch: '', character: '', accountability: '', focus: '', publicInterest: '' });
       setLoading(false);
       
     } catch (error) {
       console.error('Error submitting story:', error);
       setLoading(false);
       alert('Error submitting story. Please try again.');
     }
   };

   return (
     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
         <Camera className="h-5 w-5 mr-2 text-blue-600" />
         Pitch New Story
       </h3>
       
       <div className="space-y-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Story Headline *</label>
           <input
             type="text"
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={formData.headline}
             onChange={(e) => setFormData({...formData, headline: e.target.value})}
             placeholder="Enter a compelling headline for your story"
           />
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Story Pitch *</label>
           <textarea
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             rows={3}
             value={formData.pitch}
             onChange={(e) => setFormData({...formData, pitch: e.target.value})}
             placeholder="Explain your story idea, what you've uncovered, and why it matters"
           />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Key Character</label>
             <input
               type="text"
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={formData.character}
               onChange={(e) => setFormData({...formData, character: e.target.value})}
               placeholder="Who is the main person at the center of this story?"
             />
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Story Focus</label>
             <input
               type="text"
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               value={formData.focus}
               onChange={(e) => setFormData({...formData, focus: e.target.value})}
               placeholder="What specific aspect are you investigating?"
             />
           </div>
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Accountability Angle</label>
           <textarea
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             rows={2}
             value={formData.accountability}
             onChange={(e) => setFormData({...formData, accountability: e.target.value})}
             placeholder="What wrongdoing or accountability issue are you exposing?"
           />
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Public Interest</label>
           <textarea
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             rows={2}
             value={formData.publicInterest}
             onChange={(e) => setFormData({...formData, publicInterest: e.target.value})}
             placeholder="Why should our audience care? What's the impact?"
           />
         </div>
         
         <div className="flex space-x-3">
           <button
             type="button"
             onClick={handleSubmit}
             disabled={loading}
             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <ArrowUp className="h-4 w-4" />
             <span>{loading ? 'Analyzing & Submitting...' : 'Submit Pitch'}</span>
           </button>
           
           <button
             type="button"
             onClick={() => setNewStoryForm(false)}
             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
           >
             Cancel
           </button>
         </div>
       </div>
     </div>
   );
 };

 const UserSelector = () => (
   <div className="bg-white rounded-lg shadow-md p-4 mb-6">
     <div className="flex items-center justify-between mb-3">
       <h3 className="text-sm font-medium text-gray-700">Select Role to Access:</h3>
       {currentUser && (
         <button
           onClick={handleLogout}
           className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
         >
           Logout
         </button>
       )}
     </div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
       {hierarchy.map((user) => (
         <button
           key={user.level}
           onClick={() => setLoginForm(user)}
           disabled={currentUser?.level === user.level}
           className={`p-4 rounded-lg text-left transition-colors ${
             currentUser?.level === user.level 
               ? 'bg-green-100 border-2 border-green-500' 
               : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
           }`}
         >
           <div className="flex items-center justify-between mb-2">
             <div className="font-medium text-gray-900">{user.name}</div>
             {currentUser?.level === user.level ? (
               <CheckCircle className="h-5 w-5 text-green-600" />
             ) : (
               <Shield className="h-5 w-5 text-gray-400" />
             )}
           </div>
           <div className="text-sm text-blue-600 font-medium">{user.title}</div>
           <div className="text-xs text-gray-500">{user.department}</div>
           {user.storiesSubmitted && (
             <div className="text-xs text-green-600 mt-1">{user.storiesSubmitted} stories submitted</div>
           )}
           {user.storiesReviewed && (
             <div className="text-xs text-green-600 mt-1">{user.storiesReviewed} stories reviewed</div>
           )}
           {user.storiesApproved && (
             <div className="text-xs text-green-600 mt-1">{user.storiesApproved} stories approved</div>
           )}
           {currentUser?.level !== user.level && (
             <div className="text-xs text-gray-400 mt-1 flex items-center">
               <Shield className="h-3 w-3 mr-1" />
               PIN Required
             </div>
           )}
           {currentUser?.level === user.level && (
             <div className="text-xs text-green-600 mt-1 flex items-center">
               <CheckCircle className="h-3 w-3 mr-1" />
               Currently Active
             </div>
           )}
         </button>
       ))}
     </div>
   </div>
 );

 const TabNavigation = () => (
   <div className="bg-white rounded-lg shadow-md mb-6">
     <div className="flex border-b border-gray-200">
       {[
         { id: 'pipeline', label: 'Story Pipeline', icon: FileText },
         ...(currentUser?.level === 3 ? [{ id: 'analytics', label: 'Newsroom Analytics', icon: BarChart3 }] : [])
       ].map(tab => (
         <button
           key={tab.id}
           onClick={() => setActiveTab(tab.id)}
           className={`flex items-center space-x-2 px-6 py-3 font-medium ${
             activeTab === tab.id 
               ? 'text-blue-600 border-b-2 border-blue-600' 
               : 'text-gray-600 hover:text-gray-900'
           }`}
         >
           <tab.icon className="h-4 w-4" />
           <span>{tab.label}</span>
         </button>
       ))}
     </div>
   </div>
 );

 const getVisibleStories = () => {
   if (!currentUser) return [];
   
   return stories.filter(story => {
     if (!story || !currentUser) return false;
     if (story.submittedBy === currentUser.name) return true;
     return story.currentLevel >= currentUser.level || 
            (story.levelHistory && story.levelHistory.some(h => h && h.level === currentUser.level));
   });
 };

 const renderTabContent = () => {
   switch(activeTab) {
     case 'analytics':
       // Only show analytics to News Director (level 3)
       if (currentUser?.level !== 3) {
         setActiveTab('pipeline');
         return null;
       }
       return (
         <div>
           <NewsroomDashboard />
           <div className="bg-white rounded-lg shadow-md p-6">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Editorial Performance</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <h4 className="font-medium text-gray-700 mb-3">Pipeline Health</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-600">Stories Pending</span>
                     <span className="font-semibold">{stories.filter(s => s.status === 'pending').length}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-600">Average Sources per Story</span>
                     <span className="font-semibold">{Math.round(stories.reduce((sum, s) => sum + (s.sourceCount || 1), 0) / stories.length)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-600">High Impact Stories</span>
                     <span className="font-semibold text-green-600">{stories.filter(s => s.impact && s.impact.includes('High')).length}</span>
                   </div>
                 </div>
               </div>
               <div>
                 <h4 className="font-medium text-gray-700 mb-3">Risk Assessment</h4>
                 <div className="space-y-3 text-sm">
                   <div className="bg-green-50 p-3 rounded-lg">
                     <div className="font-medium text-green-900">Low Legal Risk</div>
                     <div className="text-green-700">{stories.filter(s => s.legalRisk === 'LOW').length} stories cleared for publication</div>
                   </div>
                   <div className="bg-yellow-50 p-3 rounded-lg">
                     <div className="font-medium text-yellow-900">Source Protection</div>
                     <div className="text-yellow-700">100% confidential sources protected</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       );
     default:
       return (
         <div>
           {currentUser && currentUser.level === 1 && (
             <div className="mb-6">
               {!newStoryForm ? (
                 <button
                   onClick={() => setNewStoryForm(true)}
                   className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                 >
                   <Camera className="h-5 w-5" />
                   <span>Pitch New Story</span>
                 </button>
               ) : (
                 <NewStoryForm />
               )}
             </div>
           )}
           
           {currentUser && (
             <div>
               <h2 className="text-xl font-semibold text-gray-900 mb-4">
                 Editorial Pipeline ({getVisibleStories().length} stories)
               </h2>
               
               {/* Add a notification banner for Executive Producers about their new approval authority */}
               {currentUser.level === 2 && (
                 <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                   <div className="flex items-center space-x-3">
                     <CheckCircle className="h-6 w-6 text-blue-600" />
                     <div>
                       <div className="font-medium text-blue-900">Executive Producer Review Authority</div>
                       <div className="text-sm text-blue-700">You can now approve, request changes, or kill story pitches at your level. Stories you approve will advance to News Director for final approval.</div>
                     </div>
                   </div>
                 </div>
               )}
               
               {getVisibleStories().length === 0 ? (
                 <div className="bg-white rounded-lg shadow-md p-8 text-center">
                   <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-2">No stories in pipeline</h3>
                   <p className="text-gray-600">Submit your first investigation to get started!</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {getVisibleStories().map((story) => (
                     <StoryCard
                       key={story.id}
                       story={story}
                       isExpanded={selectedStory === story.id}
                       onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
                     />
                   ))}
                 </div>
               )}
             </div>
           )}
         </div>
       );
   }
 };

 return (
   <div className="min-h-screen bg-gray-50 p-4">
     <div className="max-w-6xl mx-auto">
       <div className="mb-8">
         <div className="flex items-center space-x-3 mb-2">
           <Mic className="h-8 w-8 text-blue-600" />
           <h1 className="text-3xl font-bold text-gray-900">NewsFlow</h1>
           <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
             Editorial AI
           </div>
         </div>
         <p className="text-gray-600">AI-powered editorial workflow for journalism teams</p>
       </div>
       
       <UserSelector />
       
       {currentUser && (
         <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               <User className="h-5 w-5 text-blue-600" />
               <div>
                 <div className="font-medium text-blue-900">Logged in as {currentUser.name}</div>
                 <div className="text-sm text-blue-700">{currentUser.title} • {currentUser.department}</div>
               </div>
             </div>
             <div className="flex items-center space-x-4">
               <div className="text-right">
                 <div className="text-sm text-blue-600">Editorial Role</div>
                 <div className="font-bold text-blue-900">{currentUser.title}</div>
               </div>
               <Award className="h-8 w-8 text-blue-500" />
             </div>
           </div>
         </div>
       )}
       
       {currentUser && <TabNavigation />}
       
       {currentUser ? renderTabContent() : (
         <div className="bg-white rounded-lg shadow-md p-8 text-center">
           <Mic className="h-16 w-16 text-blue-600 mx-auto mb-4" />
           <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to NewsFlow</h2>
           <p className="text-gray-600 mb-6">Streamline your journalism workflow with AI-powered editorial assistance</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left">
             <div className="bg-blue-50 p-4 rounded-lg">
               <Camera className="h-8 w-8 text-blue-600 mb-2" />
               <h3 className="font-semibold text-blue-900">Smart Story Pitching</h3>
               <p className="text-sm text-blue-700">AI analyzes news value, legal risk, and resource requirements for every pitch</p>
             </div>
             <div className="bg-green-50 p-4 rounded-lg">
               <Shield className="h-8 w-8 text-green-600 mb-2" />
               <h3 className="font-semibold text-green-900">Editorial Oversight</h3>
               <p className="text-sm text-green-700">Streamlined approval workflow from reporter to executive producer to news director</p>
             </div>
             <div className="bg-purple-50 p-4 rounded-lg">
               <Brain className="h-8 w-8 text-purple-600 mb-2" />
               <h3 className="font-semibold text-purple-900">AI Editorial Assistant</h3>
               <p className="text-sm text-purple-700">Get insights on story timing, competitive landscape, and audience impact</p>
             </div>
           </div>
         </div>
       )}
       
       {reviewForm && <ReviewForm story={reviewForm} />}
       {loginForm && <PinLoginForm user={loginForm} />}
     </div>
   </div>
 );
};

export default NewsroomPipeline;
