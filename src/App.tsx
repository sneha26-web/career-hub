import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Award,
  BookOpen,
  User,
  Calendar,
  FileText,
  BarChart2,
  MessageSquare,
  Clock,
  ArrowRight,
  Upload,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash,
  Play,
  ExternalLink,
  Shield,
  Search,
  Filter,
  Sparkles,
  Send,
  Check,
  RotateCcw,
  Briefcase,
  BookMarked,
  Layers,
  ChevronRight,
  TrendingUp,
  Settings
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

import Navbar from './components/Navbar';
import {
  StudentProfile,
  Assignment,
  Question,
  MockTest,
  Resource,
  JDAnalysisResult,
  ScheduleItem,
  AIScheduleResult
} from './types';
import {
  SAMPLE_QUESTIONS,
  SAMPLE_TESTS,
  SAMPLE_RESOURCES,
  INITIAL_ASSIGNMENTS,
  MOCK_JD_ANALYSIS,
  MOCK_SCHEDULE
} from './data';

export default function App() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('careerhub_is_logged_in');
    return saved === 'true';
  });
  
  const [accounts, setAccounts] = useState<Record<string, { name: string; password?: string }>>(() => {
    const saved = localStorage.getItem('careerhub_user_accounts');
    return saved ? JSON.parse(saved) : {
      'gabriella123@gmail.com': { name: 'Gabriella', password: 'password123' },
      'gabriella': { name: 'Gabriella', password: 'password123' },
      'admin': { name: 'Gabriella', password: 'password123' }
    };
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('careerhub_student_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Gabriella ',
      branch: 'Computer Science and Engineering',
      skills: 'JavaScript, React, CSS, Basic Data Structures',
      targetRole: 'Flexible / All Roles (supports any requirements)',
      resumeName: 'GABRIELLA_RESUME.pdf'
    };
  });

  // Google Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('gabriella123@gmail.com');
  const [googlePass, setGooglePass] = useState('password123');
  const [googleName, setGoogleName] = useState('Gabriella');

  // Current global view tab
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Login variables
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  // Dynamic solving playground states
  const [activeSolvingAsgId, setActiveSolvingAsgId] = useState<string | null>(null);
  const [editorCodes, setEditorCodes] = useState<Record<string, string>>({});
  const [verificationFeedback, setVerificationFeedback] = useState<Record<string, { success: boolean; message: string }>>({});

  // Global search & notifications state
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'info' | 'alert' | 'success' }[]>([
    { id: '1', text: 'Daily schedule Day 2 pending: Practice React forms', type: 'info' },
    { id: '2', text: 'Upcoming Assignment Deadline: DP practice sets', type: 'alert' },
    { id: '3', text: 'Good job! You scored 90% accuracy on Quantitative Reasoning', type: 'success' }
  ]);

  // JD Analysis Module State
  const [jdText, setJdText] = useState('');
  const [jdAnalysisResult, setJdAnalysisResult] = useState<JDAnalysisResult | null>(() => {
    const saved = localStorage.getItem('careerhub_jd_analysis');
    return saved ? JSON.parse(saved) : MOCK_JD_ANALYSIS;
  });
  const [jdAnalyzing, setJdAnalyzing] = useState(false);
  const [jdError, setJdError] = useState('');

  // AI Planner Module State
  const [plannerCompany, setPlannerCompany] = useState('Google');
  const [plannerDate, setPlannerDate] = useState('2026-06-25');
  const [plannerHours, setPlannerHours] = useState('4');
  const [plannerResult, setPlannerResult] = useState<AIScheduleResult | null>(() => {
    const saved = localStorage.getItem('careerhub_active_schedule');
    return saved ? JSON.parse(saved) : MOCK_SCHEDULE;
  });
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerError, setPlannerError] = useState('');

  // Question bank state
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('careerhub_questions');
    if (saved) return JSON.parse(saved);
    // Otherwise seed from sample
    return SAMPLE_QUESTIONS;
  });
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<'all' | 'coding' | 'technical' | 'hr' | 'aptitude'>('all');
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Assignments Tracker State
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('careerhub_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDescription, setNewAsgDescription] = useState('');
  const [newAsgDeadline, setNewAsgDeadline] = useState('');

  // Mock Test State
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [activeTestIndex, setActiveTestIndex] = useState<number>(0);
  const [testChosenAnswers, setTestChosenAnswers] = useState<Record<string, number>>({});
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(0);
  const [testTimerActive, setTestTimerActive] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    score: number;
    total: number;
    accuracy: number;
    weakAreas: string[];
    suggestions: string;
  } | null>(null);

  // Free resources search
  const [resourceCategory, setResourceCategory] = useState<'all' | 'programming' | 'aiml' | 'career'>('all');

  // Floating chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hi! I am your CareerHub Coach. Ask me any doubts about binary search, resume keywords, system designs, or your active placement roadmap.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Analytics dynamic logs state
  const [analyticsLogs, setAnalyticsLogs] = useState<{ day: string; hours: number; score: number }[]>([
    { day: 'Mon', hours: 3, score: 75 },
    { day: 'Tue', hours: 5, score: 80 },
    { day: 'Wed', hours: 4, score: 70 },
    { day: 'Thu', hours: 6, score: 90 },
    { day: 'Fri', hours: 2, score: 85 },
    { day: 'Sat', hours: 4, score: 95 },
    { day: 'Sun', hours: 5, score: 90 }
  ]);
  const [newLogHours, setNewLogHours] = useState('3');
  const [newLogDay, setNewLogDay] = useState('Mon');

  // Save profile, assignments, questions, jd analytics, planners on edits
  useEffect(() => {
    localStorage.setItem('careerhub_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('careerhub_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('careerhub_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (jdAnalysisResult) {
      localStorage.setItem('careerhub_jd_analysis', JSON.stringify(jdAnalysisResult));
    }
  }, [jdAnalysisResult]);

  useEffect(() => {
    if (plannerResult) {
      localStorage.setItem('careerhub_active_schedule', JSON.stringify(plannerResult));
    }
  }, [plannerResult]);

  // Active testing countdown timer effect
  useEffect(() => {
    let intervalId: any;
    if (testTimerActive && testTimeRemaining > 0) {
      intervalId = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            setTestTimerActive(false);
            submitMockTestManual();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [testTimerActive, testTimeRemaining]);

  // Formatter for mock countdown timer
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock handlers
  const handleProfileFieldChange = (field: keyof StudentProfile, val: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      [field]: val
    }));
  };

  const simulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const name = e.target.files[0].name;
      setStudentProfile((prev) => ({
        ...prev,
        resumeName: name
      }));
      addNotification(`Resume ${name} uploaded successfully and parsed into profile!`, 'success');
    }
  };

  const addNotification = (text: string, type: 'info' | 'alert' | 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [
      { id, text, type },
      ...prev.slice(0, 5) // Keep only 6 most recent
    ]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = loginUsername.trim().toLowerCase();
    
    if (isSignup) {
      if (!loginName || !loginUsername || !loginPassword) {
        addNotification("Please satisfy all field credentials.", "alert");
        return;
      }
      
      const newAccounts = {
        ...accounts,
        [cleanUsername]: { name: loginName, password: loginPassword }
      };
      setAccounts(newAccounts);
      localStorage.setItem('careerhub_user_accounts', JSON.stringify(newAccounts));
      
      setStudentProfile((prev) => ({
        ...prev,
        name: loginName,
        skills: 'JavaScript, React, CSS, Basic Data Structures',
      }));
      
      localStorage.setItem('careerhub_is_logged_in', 'true');
      setIsLoggedIn(true);
      setCurrentTab('dashboard');
      addNotification(`Welcome, ${loginName}! Account fully initialized & password registered safely.`, 'success');
    } else {
      if (!loginUsername || !loginPassword) {
        addNotification("Ensure Username & Password fields are specified.", "alert");
        return;
      }
      
      const acc = accounts[cleanUsername];
      if (acc && acc.password === loginPassword) {
        setStudentProfile((prev) => ({
          ...prev,
          name: acc.name,
        }));
        localStorage.setItem('careerhub_is_logged_in', 'true');
        setIsLoggedIn(true);
        setCurrentTab('dashboard');
        addNotification(`Glad to have you back, ${acc.name}!`, 'success');
      } else if (cleanUsername === 'admin' && loginPassword === 'password123') {
        const dummyName = 'Gabriella';
        setStudentProfile((prev) => ({
          ...prev,
          name: dummyName,
        }));
        localStorage.setItem('careerhub_is_logged_in', 'true');
        setIsLoggedIn(true);
        setCurrentTab('dashboard');
        addNotification(`Unlocked with administrative master identity.`, 'success');
      } else {
        addNotification("Credentials verification failed. Please try again or create an account below!", "alert");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('careerhub_is_logged_in', 'false');
    setLoginUsername('');
    setLoginPassword('');
    setLoginName('');
    setCurrentTab('landing');
    addNotification("Logged out from CareerHub. You or your friend can now log in!", "info");
  };

  // Run user code block directly in sandbox
  const handleRunCode = (asg: Assignment) => {
    const code = editorCodes[asg.id] !== undefined ? editorCodes[asg.id] : (asg.placeholderCode || '');
    try {
      // Recreate user's function block dynamically
      const fullCode = `${code}\nreturn ${asg.functionName};`;
      const fn = new Function(fullCode)();
      
      if (typeof fn !== 'function') {
        throw new Error(`Could not find declared function "${asg.functionName}" in your code submission.`);
      }
      
      if (!asg.testCases || asg.testCases.length === 0) {
        // Simple success if no explicit test cases
        setAssignments((prev) =>
          prev.map((item) => (item.id === asg.id ? { ...item, status: 'completed' } : item))
        );
        addNotification(`Solved: "${asg.title}" right here!`, 'success');
        return;
      }
      
      // Run test cases
      for (let i = 0; i < asg.testCases.length; i++) {
        const tc = asg.testCases[i];
        // Deep copy the input list
        const inputClones = JSON.parse(JSON.stringify(tc.input));
        const result = fn(...inputClones);
        
        const resultJSON = JSON.stringify(result);
        const expectedJSON = JSON.stringify(tc.expected);
        
        if (resultJSON !== expectedJSON) {
          setVerificationFeedback((prev) => ({
            ...prev,
            [asg.id]: {
              success: false,
              message: `❌ Test Case ${i + 1} Failed.\nInput: ${JSON.stringify(tc.input[0])}\nExpected: ${expectedJSON}\nGot: ${resultJSON}`
            }
          }));
          return;
        }
      }
      
      // Success! Auto-completed and auto-ticked
      setVerificationFeedback((prev) => ({
        ...prev,
        [asg.id]: {
          success: true,
          message: `🎉 All ${asg.testCases.length} Test Cases Passed! Assignment completed & progress auto-ticked successfully.`
        }
      }));
      
      // Auto toggle assignment status to completed
      setAssignments((prev) =>
        prev.map((item) => (item.id === asg.id ? { ...item, status: 'completed' } : item))
      );
      addNotification(`Bravo! Solved: "${asg.title}" with clean logical passing bounds!`, 'success');
      
    } catch (err: any) {
      setVerificationFeedback((prev) => ({
        ...prev,
        [asg.id]: {
          success: false,
          message: `⚠️ Syntax / Runtime Error:\n${err.message || err.toString()}`
        }
      }));
    }
  };

  const handleGoogleLoginSimulate = () => {
    setGoogleModalOpen(true);
  };

  // Real backend integration: Analyze Job Description
  const handleAnalyzeJD = async () => {
    if (!jdText.trim()) {
      setJdError('Please paste a readable Job Description first.');
      return;
    }
    setJdAnalyzing(true);
    setJdError('');
    try {
      const response = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: jdText })
      });
      if (!response.ok) {
        throw new Error('Server returned internal analysis error.');
      }
      const data = await response.json();
      setJdAnalysisResult(data);
      addNotification('Job Description analyzed! Check recommended questions and preparation roadmap.', 'success');
    } catch (e: any) {
      console.error(e);
      setJdError('Failed connection or key missing. Falling back to robust sample analysis.');
      // Local dynamic customized generator based on standard JD
      setJdAnalysisResult(MOCK_JD_ANALYSIS);
    } finally {
      setJdAnalyzing(false);
    }
  };

  // Real backend integration: Generate Schedule
  const handleGenerateSchedule = async () => {
    if (!plannerCompany.trim()) {
      setPlannerError('Specify your target company first.');
      return;
    }
    setPlannerLoading(true);
    setPlannerError('');
    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: plannerCompany,
          date: plannerDate,
          hours: parseInt(plannerHours) || 4
        })
      });
      if (!response.ok) {
        throw new Error('Server program generation error.');
      }
      const data = await response.json();
      setPlannerResult(data);
      addNotification(`Generated customized schedule for ${plannerCompany}!`, 'success');
    } catch (e: any) {
      console.error(e);
      setPlannerError('Could not construct online AI timeline. Rendered responsive study parameters instead.');
      setPlannerResult(MOCK_SCHEDULE);
    } finally {
      setPlannerLoading(false);
    }
  };

  // Real backend integration: AI Chat
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatMessage;
    if (!textToSend.trim()) return;

    const userBubble = { role: 'user' as const, text: textToSend };
    setChatHistory((p) => [...p, userBubble]);
    if (!customText) setChatMessage('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory.slice(-6) // Send recent message chain context
        })
      });
      if (!response.ok) {
        throw new Error('API communication error');
      }
      const data = await response.json();
      setChatHistory((p) => [...p, { role: 'model', text: data.text }]);
    } catch (e: any) {
      console.error(e);
      // Offline smart fallback
      setTimeout(() => {
        setChatHistory((p) => [...p, {
          role: 'model',
          text: `Offline model reply: Let us focus on standard DS/Algorithms or placements tips. For instance, did you know that the STAR method stands for: Situation, Task, Action, and Result? Practicing this structure is the fastest way to get hired.`
        }]);
      }, 500);
    } finally {
      setChatLoading(false);
    }
  };

  // Questions Bank practicing
  const togglePracticeQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updatedState = !q.practiced;
          addNotification(
            updatedState ? `Completed: "${q.title}"` : `Marked incomplete: "${q.title}"`,
            updatedState ? 'success' : 'info'
          );
          return { ...q, practiced: updatedState };
        }
        return q;
      })
    );
  };

  // Assignments
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;
    const newAsg: Assignment = {
      id: Date.now().toString(),
      title: newAsgTitle,
      description: newAsgDescription,
      deadline: newAsgDeadline || '2026-06-30',
      status: 'pending'
    };
    setAssignments((p) => [newAsg, ...p]);
    setNewAsgTitle('');
    setNewAsgDescription('');
    setNewAsgDeadline('');
    addNotification(`Added Assignment: "${newAsg.title}"`, 'success');
  };

  const toggleAssignmentStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === id) {
          const nextState = asg.status === 'pending' ? 'completed' : 'pending';
          addNotification(
            nextState === 'completed' ? `Completed assignment: "${asg.title}"` : `Set pending: "${asg.title}"`,
            nextState === 'completed' ? 'success' : 'info'
          );
          return { ...asg, status: nextState };
        }
        return asg;
      })
    );
  };

  const deleteAssignment = (id: string, name: string) => {
    setAssignments((prev) => prev.filter((asg) => asg.id !== id));
    addNotification(`Removed assignment: "${name}"`, 'info');
  };

  // Mock exam start
  const startExam = (test: MockTest) => {
    setActiveTest(test);
    setActiveTestIndex(0);
    setTestChosenAnswers({});
    setTestResult(null);
    setTestTimeRemaining(test.durationMinutes * 60);
    setTestTimerActive(true);
    addNotification(`Started Examination: "${test.title}"! Answer under timed countdown.`, 'info');
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setTestChosenAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitMockTestManual = () => {
    if (!activeTest) return;
    setTestTimerActive(false);

    let score = 0;
    activeTest.questions.forEach((q) => {
      if (testChosenAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const total = activeTest.questions.length;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

    // Analyze weak areas & suggestions
    const weakAreas: string[] = [];
    const targetCategory = activeTest.category.toLowerCase();
    if (accuracy < 50) {
      weakAreas.push('Core foundational syntax & performance bounds');
      weakAreas.push('Logical speed estimation');
    } else if (accuracy < 80) {
      weakAreas.push('Edge-case error handling and analytical complexities');
    } else {
      weakAreas.push('No critical weak areas noted! Ready for direct corporate interviews.');
    }

    const suggestions = accuracy < 60
      ? 'Focus thoroughly on learning standard documentation, reviewing DSA cheatsheets, and utilizing the step-by-step previous questions spoilers'
      : 'Excellent core setup. Continue practicing simulated HR mock questions and record your time metrics.';

    setTestResult({
      score,
      total,
      accuracy,
      weakAreas,
      suggestions
    });

    // Save this test score historically to the analytics logs
    const formattedDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    setAnalyticsLogs((prev) => [
      ...prev.slice(1),
      { day: formattedDay, hours: 4, score: accuracy }
    ]);

    addNotification(`Test submitted. Your score: ${score}/${total} (${accuracy}% accuracy)`, 'success');
  };

  // Filter previous questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(questionSearch.toLowerCase()) ||
                          q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) ||
                          q.explanation.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesCategory = questionCategoryFilter === 'all' || q.category === questionCategoryFilter;
    const matchesDifficulty = questionDifficultyFilter === 'all' || q.difficulty === questionDifficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate dynamic stats
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'pending').length;
  const completedAssignmentsCount = assignments.filter((a) => a.status === 'completed').length;
  const totalAssignmentsCount = assignments.length;
  const assignmentProgressPercent = totalAssignmentsCount > 0
    ? Math.round((completedAssignmentsCount / totalAssignmentsCount) * 100)
    : 0;

  const totalQuestionsDone = questions.filter((q) => q.practiced).length;
  const qProgressPercent = questions.length > 0
    ? Math.round((totalQuestionsDone / questions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Top Banner alert */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-slate-100 text-xs py-1 px-4 text-center font-medium font-sans flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        Prepare Smarter. Analyze JDs instantly, practice online MCQ tests, and chat live with Gemini Coach!
      </div>

      {/* Dynamic Navigation */}
      {isLoggedIn && (
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} studentName={studentProfile.name} onLogout={handleLogout} />
      )}

      {/* Main Content Containers */}
      <main className="pb-24">
        
        {/* LOGGED OUT VIEW - Authentication screen overlay */}
        {!isLoggedIn ? (
          <div className="relative min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
            {/* Ambient Nebula Gradients Backdrop */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            
            {/* Dynamic Grid Overlay Backdrop */}
            <div className="absolute inset-0 bg-[#070C15]" style={{
              backgroundImage: `radial-gradient(ellipse at center, transparent 30%, #070C15 90%), url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%231E293B' fill-opacity='.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>

            <div className="relative z-15 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Side: CareerHub Visual Backdrop with Floating Interface Widgets */}
              <div className="lg:col-span-6 space-y-8 text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Student Accelerator Engine v2.0
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Secure Placement with <br />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                      CareerHub Workspace
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
                    An ecosystem crafted to track mock algorithms progress, audit ATS keywords matches, simulate precise timed test rooms, and refine profiles programmatically.
                  </p>
                </div>

                {/* Simulated Floating widgets representing CareerHub backdrop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Widget 1 */}
                  <div className="bg-[#0D1525]/80 backdrop-blur-md border border-slate-800/80 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-xl hover:border-slate-700/80 transition-all">
                    <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">ATS Score Peak</div>
                      <div className="text-sm font-extrabold text-slate-100">93% Keywords Match</div>
                    </div>
                  </div>

                  {/* Widget 2 */}
                  <div className="bg-[#0D1525]/80 backdrop-blur-md border border-slate-800/80 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-xl hover:border-slate-700/80 transition-all">
                    <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Dynamic Practice</div>
                      <div className="text-sm font-extrabold text-slate-100">All Tests Unlocked</div>
                    </div>
                  </div>

                  {/* Widget 3 */}
                  <div className="bg-[#0D1525]/80 backdrop-blur-md border border-slate-800/80 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-xl hover:border-slate-700/80 transition-all sm:col-span-2">
                    <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">AI Daily Timetable</span>
                        <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">Active Block</span>
                      </div>
                      <div className="text-xs text-slate-300 font-sans">Practice DP Algorithms & Solve ATS Keyword Assignment</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>🔒 Secure Single Sandbox Container</span>
                  <span>v2026.06</span>
                </div>
              </div>

              {/* Right Side: Glassmorphic Entry Credentials Card */}
              <div className="lg:col-span-6 bg-[#0B101D]/75 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 sm:p-10 shadow-2xl relative">
                
                {/* Visual Accent Corner Highlights */}
                <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-l from-blue-500 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-indigo-500 to-transparent"></div>

                <div className="max-w-md mx-auto w-full text-left">
                  <span className="text-xs text-blue-400 uppercase font-bold tracking-widest block mb-1 font-sans">
                    Authentication Gate
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
                    {isSignup ? "Create Student Account" : "Access Your Workspace"}
                  </h2>

                  <form onSubmit={handleLogin} className="space-y-4 font-sans">
                    {isSignup && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Student Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Gabriella"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            className="w-full bg-[#070911] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Username / Student Email
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gabriella_k or gabriella123@gmail.com"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full bg-[#070911] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Password Key
                        </label>
                        {!isSignup && (
                          <button
                            type="button"
                            onClick={() => alert("Simulated password recovery sent to: " + (loginUsername ? `@${loginUsername}` : "provided credentials"))}
                            className="text-xs text-blue-400 hover:underline hover:text-blue-300 cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#070911] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white font-bold py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-600/10 active:scale-[0.98] cursor-pointer"
                    >
                      {isSignup ? "Set Password & Create Account" : "Access Workspace"}
                    </button>
                  </form>

                  <div className="relative my-6.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800/80"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#0B101D] px-2 text-slate-500">Or alternate third party</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoogleLoginSimulate}
                    className="w-full bg-[#070911] hover:bg-slate-900 border border-slate-800 text-slate-200 font-sans py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:border-slate-700"
                  >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#34A853"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.63-.16-1.17-.48-1.52-.84H5.84z"
                      />
                      <path
                        fill="#4285F4"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google Secure Single Sign-In</span>
                  </button>

                  <div className="text-center mt-6">
                    <button
                      onClick={() => setIsSignup(!isSignup)}
                      className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none font-semibold"
                    >
                      {isSignup ? "🔑 Already registered? Sign In here" : "✨ Don't have an account? Sign Up & set custom password"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* LOGGED IN WORKSPACE CONTAINER */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            
            {/* 1. LANDING PAGE & DISCOVERY HERO TAB */}
            {currentTab === 'landing' && (
              <div className="space-y-12">
                
                {/* Hero Slate Section */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E3A8A]/30 border border-slate-800/80 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
                  
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                  <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
                      <Sparkles className="w-3.5 h-3.5" /> Next Gen Career Accelerator
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                      Prepare Smarter.<br/>
                      <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Get Hired Faster.
                      </span>
                    </h1>
                    
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                      One structured, premium placement dashboard. Analyze corporate Job Descriptions instantly, create smart schedules, take timed exams, and track assignments seamlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                      <button
                        onClick={() => setCurrentTab('dashboard')}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-base shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        Start Preparing
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <button
                        onClick={() => setCurrentTab('resources')}
                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold rounded-2xl text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Explore Resources
                      </button>
                    </div>
                  </div>

                  {/* High Quality Student Dashboard Preview Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto relative z-10">
                    
                    <div
                      onClick={() => setCurrentTab('tests')}
                      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-6 rounded-2xl text-left transition-all hover:scale-[1.03] shadow hover:shadow-indigo-500/5 cursor-pointer flex flex-col justify-between h-40"
                    >
                      <Brain className="w-8 h-8 text-indigo-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">Mock Assessments</h4>
                        <p className="text-slate-400 text-xs">Run timed MCQ coding exams & analyze results</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setCurrentTab('practice')}
                      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-6 rounded-2xl text-left transition-all hover:scale-[1.03] shadow hover:shadow-blue-500/5 cursor-pointer flex flex-col justify-between h-40"
                    >
                      <Award className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">Previous Q&As</h4>
                        <p className="text-slate-400 text-xs text-ellipsis">Practice algorithmic and HR questions</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setCurrentTab('analytics')}
                      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-6 rounded-2xl text-left transition-all hover:scale-[1.03] shadow hover:shadow-emerald-500/5 cursor-pointer flex flex-col justify-between h-40"
                    >
                      <Layers className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">Study Tracker</h4>
                        <p className="text-slate-400 text-xs">Check learning curves & completed stats</p>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setIsChatOpen(true);
                        setCurrentTab('landing');
                      }}
                      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 p-6 rounded-2xl text-left transition-all hover:scale-[1.03] shadow hover:shadow-purple-500/5 cursor-pointer flex flex-col justify-between h-40"
                    >
                      <MessageSquare className="w-8 h-8 text-purple-400 animate-pulse" />
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">AI Assistant Coach</h4>
                        <p className="text-slate-400 text-xs">Ask concepts or request DSA roadmaps</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Placement Journey Flow */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">Structured Placement Roadmap</h2>
                    <p className="text-slate-400 text-sm mt-1">Four key phases matching top university structures.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl relative">
                      <span className="absolute top-4 right-4 text-3xl font-bold font-sans text-slate-800">01</span>
                      <h4 className="font-bold text-white text-base mb-2">Build Profile</h4>
                      <p className="text-sm text-slate-400">Initialize core metrics, target job title, and link active documents.</p>
                    </div>
                    <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl relative">
                      <span className="absolute top-4 right-4 text-3xl font-bold font-sans text-slate-800">02</span>
                      <h4 className="font-bold text-white text-base mb-2">Analyze Job description</h4>
                      <p className="text-sm text-slate-400">Paste job requirements, extract core skills, coding topics, and advice.</p>
                    </div>
                    <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl relative">
                      <span className="absolute top-4 right-4 text-3xl font-bold font-sans text-slate-800">03</span>
                      <h4 className="font-bold text-white text-base mb-2">Practice & Planner</h4>
                      <p className="text-sm text-slate-400">Generate 5-day schedules and answer previous company questions.</p>
                    </div>
                    <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl relative">
                      <span className="absolute top-4 right-4 text-3xl font-bold font-sans text-slate-800">04</span>
                      <h4 className="font-bold text-white text-base mb-2">Assess & Succeed</h4>
                      <p className="text-sm text-slate-400">Take automated simulated test countdowns before target interviews.</p>
                    </div>
                  </div>
                </div>

                {/* Global Stats bar */}
                <div className="bg-[#0B1528] rounded-2xl border border-blue-900/30 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <span className="text-3xl font-extrabold text-blue-400 font-sans">{questions.length}+</span>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Vetted Questions</p>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-indigo-400 font-sans">{qProgressPercent}%</span>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Answers Completed</p>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-purple-400 font-sans">{assignments.length}</span>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Pending Homeworks</p>
                  </div>
                  <div>
                    <span className="text-3xl font-extrabold text-emerald-400 font-sans">Active</span>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Gemini Model Mode</p>
                  </div>
                </div>

              </div>
            )}

            {/* 2. STUDENT DASHBOARD & JD ANALYSER */}
            {currentTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Profile Card Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" /> Student Profile
                    </h3>

                    <div className="space-y-4 font-sans">
                      <div>
                        <label className="text-xs text-slate-400 uppercase font-semibold">Student Name</label>
                        <input
                          type="text"
                          value={studentProfile.name}
                          onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 uppercase font-semibold">Branch/Major</label>
                        <input
                          type="text"
                          value={studentProfile.branch}
                          onChange={(e) => handleProfileFieldChange('branch', e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 uppercase font-semibold">Target Corporate Role</label>
                        <input
                          type="text"
                          value={studentProfile.targetRole}
                          onChange={(e) => handleProfileFieldChange('targetRole', e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 uppercase font-semibold">Acknowledge Skills (Comma Separated)</label>
                        <textarea
                          rows={3}
                          value={studentProfile.skills}
                          onChange={(e) => handleProfileFieldChange('skills', e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none mt-1 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Resume Document (.pdf, .doc)</label>
                        {studentProfile.resumeName ? (
                          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                            <span className="truncate">{studentProfile.resumeName}</span>
                            <button
                              onClick={() => handleProfileFieldChange('resumeName', '')}
                              className="text-red-400 hover:text-red-300 transition-colors ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-xl py-6 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors">
                            <Upload className="w-6 h-6 mb-2 text-slate-500" />
                            <span className="text-xs font-semibold">Upload Student Resume</span>
                            <span className="text-[10px] text-slate-500 mt-1">PDF or DOCX max 5MB</span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc"
                              onChange={simulateResumeUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Complete Action Panel helper */}
                  <div className="bg-[#0C1222] border border-indigo-950 p-6 rounded-2xl">
                    <h4 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Study Tip</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      "Pasting the exact candidate requirements from a job posting into the JD module aligns you closer with the core technologies target recruiters scan for automatically using screening algorithms."
                    </p>
                  </div>
                </div>

                {/* Job Description Upload & Analysis Results */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-500" /> Job Description Upload Module
                    </h3>
                    <p className="text-slate-400 text-xs mb-4">
                      Paste a corporate job posting block below to automatically analyze required technical skills, generate tailored question banks, and map a custom 3-phase study roadmap using server intelligence.
                    </p>

                    <div className="space-y-4">
                      <textarea
                        rows={6}
                        placeholder="Paste the target job description text here... (e.g. Seeking a Frontend Developer comfortable with TypeScript, React hooks, API routing, Tailwind css, and general user experience layouts...)"
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        className="w-full bg-[#090D16] border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 placeholder-slate-650 outline-none resize-none font-mono"
                      />

                      <div className="flex flex-col gap-4">
                        <div className="text-left">
                          <label className="text-[11px] font-bold text-slate-450 uppercase tracking-wider block mb-2">
                            ✨ Quick Seed Role Templates (Flexible & Multi-disclinary)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setJdText(`Role: Full Stack Developer
Key requirements:
- Design performance-focused backend REST API web servers using Node.js & Express.
- Build clean component layouts, interactive dashboards, and grids in React with Tailwind CSS.
- Keep data persistent using modern SQL databases and optimize schema indices.`);
                                addNotification("Seeded Full Stack Developer template", "info");
                              }}
                              className="bg-[#0B1220] hover:bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 hover:border-slate-705"
                            >
                              💻 Full Stack Dev
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setJdText(`Role: Data Analyst
Key requirements:
- Mine analytical data using advanced SQL aggregates, joins, and database tables.
- Formulate high-impact report dashboards in Tableau and Power BI.
- Clean complex telemetry datasets using Python (Pandas, NumPy) and review statistics.`);
                                addNotification("Seeded Data Analyst template", "info");
                              }}
                              className="bg-[#0B1220] hover:bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 hover:border-slate-705"
                            >
                              📈 Data Analyst
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setJdText(`Role: Prompt Engineer & GenAI Specialist
Key requirements:
- Design system prompts and models recipes for Large Language Models (LLMs).
- Interlink LangChain retrieval augmented generation pipelines with vector database embeddings.
- Inspect and refine model execution temperature, check hallucination gaps, and prevent injection attacks.`);
                                addNotification("Seeded Prompt Engineer template", "info");
                              }}
                              className="bg-[#0B1220] hover:bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 hover:border-slate-705"
                            >
                              🧠 Prompt Engineer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setJdText(`Role: Product Manager
Key requirements:
- Write detailed Product Requirement Documents (PRDs) and plan user sprint roadmaps.
- Analyze daily active metrics, optimize onboarding conversion scores, and size backlogs using RICE rules.
- Team up with product engineering leads through daily agile sprint and scrum assemblies.`);
                                addNotification("Seeded Product Manager template", "info");
                              }}
                              className="bg-[#0B1220] hover:bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 hover:border-slate-705"
                            >
                              🎯 Product Manager
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setJdText("");
                              addNotification("Clear input", "info");
                            }}
                            className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                          >
                            Clear Input
                          </button>

                        <button
                          onClick={handleAnalyzeJD}
                          disabled={jdAnalyzing}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {jdAnalyzing ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Analyzing JD...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              Analyze Requirements
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {jdError && (
                    <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      {jdError}
                    </div>
                  )}
                </div>

                  {/* Job Analysis Outputs */}
                  {jdAnalysisResult && (
                    <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <h4 className="text-white font-bold text-base flex items-center gap-2">
                          <Check className="w-5 h-5 text-emerald-400 bg-emerald-500/10 p-1 rounded" /> Requirements Analysis Results
                        </h4>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
                          Successfully Extracted
                        </span>
                      </div>

                      {/* Recommend Skills Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                            Extracted Technical Skills Required
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {jdAnalysisResult.skillsRequired.map((skill, i) => (
                              <span
                                key={i}
                                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 px-3 py-1.5 rounded-xl font-medium transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                            Core Coding Concepts To Learn
                          </h5>
                          <ul className="text-xs text-slate-300 space-y-2">
                            {jdAnalysisResult.topicsToLearn.map((topic, i) => (
                              <li key={i} className="flex items-center gap-2.5">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Tailored Interview Q&A Spoilers */}
                      <div className="pt-4 border-t border-slate-800">
                        <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                          Tailored Interview Questions mapping this role
                        </h5>
                        <div className="space-y-4">
                          {jdAnalysisResult.interviewQuestions.map((iq, i) => (
                            <div key={i} className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                                  {iq.category} question
                                </span>
                                <span className="text-[10px] text-slate-500">Tailored Q {i + 1}</span>
                              </div>
                              <h6 className="text-sm font-bold text-slate-200">
                                {iq.question}
                              </h6>
                              <details className="group mt-2">
                                <summary className="text-xs text-slate-400 hover:text-white cursor-pointer select-none font-bold outline-none flex items-center gap-1.5 list-none">
                                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-open:rotate-90 transition-transform" />
                                  Reveal Placement Suggested Answer
                                </summary>
                                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg mt-2 leading-relaxed border border-slate-850">
                                  {iq.answer}
                                </p>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom 3-Phase Roadmap progress */}
                      <div className="pt-4 border-t border-slate-800">
                        <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">
                          Generated Placement Preparation Roadmap
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {jdAnalysisResult.roadmap.map((road, i) => (
                            <div key={i} className="bg-gradient-to-b from-slate-900 to-[#0A0D16] border border-slate-800 rounded-2xl p-4 space-y-2 text-left relative">
                              <div className="text-xs text-slate-400 font-bold">{road.duration}</div>
                              <h6 className="font-bold text-white text-sm">{road.phase}</h6>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {road.description}
                              </p>
                              <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 p-1 rounded text-[10px] font-bold uppercase">
                                P{i + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources reference links */}
                      {jdAnalysisResult.resources && jdAnalysisResult.resources.length > 0 && (
                        <div className="pt-4 border-t border-slate-800">
                          <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
                            Tailored Extra Learning Paths
                          </h5>
                          <div className="flex flex-wrap gap-4">
                            {jdAnalysisResult.resources.map((res, i) => (
                              <a
                                key={i}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {res.title} ({res.type})
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>
            )}

            {/* 3. PREVIOUS QUESTIONS BANK */}
            {currentTab === 'practice' && (
              <div className="space-y-6">
                
                {/* Intro Headers */}
                <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      <Award className="w-6 h-6 text-blue-500" /> Previous Placement Questions Bank
                    </h2>
                    <p className="text-slate-400 text-xs">
                      Study compiled actual interview and coding questions. Reveal solutions, inspect logic patterns and tick progress boxes.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center min-w-[200px]">
                    <div className="text-lg font-extrabold text-blue-400">{totalQuestionsDone} / {questions.length} Completed</div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all" style={{ width: `${qProgressPercent}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <div className="relative w-full md:w-auto md:flex-1">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search questions title or answer keyword..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-end">
                    <div className="flex items-center gap-2 text-xs">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-450 font-bold uppercase">Category</span>
                      <select
                        value={questionCategoryFilter}
                        onChange={(e: any) => setQuestionCategoryFilter(e.target.value)}
                        className="bg-[#0F172A] border border-slate-800 text-slate-300 rounded-lg p-1.5 focus:border-blue-500 outline-none text-xs"
                      >
                        <option value="all">All Category</option>
                        <option value="coding">Coding Problems</option>
                        <option value="technical">Technical Concept</option>
                        <option value="hr">HR & Behavior</option>
                        <option value="aptitude">Quant Aptitude</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-450 font-bold uppercase">Difficulty</span>
                      <select
                        value={questionDifficultyFilter}
                        onChange={(e: any) => setQuestionDifficultyFilter(e.target.value)}
                        className="bg-[#0F172A] border border-slate-800 text-slate-300 rounded-lg p-1.5 focus:border-blue-500 outline-none text-xs"
                      >
                        <option value="all">All Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Question Grid List */}
                <div className="space-y-4">
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q) => {
                      const isExpanded = expandedQuestion === q.id;
                      return (
                        <div
                          key={q.id}
                          className={`bg-[#0F172A] border rounded-2xl p-5 hover:border-slate-750 transition-all ${
                            q.practiced ? 'border-emerald-500/20 bg-emerald-950/5' : 'border-slate-850'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2.5">
                                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded ${
                                  q.category === 'coding' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                  q.category === 'technical' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                  q.category === 'hr' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                  'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                                }`}>
                                  {q.category}
                                </span>

                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  q.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/10' :
                                  q.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10' :
                                  'text-red-400 bg-red-500/10'
                                }`}>
                                  {q.difficulty}
                                </span>
                              </div>

                              <h3 className="text-base font-bold text-white leading-tight">
                                {q.title}
                              </h3>
                            </div>

                            <button
                              id={`practice-btn-${q.id}`}
                              onClick={() => togglePracticeQuestion(q.id)}
                              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold transition-all border shrink-0 cursor-pointer ${
                                q.practiced
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-slate-900 text-slate-350 border-slate-800 hover:bg-slate-850'
                              }`}
                            >
                              {q.practiced ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Completed
                                </>
                              ) : (
                                "Practice Done"
                              )}
                            </button>
                          </div>

                          <p className="text-slate-350 text-xs my-4 leading-relaxed font-mono whitespace-pre-wrap bg-[#05080E] p-4 rounded-xl border border-slate-900">
                            {q.questionText}
                          </p>

                          <div className="mt-3.5 pt-3.5 border-t border-slate-900 flex justify-between items-center">
                            <button
                              onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 outline-none cursor-pointer"
                            >
                              {isExpanded ? "Hide Solutions" : "Reveal Professional Solutions"}
                            </button>
                            <span className="text-[10px] text-slate-550">Practice count reference: 2.1k views</span>
                          </div>

                          {/* Dynamic Spoiler block */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-slate-900 bg-slate-950/80 p-4 rounded-xl space-y-4">
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Suggested Solution</h4>
                                <pre className="bg-[#05080E] text-blue-300 text-xs p-3.5 rounded-lg overflow-x-auto font-mono max-h-72 border border-slate-850">
                                  <code>{q.solution}</code>
                                </pre>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Conceptual Explanation</h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-[#0F172A] border border-slate-850 rounded-2xl p-16 text-center">
                      <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h4 className="font-bold text-white text-base">No matching questions found</h4>
                      <p className="text-slate-400 text-xs max-w-sm mx-auto mt-1">
                        Try modifying search keyword variables or switching filter dropdown options.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 4. MOCK TEST PLATFORM */}
            {currentTab === 'tests' && (
              <div className="space-y-6">
                
                {/* Headers and test selectors */}
                {!activeTest ? (
                  <div className="space-y-6">
                    <div className="bg-[#0F172A] border border-slate-850 rounded-2xl p-6">
                      <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-indigo-500" /> Online Placements Mock Tests
                      </h2>
                      <p className="text-slate-400 text-xs">
                        Prepare for actual interview pressure by tackling timed multiple-choice questionnaires covering frontend, algorithmic, system architectures, and quant logic.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {SAMPLE_TESTS.map((test) => (
                        <div
                          key={test.id}
                          className="bg-[#0F172A] border border-slate-850 hover:border-slate-750 p-6 rounded-2xl shadow-lg transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full font-bold">
                                {test.category}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                {test.durationMinutes} mins
                              </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mt-1">
                              {test.title}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Contains {test.questions.length} highly targeted expert quantitative MCQs. Result outputs suggest weak zones.
                            </p>
                          </div>

                          <div className="pt-6 mt-6 border-t border-slate-900 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">4 questions total</span>
                            <button
                              onClick={() => startExam(test)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
                            >
                              <Play className="w-3.5 h-3.5" /> Start Timed MCQ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* THE ACTIVE TEST TAKING CONSOLE WRAPPER */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Test questions console */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Active Status bar */}
                      <div className="bg-[#0F172A] border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-sans font-bold">Active Quiz</div>
                          <h4 className="text-sm font-semibold text-white truncate max-w-sm">{activeTest.title}</h4>
                        </div>
                        <div className="bg-red-500/15 border border-red-500/30 text-rose-400 font-mono text-base font-bold px-4 py-1.5 rounded-lg flex items-center gap-2">
                          <Clock className="w-4 h-4 animate-spin text-rose-400" />
                          {formatTimer(testTimeRemaining)}
                        </div>
                      </div>

                      {/* Question card */}
                      <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 relative">
                        <div className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-3 font-sans">
                          Question {activeTestIndex + 1} of {activeTest.questions.length}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-100 font-sans mb-6">
                          {activeTest.questions[activeTestIndex].text}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3 font-sans">
                          {activeTest.questions[activeTestIndex].options.map((opt, oIdx) => {
                            const isChosen = testChosenAnswers[activeTest.questions[activeTestIndex].id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => selectAnswer(activeTest.questions[activeTestIndex].id, oIdx)}
                                className={`w-full text-left p-4 rounded-xl text-sm transition-all border flex items-center justify-between cursor-pointer ${
                                  isChosen
                                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                                    : 'bg-slate-900 hover:bg-[#131A2E] border-slate-850 text-slate-300'
                                }`}
                              >
                                <span>
                                  <span className="font-bold text-slate-400 mr-2 uppercase">{String.fromCharCode(97 + oIdx)}.</span>
                                  {opt}
                                </span>
                                {isChosen && <CheckCircle className="w-4.5 h-4.5 text-blue-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question Navigation footer actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setActiveTestIndex((prev) => Math.max(0, prev - 1))}
                          disabled={activeTestIndex === 0}
                          className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs px-4 py-2 rounded-xl text-slate-400 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          Previous Question
                        </button>

                        <div className="hidden sm:flex items-center gap-1.5">
                          {activeTest.questions.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveTestIndex(i)}
                              className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer ${
                                activeTestIndex === i
                                  ? 'bg-blue-600 text-white'
                                  : testChosenAnswers[activeTest.questions[i].id] !== undefined
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'bg-slate-900 text-slate-500 border border-slate-950'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        {activeTestIndex < activeTest.questions.length - 1 ? (
                          <button
                            onClick={() => setActiveTestIndex((prev) => prev + 1)}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
                          >
                            Next Question
                          </button>
                        ) : (
                          <button
                            onClick={submitMockTestManual}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4.5 py-2 rounded-xl font-bold transition-colors cursor-pointer shadow"
                          >
                            Submit Assessment
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Test diagnostics stats sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl">
                        <h4 className="text-sm font-bold text-white mb-3">Assessment Progress</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Answered Questions:</span>
                            <span className="font-bold text-white">
                              {Object.keys(testChosenAnswers).length} / {activeTest.questions.length}
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${(Object.keys(testChosenAnswers).length / activeTest.questions.length) * 100}%` }}
                            ></div>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to quit the current exam? Progress will not be registered.")) {
                                setActiveTest(null);
                                setTestTimerActive(false);
                              }
                            }}
                            className="w-full bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 font-bold py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Quit Assessment
                          </button>
                        </div>
                      </div>

                      {/* Display results inline immediately when submitted */}
                      {testResult && (
                        <div className="bg-[#0E221B] border border-emerald-900/40 p-6 rounded-2xl space-y-4 shadow-xl">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <h4 className="font-bold text-white text-sm">Exam Diagnostic Results</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center bg-emerald-950/30 p-2.5 rounded-xl">
                              <div className="text-xs text-emerald-400 font-semibold font-sans">Accuracy</div>
                              <span className="text-xl font-sans font-bold text-white">{testResult.accuracy}%</span>
                            </div>
                            <div className="text-center bg-emerald-950/30 p-2.5 rounded-xl">
                              <div className="text-xs text-emerald-400 font-semibold font-sans">Score</div>
                              <span className="text-xl font-sans font-bold text-white">{testResult.score}/{testResult.total}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 text-left">Weak Zones Detected</div>
                            <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 text-left">
                              {testResult.weakAreas.map((area, idx) => (
                                <li key={idx}>{area}</li>
                              ))}
                            </ul>
                          </div>

                          <p className="text-[11px] text-slate-300 italic border-t border-emerald-900/30 pt-2.5 leading-relaxed text-left">
                            <strong>Note:</strong> {testResult.suggestions}
                          </p>

                          <button
                            onClick={() => {
                              setActiveTest(null);
                              setTestResult(null);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors text-center cursor-pointer"
                          >
                            Return to Tests Panel
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* 5. PREPARATION PLANNER */}
            {currentTab === 'planner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Custom target input form */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-500" /> AI Scheduler Variables
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed block">
                      Instruct Gemini Coach to dynamically write a day 1-to-day 5 technical and non-technical training schedule tailored to your dream company parameters.
                    </p>

                    <div className="space-y-4 font-sans">
                      <div>
                        <label className="text-xs text-slate-450 uppercase font-semibold block mb-1">Target Tech Firm</label>
                        <input
                          type="text"
                          placeholder="e.g. Google, Microsoft, Meta"
                          value={plannerCompany}
                          onChange={(e) => setPlannerCompany(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 hover:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-450 uppercase font-semibold block mb-1">Placement/Interview Calendar Date</label>
                        <input
                          type="date"
                          value={plannerDate}
                          onChange={(e) => setPlannerDate(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 hover:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-450 uppercase font-semibold block mb-1">Committed Daily Practice Hours</label>
                        <select
                          value={plannerHours}
                          onChange={(e) => setPlannerHours(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 hover:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 outline-none"
                        >
                          <option value="2">2 Hours / Day</option>
                          <option value="4">4 Hours / Day</option>
                          <option value="6">6 Hours / Day (Extensive Bootcamp)</option>
                          <option value="8">8 Hours / Day (Supercharged Placement Week)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleGenerateSchedule}
                        disabled={plannerLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-855 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {plannerLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Creating Plan...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" /> Generate 5-Day Program
                          </>
                        )}
                      </button>
                    </div>

                    {plannerError && (
                      <div className="p-3 bg-red-400/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                        {plannerError}
                      </div>
                    )}
                  </div>

                  {/* Notification Center */}
                  <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl shadow-lg space-y-4">
                    <h4 className="text-sm font-bold text-white">Interactive Reminder log</h4>
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                            notif.type === 'success' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' :
                            notif.type === 'alert' ? 'bg-rose-500/5 text-rose-400 border-rose-500/10' :
                            'bg-blue-500/5 text-blue-400 border-blue-500/10'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0"></div>
                          <span className="leading-relaxed text-left">{notif.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Day-by-Day schedule layout and Calendar review */}
                <div className="lg:col-span-8 space-y-6">
                  {plannerResult && (
                    <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                        <div>
                          <span className="text-xs text-blue-400 uppercase font-bold">ACTIVE ASSIGNMENT ROAD</span>
                          <h4 className="text-base font-bold text-white">Custom Program: Day 1 - Day 5 for {plannerCompany}</h4>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          Target Goal Date: {plannerDate}
                        </span>
                      </div>

                      {/* Day Grid timeline */}
                      <div className="space-y-4">
                        {plannerResult.schedule.map((dayItem, dIdx) => (
                          <div key={dayItem.day} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 hover:border-slate-750 transition-all text-left">
                            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-3.5">
                              <span className="font-sans font-bold text-white text-base flex items-center gap-2">
                                <span className="bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                  {dayItem.day}
                                </span>
                                Preparation Day {dayItem.day}
                              </span>
                              <input
                                type="checkbox"
                                checked={dayItem.completed || false}
                                onChange={() => {
                                  // toggle complete locally
                                  if (plannerResult) {
                                    const nextSched = plannerResult.schedule.map((item) => {
                                      if (item.day === dayItem.day) {
                                        const togg = !item.completed;
                                        addNotification(
                                          togg ? `Succeed day ${item.day} objectives!` : `Restarted day ${item.day}`,
                                          togg ? 'success' : 'info'
                                        );
                                        return { ...item, completed: togg };
                                      }
                                      return item;
                                    });
                                    setPlannerResult({
                                      ...plannerResult,
                                      schedule: nextSched
                                    });
                                  }
                                }}
                                className="w-5 h-5 accent-blue-600 rounded border-slate-800 cursor-pointer"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Topics */}
                              <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Study Core Areas</div>
                                {dayItem.topics.map((t, tIdx) => (
                                  <div key={tIdx} className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                                    {t}
                                  </div>
                                ))}
                              </div>

                              {/* Tasks */}
                              <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Complete Dynamic Exercises</div>
                                {dayItem.tasks.map((taskStr, taskIdx) => (
                                  <div key={taskIdx} className="text-xs text-slate-400 flex items-center gap-2 italic">
                                    <span className="w-1 h-3 bg-purple-500/50 rounded shrink-0"></span>
                                    {taskStr}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* placement core recommendations rules */}
                      <div className="bg-indigo-950/20 border border-indigo-900/30 p-5 rounded-2xl space-y-3">
                        <h5 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">
                          Recruiter Placement Advice from Coach
                        </h5>
                        <ul className="text-xs text-slate-350 space-y-2">
                          {plannerResult.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-relaxed">
                              <span>🌟</span>
                              <span className="text-left">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 6. ASSIGNMENTS TRACKER */}
            {currentTab === 'assignments' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Add dynamic form */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl space-y-4 text-left">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" /> Add Placement Assignment
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed block">
                      Pin upcoming college assessments, mock homework tasks, resume draft checkpoints, or coding sets to monitor your pipeline.
                    </p>

                    <form onSubmit={handleAddAssignment} className="space-y-4 font-sans">
                      <div>
                        <label className="text-xs text-slate-450 uppercase font-semibold block mb-1">Assessment / Goal Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Master DP Knapsack or review SQL rules"
                          value={newAsgTitle}
                          onChange={(e) => setNewAsgTitle(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 hover:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-450 uppercase font-semibold block mb-1">Description</label>
                        <textarea
                          rows={3}
                          placeholder="Problem references, notes, links or codes..."
                          value={newAsgDescription}
                          onChange={(e) => setNewAsgDescription(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 hover:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-450 uppercase font-semibold block mb-1">Absolute Deadline</label>
                        <input
                          type="date"
                          value={newAsgDeadline}
                          onChange={(e) => setNewAsgDeadline(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 hover:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 outline-none font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Pin Assignment
                      </button>
                    </form>
                  </div>

                  {/* Summary progress circle */}
                  <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl text-center">
                    <span className="text-xs text-slate-400 font-bold uppercase block mb-3">Goal Completion Rate</span>
                    
                    {/* Visual metric representation */}
                    <div className="inline-flex items-center justify-center relative mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="46" stroke="#1E293B" strokeWidth="10" fill="transparent" />
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          stroke="#2563EB"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 46}
                          strokeDashoffset={2 * Math.PI * 46 * (1 - assignmentProgressPercent / 100)}
                        />
                      </svg>
                      <div className="absolute font-sans font-extrabold text-xl text-white">
                        {assignmentProgressPercent}%
                      </div>
                    </div>

                    <div className="flex justify-around text-xs text-slate-400 mt-2 font-sans">
                      <div>
                        <span className="font-extrabold text-rose-400 block">{pendingAssignmentsCount}</span>
                        Pending
                      </div>
                      <div className="border-r border-slate-800"></div>
                      <div>
                        <span className="font-extrabold text-emerald-450 block">{completedAssignmentsCount}</span>
                        Completed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment lists tabs columns */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl space-y-4 text-left">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h4 className="text-white font-bold text-base">Active Assignment Tracker</h4>
                      <span className="text-xs text-slate-350">{assignments.length} total objectives registered</span>
                    </div>

                    <div className="space-y-4 font-sans">
                      {assignments.length > 0 ? (
                        assignments.map((asg) => {
                          const isSolving = activeSolvingAsgId === asg.id;
                          const currentCode = editorCodes[asg.id] !== undefined
                            ? editorCodes[asg.id]
                            : (asg.placeholderCode || '');
                          const feedback = verificationFeedback[asg.id];

                          return (
                            <div
                              key={asg.id}
                              className={`p-5 rounded-2xl border transition-all flex flex-col gap-4 ${
                                asg.status === 'completed'
                                  ? 'bg-emerald-950/10 border-emerald-500/20 text-[#A1A1AA]'
                                  : 'bg-[#090E17]/95 border-slate-800 text-slate-200 hover:border-slate-700/80'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1.5 md:flex-1">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`asg-checkbox-${asg.id}`}
                                      checked={asg.status === 'completed'}
                                      onChange={() => toggleAssignmentStatus(asg.id)}
                                      className="w-4.5 h-4.5 rounded border-slate-800 accent-blue-600 cursor-pointer text-blue-500"
                                    />
                                    <h4 className={`text-sm font-bold ${asg.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                      {asg.title}
                                    </h4>
                                  </div>

                                  {asg.description && (
                                    <p className="text-xs text-slate-400 leading-relaxed pl-6">
                                      {asg.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-3 pl-6 pt-1 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1 font-medium">
                                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                      Deadline: {asg.deadline}
                                    </span>
                                    
                                    {new Date(asg.deadline) < new Date() && asg.status === 'pending' && (
                                      <span className="text-rose-400 uppercase font-extrabold tracking-wider bg-rose-500/10 px-1.5 py-0.5 rounded text-[9px]">
                                        Overdue!
                                      </span>
                                    )}

                                    {asg.functionName && (
                                      <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                        Interactive Code Sandbox Block
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                  {asg.functionName && (
                                    <button
                                      onClick={() => setActiveSolvingAsgId(isSolving ? null : asg.id)}
                                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                                        isSolving
                                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                                          : 'bg-[#151D30] hover:bg-slate-800 text-slate-200 border border-slate-800'
                                      }`}
                                    >
                                      {isSolving ? 'Close Editor' : 'Solve with Code Block'}
                                    </button>
                                  )}
                                  
                                  <button
                                    id={`del-asg-${asg.id}`}
                                    onClick={() => deleteAssignment(asg.id, asg.title)}
                                    className="text-xs text-rose-400 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 p-2 rounded-xl cursor-pointer shrink-0 transition-colors"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Interactive active code playground section */}
                              {isSolving && asg.functionName && (
                                <div className="mt-2 p-4 bg-[#05080E] border border-slate-800 rounded-xl space-y-3 text-left">
                                  <div className="flex justify-between items-center bg-[#0C1222] px-3 py-2 rounded-lg border border-slate-900">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                      <span className="text-[10px] font-mono text-slate-500 uppercase ml-2 select-none tracking-widest font-bold">
                                        javascript workspace - {asg.functionName}()
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditorCodes((prev) => ({
                                          ...prev,
                                          [asg.id]: asg.placeholderCode || ''
                                        }));
                                        setVerificationFeedback((prev) => {
                                          const copy = { ...prev };
                                          delete copy[asg.id];
                                          return copy;
                                        });
                                      }}
                                      className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors font-mono uppercase bg-[#141D30] px-2 py-1 rounded cursor-pointer"
                                    >
                                      Reset Template Code
                                    </button>
                                  </div>

                                  <div className="relative">
                                    <textarea
                                      rows={10}
                                      value={currentCode}
                                      onChange={(e) => {
                                        setEditorCodes((prev) => ({
                                          ...prev,
                                          [asg.id]: e.target.value
                                        }));
                                      }}
                                      className="w-full bg-[#05080E] text-blue-200 p-4 rounded-xl border border-slate-800 hover:border-slate-700 focus:border-blue-500/80 outline-none font-mono text-xs leading-relaxed resize-y shadow-inner block"
                                    />
                                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 select-none font-mono">
                                      UTF-8 | JAVASCRIPT
                                    </div>
                                  </div>

                                  {/* Feedback Status Alert */}
                                  {feedback && (
                                    <div className={`p-3.5 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed border ${
                                      feedback.success
                                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                                        : 'bg-rose-950/40 border-rose-500/30 text-rose-450'
                                    }`}>
                                      {feedback.message}
                                    </div>
                                  )}

                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                                    <div className="text-[10px] text-slate-500 max-w-md leading-normal">
                                      💡 <strong>Interactive Auto-Tick:</strong> Clicking "Run & Validate solution" runs test scripts to check accuracy. If successful, progress mark checks itself automatically.
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRunCode(asg)}
                                      className="bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10 self-end sm:self-auto cursor-pointer"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                      Run & Validate solution
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 text-center text-slate-500">
                          No assignments on board. Create one to stay trackable!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 7. FREE RESOURCES INDEX */}
            {currentTab === 'resources' && (
              <div className="space-y-6">
                
                {/* Discovery resources title and filter */}
                <div className="bg-[#0F172A] border border-slate-850 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Free Curriculum Resources Library</h2>
                    <p className="text-slate-400 text-xs">
                      Curated tutorials, dynamic cheatsheets, official guides and visual maps chosen to support placement bootcamps.
                    </p>
                  </div>

                  <div className="flex bg-[#05080E] p-1.5 rounded-xl border border-slate-850 font-sans gap-1 shrink-0 text-xs">
                    {(['all', 'programming', 'aiml', 'career'] as const).map((catName) => (
                      <button
                        key={catName}
                        onClick={() => setResourceCategory(catName)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                          resourceCategory === catName
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {catName.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource library maps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {SAMPLE_RESOURCES
                    .filter((res) => resourceCategory === 'all' || res.category === resourceCategory)
                    .map((res) => (
                      <div
                        key={res.id}
                        className="bg-[#0F172A] border border-slate-850 hover:border-slate-750 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Visual thumbnail banner mockup */}
                          <div className={`h-36 ${res.thumbnail} p-5 flex flex-col justify-between text-white relative`}>
                            <div className="text-[10px] uppercase font-bold tracking-widest bg-black/30 backdrop-blur-sm self-start px-2 py-0.5 rounded">
                              {res.category}
                            </div>
                            
                            <BookMarked className="w-10 h-10 text-white/80 self-end" />
                          </div>

                          <div className="p-5 space-y-2">
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block font-sans">
                              {res.type} resource
                            </span>
                            <h4 className="font-bold text-white text-base leading-tight">
                              {res.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {res.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-slate-900 mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-medium">Free Access</span>
                          <button
                            onClick={() => {
                              window.open(res.url, '_blank');
                              addNotification(`Opened article reference: "${res.title}"`, 'info');
                            }}
                            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-blue-400" /> Watch / Read
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* 8. STUDY TRACKING / ANALYTICS */}
            {currentTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Stats cards summary */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Enter daily logs manually */}
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl space-y-4 text-left">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" /> Log Preparation Effort
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed block">
                      Manually track candidate practice hours per day or log test updates to update interactive chart bars.
                    </p>

                    <div className="space-y-3 font-sans">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Weekday Log</label>
                        <select
                          value={newLogDay}
                          onChange={(e) => setNewLogDay(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none"
                        >
                          <option value="Mon">Monday</option>
                          <option value="Tue">Tuesday</option>
                          <option value="Wed">Wednesday</option>
                          <option value="Thu">Thursday</option>
                          <option value="Fri">Friday</option>
                          <option value="Sat">Saturday</option>
                          <option value="Sun">Sunday</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Hours Spent Studying</label>
                        <input
                          type="number"
                          min="1"
                          max="24"
                          value={newLogHours}
                          onChange={(e) => setNewLogHours(e.target.value)}
                          className="w-full bg-[#090D16] border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          const hrs = parseFloat(newLogHours) || 3;
                          setAnalyticsLogs((prev) =>
                            prev.map((log) => {
                              if (log.day === newLogDay) {
                                return { ...log, hours: hrs };
                              }
                              return log;
                            })
                          );
                          addNotification(`Logged ${hrs} preparation hours on ${newLogDay}!`, 'success');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Log Study Progress
                      </button>
                    </div>
                  </div>

                  {/* Highlights Summary widget */}
                  <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl text-left space-y-4">
                    <h4 className="text-sm font-bold text-white">Daily Learning Metrics</h4>
                    
                    <div className="space-y-3 font-sans">
                      <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                        <div>
                          <div className="text-[10.5px] uppercase font-bold text-slate-400">Total study logs</div>
                          <span className="text-base font-extrabold text-blue-400 font-sans">29 Hours</span>
                        </div>
                        <span className="text-xs text-slate-500">Weekly Sum</span>
                      </div>

                      <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                        <div>
                          <div className="text-[10.5px] uppercase font-bold text-slate-400">Average accuracy rating</div>
                          <span className="text-base font-extrabold text-emerald-400 font-sans">82.8% Accuracy</span>
                        </div>
                        <span className="text-xs text-slate-500">MCQ Mock Avg</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Live analytical charts with Recharts */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Daily practice hours LineChart */}
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl text-left">
                    <h4 className="font-bold text-white text-base mb-1">Weekly Learning Curve</h4>
                    <p className="text-slate-400 text-xs mb-6">Visual display tracking candidate commit hours mapped across days.</p>

                    <div className="h-64 sm:h-80 w-full bg-[#05080E] rounded-xl p-4 border border-slate-900">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsLogs}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                            labelStyle={{ color: '#F1F5F9' }}
                          />
                          <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Study Hours" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Mock test performance trends BarChart */}
                  <div className="bg-[#0F172A] rounded-2xl border border-slate-850 p-6 shadow-xl text-left">
                    <h4 className="font-bold text-white text-base mb-1 font-sans">Mock Assessments Scores History</h4>
                    <p className="text-slate-400 text-xs mb-6">Percentage assessment index recorded across standard simulation sequences.</p>

                    <div className="h-64 sm:h-80 w-full bg-[#05080E] rounded-xl p-4 border border-slate-900 animate-fade-in">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsLogs}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                            labelStyle={{ color: '#F1F5F9' }}
                          />
                          <Bar dataKey="score" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} name="Score (Acc)%" maxBarSize={35}>
                            <defs>
                              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FLOATING AI CHATBOT SYSTEM - Collapsible Console in bottom right */}
      <div className="fixed bottom-6 right-6 z-40 font-sans">
        
        {/* Trigger Button widget */}
        {!isChatOpen ? (
          <button
            id="chat-toggle-open"
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:scale-105 hover:from-blue-500 hover:to-purple-500 text-white rounded-full p-4 shadow-2xl flex items-center gap-2.5 transition-all cursor-pointer font-bold select-none border border-white/10 group"
          >
            <MessageSquare className="w-5 h-5 animate-pulse text-white group-hover:rotate-12 transition-transform" />
            <span className="text-sm pr-1">Ask Placement Coach</span>
            <span className="w-2.5 h-2.5 bg-emerald-450 rounded-full inline-block border-[1.5px] border-indigo-900 animate-ping absolute top-0.5 right-0.5"></span>
          </button>
        ) : (
          /* FLOATING CHAT CONSOLE CARD */
          <div className="w-[340px] sm:w-[380px] h-[500px] bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Header branding */}
            <div className="bg-gradient-to-r from-slate-900 to-[#121B35] p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600/20 text-blue-400 p-1.5 rounded-lg border border-blue-500/20">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">CareerHub Coach</h4>
                  <span className="text-[10px] text-emerald-400 block font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                    Gemini 3.5 Active
                  </span>
                </div>
              </div>

              <button
                id="chat-toggle-close"
                onClick={() => setIsChatOpen(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>

            {/* Simulated preset quick actions prompts */}
            <div className="bg-[#090D16] border-b border-slate-850 p-2 flex flex-nowrap overflow-x-auto gap-1.5 scrollbar-thin">
              <button
                onClick={() => handleSendMessage("Explain binary search")}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded px-2.5 py-1 shrink-0 transition-colors"
              >
                Explain Binary Search
              </button>
              <button
                onClick={() => handleSendMessage("Give me DSA roadmap")}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded px-2.5 py-1 shrink-0 transition-colors"
              >
                DSA Roadmap
              </button>
              <button
                onClick={() => handleSendMessage("How to prepare for interview?")}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded px-2.5 py-1 shrink-0 transition-colors"
              >
                Resume Help
              </button>
            </div>

            {/* Bubble logs container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] text-xs p-3 rounded-2xl leading-relaxed text-left whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-[#10172A] border border-slate-850 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing loader anim */}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/40 p-3 rounded-2xl rounded-tl-none max-w-[80%] border border-slate-850 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input console */}
            <div className="p-3 border-t border-slate-800 bg-[#0F172A] flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask DSA query or search tips..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-[#090D16] border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
              <button
                id="do-send-message"
                onClick={() => handleSendMessage()}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Google authentication flow and password-setting wizard */}
        {googleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#0B101D] border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
              
              {/* Google Logo Header */}
              <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.63-.16-1.17-.48-1.52-.84H5.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="text-base font-extrabold text-white">Google Identity Integration</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Secure Authorization</p>
                </div>
              </div>

              <p className="text-slate-350 text-xs mb-4 leading-relaxed">
                Verify mock Google access token credentials below and choose/set your workspace security password key to initialize.
              </p>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Google Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full bg-[#070911] border border-slate-800 text-slate-205 rounded-xl px-3 py-2 outline-none focus:border-blue-500 font-medium"
                    placeholder="Google Account Name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full bg-[#070911] border border-slate-800 text-slate-205 rounded-xl px-3 py-2 outline-none focus:border-blue-500 font-medium"
                    placeholder="email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-blue-400">
                    🔑 Set Your Workspace Password
                  </label>
                  <input
                    type="password"
                    required
                    value={googlePass}
                    onChange={(e) => setGooglePass(e.target.value)}
                    className="w-full bg-[#070911] border border-slate-800 text-slate-205 rounded-xl px-3 py-2 outline-none focus:border-blue-500 font-medium font-mono"
                    placeholder="Choose security key"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1 leading-normal">
                    You can sign in directly using this email/username and secure password key next time.
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setGoogleModalOpen(false)}
                    className="flex-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanEmail = googleEmail.trim().toLowerCase();
                      if (!googleEmail || !googlePass || !googleName) {
                        addNotification("Please key in valid credentials", "alert");
                        return;
                      }
                      
                      // Register Account
                      const updated = {
                        ...accounts,
                        [cleanEmail]: { name: googleName, password: googlePass }
                      };
                      setAccounts(updated);
                      localStorage.setItem('careerhub_user_accounts', JSON.stringify(updated));

                      // Set student state
                      setStudentProfile((prev) => ({
                        ...prev,
                        name: googleName,
                      }));
                      
                      localStorage.setItem('careerhub_is_logged_in', 'true');
                      setIsLoggedIn(true);
                      setGoogleModalOpen(false);
                      setCurrentTab('dashboard');
                      addNotification(`Authenticated as '${googleName}' via Google. Workspace password registered successfully!`, "success");
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Set Password & Link
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
