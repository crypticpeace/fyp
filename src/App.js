"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Heart, BookOpen, Mic, Phone, Home, Activity, UserCheck, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const MentalHealthApp = () => {
  const [currentScreen, setCurrentScreen] = useState('studentDetails');
  const [currentTab, setCurrentTab] = useState('home');
  const [userData, setUserData] = useState({});
  const [moodData, setMoodData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [phq9Score, setPhq9Score] = useState(0);
  const [phq9Answers, setPhq9Answers] = useState(Array(9).fill(0));
  const [currentPHQ9Question, setCurrentPHQ9Question] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [mentalHealthStatus, setMentalHealthStatus] = useState('low');

  // PHQ-9 Questions
  const phq9Questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself or that you are a failure?",
    "Trouble concentrating on things?",
    "Moving or speaking slowly, or being fidgety or restless?",
    "Thoughts that you would be better off dead or hurting yourself?"
  ];

  const phq9Options = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

  // Sample counselor data
  const counselorData = {
    name: "Dr. Sarah Wilson",
    department: "Psychology",
    availability: "Mon-Fri, 9 AM - 5 PM",
    specialization: "Anxiety & Depression",
    rating: 4.8,
    experience: "8 years"
  };

  // Calculate mental health prediction - FIXED
  const calculateMentalHealthPrediction = () => {
    // Ensure moodData exists and has entries with valid mood values
    const validMoodEntries = moodData.filter(entry => entry && typeof entry.mood === 'number' && entry.mood >= 1 && entry.mood <= 5);
    
    const avgMood = validMoodEntries.length > 0 ? 
      validMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) / validMoodEntries.length : 3;
    
    const moodWeight = (5 - avgMood) * 2; // Lower mood = higher risk
    const phq9Weight = phq9Score * 0.5;
    const journalWeight = journalEntries.length < 3 ? 2 : 0; // Low engagement = slight risk
    
    const totalScore = moodWeight + phq9Weight + journalWeight;
    
    if (totalScore >= 15) return 'high';
    if (totalScore >= 8) return 'moderate';
    return 'low';
  };

  useEffect(() => {
    setMentalHealthStatus(calculateMentalHealthPrediction());
  }, [moodData, phq9Score, journalEntries]);

  // Student Details Screen
  const StudentDetailsScreen = () => {
    const [formData, setFormData] = useState({
      name: '', rollNo: '', class: '', department: ''
    });

    const handleSubmit = () => {
      if (formData.name && formData.rollNo && formData.class && formData.department) {
        setUserData(formData);
        setCurrentScreen('main');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
              <p className="text-gray-600 mt-2">Enter your information to get started</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Roll Number"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.rollNo}
                onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
              />
              <input
                type="text"
                placeholder="Class (e.g., BTech 3rd Year)"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
              />
              <select
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Home Dashboard Screen
  const HomeDashboard = () => {
    const features = [
      { icon: Heart, title: 'Mood Tracking', desc: 'Track your daily mood', color: 'from-pink-400 to-red-400', action: () => setCurrentScreen('moodTracking') },
      { icon: BookOpen, title: 'Journaling', desc: 'Write your thoughts', color: 'from-purple-400 to-indigo-400', action: () => setCurrentScreen('journaling') },
      { icon: Activity, title: 'PHQ-9 Assessment', desc: 'Mental health check', color: 'from-green-400 to-blue-400', action: () => setCurrentScreen('phq9') },
      { icon: Phone, title: 'Anonymous Call', desc: 'Talk to someone', color: 'from-yellow-400 to-orange-400', action: () => setCurrentScreen('voiceCall') }
    ];

    const recentMood = moodData.length > 0 ? moodData[moodData.length - 1].mood : null;
    const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto">
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Hello, {userData.name}!</h2>
                <p className="text-gray-600">{userData.department}</p>
                <p className="text-sm text-gray-500">{userData.class} • Roll: {userData.rollNo}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl mb-1">{recentMood ? moodEmojis[recentMood - 1] : '😐'}</div>
                <p className="text-sm text-gray-600">Today's Mood</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-blue-500">{moodData.length}</div>
              <div className="text-xs text-gray-600">Mood Entries</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-green-500">{journalEntries.length}</div>
              <div className="text-xs text-gray-600">Journal Entries</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-purple-500">{phq9Score}</div>
              <div className="text-xs text-gray-600">PHQ-9 Score</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={feature.action}
                className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition duration-300`}
              >
                <feature.icon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Mood Tracking Screen
  const MoodTrackingScreen = () => {
    const [selectedMood, setSelectedMood] = useState(3);
    const [notes, setNotes] = useState('');
    const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
    const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];

    const saveMood = () => {
      const newEntry = {
        date: new Date().toLocaleDateString(),
        mood: selectedMood,
        notes: notes,
        timestamp: Date.now()
      };
      setMoodData([...moodData, newEntry]);
      setSelectedMood(3);
      setNotes('');
      alert('Mood saved successfully!');
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen('main')}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-center mb-6">How are you feeling today?</h2>
            
            {/* Mood Selector */}
            <div className="flex justify-between items-center mb-6">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMood(index + 1)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
                    selectedMood === index + 1 
                      ? 'bg-blue-500 shadow-lg transform scale-110' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <p className="text-center text-lg font-medium text-gray-700 mb-6">
              {moodLabels[selectedMood - 1]}
            </p>

            {/* Notes */}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about your mood?"
              className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={saveMood}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Save Mood Entry
            </button>
          </div>

          {/* Recent Entries */}
          {moodData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Mood History</h3>
              <div className="space-y-3">
                {moodData.slice(-3).reverse().map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                      <div>
                        <p className="font-medium">{moodLabels[entry.mood - 1]}</p>
                        <p className="text-sm text-gray-500">{entry.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Journaling Screen
  const JournalingScreen = () => {
    const [newEntry, setNewEntry] = useState('');
    const [title, setTitle] = useState('');

    const saveJournal = () => {
      if (newEntry.trim()) {
        const entry = {
          id: Date.now(),
          title: title || 'Journal Entry',
          content: newEntry,
          date: new Date().toLocaleDateString(),
          timestamp: Date.now()
        };
        setJournalEntries([...journalEntries, entry]);
        setNewEntry('');
        setTitle('');
        alert('Journal entry saved!');
      }
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen('main')}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-center mb-6">Journal Entry</h2>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Write about your thoughts, feelings, or experiences..."
              className="w-full p-4 border border-gray-300 rounded-lg h-40 resize-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              onClick={saveJournal}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Save Entry
            </button>
          </div>

          {/* Previous Entries */}
          {journalEntries.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Previous Entries</h3>
              <div className="space-y-4">
                {journalEntries.slice(-3).reverse().map((entry, index) => (
                  <div key={index} className="border-l-4 border-purple-400 pl-4 py-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{entry.date}</p>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {entry.content.length > 100 ? entry.content.substring(0, 100) + '...' : entry.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // PHQ-9 Assessment Screen
  const PHQ9Screen = () => {
    const handleAnswer = (score) => {
      const newAnswers = [...phq9Answers];
      newAnswers[currentPHQ9Question] = score;
      setPhq9Answers(newAnswers);

      if (currentPHQ9Question < phq9Questions.length - 1) {
        setCurrentPHQ9Question(currentPHQ9Question + 1);
      } else {
        const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
        setPhq9Score(totalScore);
        alert(`Assessment completed! Your PHQ-9 score: ${totalScore}`);
        setCurrentPHQ9Question(0);
      }
    };

    const progress = (currentPHQ9Question + 1) / phq9Questions.length * 100;

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen('main')}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm text-gray-600">{currentPHQ9Question + 1}/9</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">Mental Health Assessment</h2>
              <p className="text-gray-600">Over the last 2 weeks, how often have you been bothered by:</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <p className="text-lg font-medium text-center text-gray-800">
                {phq9Questions[currentPHQ9Question]}
              </p>
            </div>

            <div className="space-y-3">
              {phq9Options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    <span className="text-sm text-gray-500">{index} points</span>
                  </div>
                </button>
              ))}
            </div>

            {phq9Score > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-center text-green-800 font-medium">
                  Latest PHQ-9 Score: {phq9Score}/27
                </p>
                <p className="text-center text-sm text-green-600 mt-1">
                  {phq9Score <= 4 ? 'Minimal symptoms' : 
                   phq9Score <= 9 ? 'Mild symptoms' :
                   phq9Score <= 14 ? 'Moderate symptoms' :
                   phq9Score <= 19 ? 'Moderately severe symptoms' : 
                   'Severe symptoms'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Voice Call Screen
  const VoiceCallScreen = () => {
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
      let interval;
      if (isCallActive) {
        interval = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isCallActive]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startCall = () => {
      setIsCallActive(true);
      setCallDuration(0);
    };

    const endCall = () => {
      setIsCallActive(false);
      setCallDuration(0);
      alert('Call ended. Remember, you can always reach out for support!');
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen('main')}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold mb-4">Anonymous Support Call</h2>
            <p className="text-gray-600 mb-8">
              Connect with a trained volunteer for anonymous emotional support. 
              Your identity remains completely private.
            </p>

            {!isCallActive ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-green-800 mb-2">Available Support</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 24/7 Crisis Support</li>
                    <li>• Peer Support Volunteers</li>
                    <li>• Professional Counselors</li>
                    <li>• Anonymous & Confidential</li>
                  </ul>
                </div>
                
                <button
                  onClick={startCall}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Start Anonymous Call</span>
                </button>

                <p className="text-xs text-gray-500">
                  Calls are not recorded and your number is never shared
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-100 p-6 rounded-xl">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-green-800 font-semibold">Connected to Support</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{formatTime(callDuration)}</p>
                </div>

                <button
                  onClick={endCall}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition duration-300"
                >
                  End Call
                </button>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>🔒 Your call is anonymous and secure</p>
                  <p>💚 Take your time, we're here to listen</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Mental Health Status Screen
  const MentalHealthStatusScreen = () => {
    const statusColors = {
      low: 'green',
      moderate: 'yellow',
      high: 'red'
    };

    const statusMessages = {
      low: 'You seem to be doing well! Keep up the good habits.',
      moderate: 'You might benefit from some additional support.',
      high: 'Please consider speaking with a counselor soon.'
    };

    // Chart data for mood trend
    const moodChartData = moodData.map((entry, index) => ({
      day: `Day ${index + 1}`,
      mood: entry.mood
    }));

    // Calculate average mood safely
    const validMoodEntries = moodData.filter(entry => entry && typeof entry.mood === 'number');
    const averageMood = validMoodEntries.length > 0 ? 
      (validMoodEntries.reduce((sum, entry) => sum + entry.mood, 0) / validMoodEntries.length).toFixed(1) : 
      '0.0';

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">Mental Health Status</h2>

          {/* Current Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold mb-4 bg-${statusColors[mentalHealthStatus]}-500`}>
                <AlertTriangle className="w-5 h-5 mr-2" />
                {mentalHealthStatus.toUpperCase()} RISK
              </div>
              <p className="text-gray-700">{statusMessages[mentalHealthStatus]}</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-blue-500">{phq9Score}</div>
              <div className="text-sm text-gray-600">PHQ-9 Score</div>
              <div className="text-xs text-gray-500">out of 27</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-purple-500">{averageMood}</div>
              <div className="text-sm text-gray-600">Avg Mood</div>
              <div className="text-xs text-gray-500">last 7 days</div>
            </div>
          </div>

          {/* Mood Trend Chart */}
          {moodData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Mood Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              {mentalHealthStatus === 'high' && (
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Seek Professional Help</p>
                    <p className="text-sm text-red-600">Consider scheduling an appointment with a counselor</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Heart className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Keep Tracking</p>
                  <p className="text-sm text-blue-600">Continue logging your daily mood and thoughts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Activity className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Stay Active</p>
                  <p className="text-sm text-green-600">Regular exercise can improve mental wellbeing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Counselor Screen
  const CounselorScreen = () => {
    const [chatMessages, setChatMessages] = useState([
      { sender: 'counselor', message: 'Hello! I\'m here to help. How are you feeling today?', time: '2:30 PM' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
      if (newMessage.trim()) {
        const userMsg = { sender: 'user', message: newMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
        setChatMessages([...chatMessages, userMsg]);
        setNewMessage('');

        // Auto-reply from counselor (simulate)
        setTimeout(() => {
          const replies = [
            "Thank you for sharing that with me. Can you tell me more about how you're feeling?",
            "I understand this might be difficult to talk about. You're doing great by reaching out.",
            "That sounds challenging. What coping strategies have you tried before?",
            "Your feelings are valid. Let's work together to find some helpful strategies."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          setChatMessages(prev => [...prev, { 
            sender: 'counselor', 
            message: randomReply, 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }]);
        }, 2000);
      }
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto space-y-6">
          {/* Counselor Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{counselorData.name}</h3>
                <p className="text-gray-600">{counselorData.specialization}</p>
                <p className="text-sm text-gray-500">{counselorData.experience} experience</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">⭐ {counselorData.rating}</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">🟢</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Department:</strong> {counselorData.department}</p>
              <p><strong>Available:</strong> {counselorData.availability}</p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <h3 className="font-semibold">Chat with {counselorData.name}</h3>
              <p className="text-sm opacity-90">Secure & Confidential</p>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-800">Emergency Support</h3>
            </div>
            <p className="text-sm text-red-700 mb-3">
              If you're in crisis or having thoughts of self-harm, please reach out immediately:
            </p>
            <div className="space-y-2">
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300">
                🚨 Call Campus Emergency: 911
              </button>
              <button className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-2 rounded-lg transition duration-300">
                📞 Crisis Hotline: 988
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bottom Navigation
  const BottomNavigation = () => {
    if (currentScreen !== 'main') return null;

    const navItems = [
      { icon: Home, label: 'Home', key: 'home' },
      { icon: Activity, label: 'Mental Health', key: 'mentalHealth' },
      { icon: UserCheck, label: 'Counselor', key: 'counselor' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentTab(item.key)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition duration-300 ${
                  currentTab === item.key 
                    ? 'text-blue-500 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main App Logic
  const renderCurrentScreen = () => {
    if (currentScreen === 'studentDetails') {
      return <StudentDetailsScreen />;
    }

    if (currentScreen === 'main') {
      switch (currentTab) {
        case 'home':
          return <HomeDashboard />;
        case 'mentalHealth':
          return <MentalHealthStatusScreen />;
        case 'counselor':
          return <CounselorScreen />;
        default:
          return <HomeDashboard />;
      }
    }

    switch (currentScreen) {
      case 'moodTracking':
        return <MoodTrackingScreen />;
      case 'journaling':
        return <JournalingScreen />;
      case 'phq9':
        return <PHQ9Screen />;
      case 'voiceCall':
        return <VoiceCallScreen />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="font-sans">
      {renderCurrentScreen()}
      <BottomNavigation />
      {currentScreen !== 'studentDetails' && currentScreen !== 'main' && (
        <div className="pb-20" /> // Spacer for bottom navigation
      )}
    </div>
  );
};

export default MentalHealthApp;