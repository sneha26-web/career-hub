import { Question, MockTest, Resource, Assignment, JDAnalysisResult, AIScheduleResult } from './types';

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'coding',
    difficulty: 'medium',
    title: 'Two Sum Problem',
    questionText: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    solution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    explanation: 'We use a Hash Map to store the indices of numbers we have seen so far. For each number, we look up its complement (target - current_number) in our map. If it exists, we have found the pair and return their indices. This operates in O(N) time complexity and O(N) space complexity.'
  },
  {
    id: 'q2',
    category: 'coding',
    difficulty: 'hard',
    title: 'Merge K Sorted Lists',
    questionText: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    solution: `// Using a Min-Heap or Divide and Conquer
function mergeKLists(lists: ListNode[]): ListNode | null {
  if (lists.length === 0) return null;
  while (lists.length > 1) {
    const temp: ListNode[] = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i+1] : null;
      temp.push(mergeTwoLists(l1, l2));
    }
    lists = temp;
  }
  return lists[0];
}`,
    explanation: 'We can achieve this using a divide-and-conquer approach. We repeatedly merge pairs of sorted lists until only one list remains. This eliminates the need for extra heap space and completes in O(N log k) time, where N is the total nodes and k is the number of lists.'
  },
  {
    id: 'q3',
    category: 'technical',
    difficulty: 'easy',
    title: 'What is Database Normalization?',
    questionText: 'Explain the concept of Database Normalization and discuss 1NF, 2NF, and 3NF.',
    solution: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.',
    explanation: '1NF (First Normal Form) ensures that each table cell contains atomic (single-valued) values and there are no repeating groups. 2NF requires the table to be in 1NF and all non-key attributes must depend fully on the primary key (no partial dependencies). 3NF requires the table to be in 2NF and has no transitive dependencies (non-key fields relying on other non-key fields).'
  },
  {
    id: 'q4',
    category: 'technical',
    difficulty: 'medium',
    title: 'Explain Promises and Async/Await in JavaScript',
    questionText: 'What is the event-loop mechanism, and how do Promises and Async/Await fit into it?',
    solution: 'Promises are objects representing the eventual completion (or failure) of an asynchronous operation, while async/await is a syntax sugar that makes working with promise chains simpler and synchronous-looking.',
    explanation: 'When an async task is initialized, it is offloaded to the browser/System runtime. Upon completion, its callback is placed in the microtask queue (for promises) or the macrotask queue (for setTimeouts). The event loop constantly polls the call stack, clearing microtasks first before proceeding to macrotasks.'
  },
  {
    id: 'q5',
    category: 'hr',
    difficulty: 'easy',
    title: 'Tell Me About Yourself',
    questionText: 'How would you structure a professional elevator pitch for recruiters during high-stakes placements?',
    solution: 'Structure response around: Present (Current role/academic status), Past (Internship/projects milestones), and Future (Why this specific role and company aligns with your trajectory).',
    explanation: 'Spend 20% on your academics and background, 50% on your key technical projects or internship experience, and 30% explaining why you are passionate about this role. Avoid reciting your resume; instead, sell a cohesive narrative of progression.'
  },
  {
    id: 'q6',
    category: 'hr',
    difficulty: 'easy',
    title: 'Why should we hire you?',
    questionText: 'Recruiter asks this to see how your skills map directly to their pain points or requirements.',
    solution: 'Connect your relevant technical strengths, proactive problem-solving mindset, and personal commitment to the company goals.',
    explanation: 'Demonstrate alignment by citing 2 specific requirements from their job description (e.g. quick adaptivity, React mastery) and proving how you applied them in past assignments or internships. It demonstrates preparedness and confidence.'
  },
  {
    id: 'q7',
    category: 'aptitude',
    difficulty: 'medium',
    title: 'Work and Time Problem',
    questionText: 'A can complete a piece of work in 10 days, and B can complete the same work in 15 days. They work together for 4 days. What fraction of the work is left?',
    solution: 'Fraction of work left = 1/6 of the work.',
    explanation: "A's 1-day work = 1/10. B's 1-day work = 1/15. Together, 1-day work = (1/10 + 1/15) = 5/30 = 1/6. In 4 days, they complete: 4 * (1/6) = 2/3 of the work. Therefore, remaining work = 1 - 2/3 = 1/3."
  },
  {
    id: 'q8',
    category: 'aptitude',
    difficulty: 'easy',
    title: 'Profit and Loss Problem',
    questionText: 'An article is bought for $120 and sold for $150. Calculate the profit percentage.',
    solution: 'Profit Percentage = 25%.',
    explanation: 'Cost Price (CP) = $120. Selling Price (SP) = $150. Profit = SP - CP = $30. Profit percentage = (Profit / CP) * 100 = (30 / 120) * 100 = 0.25 * 100 = 25%.'
  }
];

export const SAMPLE_TESTS: MockTest[] = [
  {
    id: 'test-1',
    title: 'Frontend engineer Practice Assessment',
    category: 'Technical & Coding',
    durationMinutes: 10,
    questions: [
      {
        id: 'mq1',
        text: 'Which React hook should be preferred to save a heavy calculation result from unnecessary recalculations?',
        options: ['useEffect', 'useMemo', 'useRef', 'useCallback'],
        correctAnswer: 1
      },
      {
        id: 'mq2',
        text: 'What is the CSS Display value that lets grid templates configure automatically using fractions?',
        options: ['flex', 'inline', 'grid', 'viewport'],
        correctAnswer: 2
      },
      {
        id: 'mq3',
        text: 'What will be the output of console.log(typeof null) in standard ECMAScript?',
        options: ['"null"', '"undefined"', '"constant"', '"object"'],
        correctAnswer: 3
      },
      {
        id: 'mq4',
        text: 'Which status code is returned by a server to indicate that the requested resource has permanently moved?',
        options: ['301 Moved Permanently', '404 Not Found', '200 OK', '500 Internal Error'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'test-2',
    title: 'Quantitative Aptitude and Logical Reasoning',
    category: 'Aptitude & Analysis',
    durationMinutes: 15,
    questions: [
      {
        id: 'mq5',
        text: 'In a group of cows and chickens, the number of legs is 14 more than twice the number of heads. How many cows are there?',
        options: ['5 cows', '7 cows', '10 cows', '12 cows'],
        correctAnswer: 1
      },
      {
        id: 'mq6',
        text: 'Find the odd one out in the series: 3, 5, 7, 12, 17, 19.',
        options: ['5', '12', '17', '19'],
        correctAnswer: 1
      },
      {
        id: 'mq7',
        text: 'If 5 workers complete a wall in 12 days, how many days will it take 10 workers to complete the same wall?',
        options: ['24 days', '10 days', '6 days', '3 days'],
        correctAnswer: 2
      },
      {
        id: 'mq8',
        text: 'A train 120 meters long passes a telegraph post in 6 seconds. What is the speed of the train in km/hr?',
        options: ['72 km/hr', '80 km/hr', '54 km/hr', '90 km/hr'],
        correctAnswer: 0
      }
    ]
  }
];

export const SAMPLE_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    category: 'programming',
    title: 'Complete JavaScript & DOM Roadmap (2026)',
    description: 'Learn modern Web APIs, event loops, Closures, Scopes, and ES6+ asynchronous features with visual diagrams.',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=2W_V8G_uAuo',
    thumbnail: 'bg-gradient-to-br from-yellow-400 to-amber-600'
  },
  {
    id: 'res-2',
    category: 'programming',
    title: 'Data Structures & Algorithms Cheat Sheets',
    description: 'A curated visual summary of Big-O complexities, Array, Map, Tree, Heap, dynamic programming, and search algorithms.',
    type: 'article',
    url: 'https://example.com/dsa-cheatsheet',
    thumbnail: 'bg-gradient-to-br from-blue-500 to-indigo-700'
  },
  {
    id: 'res-3',
    category: 'aiml',
    title: 'Introduction to Machine Learning Core Algorithms',
    description: 'Deep dive into linear regression, classification trees, Random Forests, Gradient Boosting, SVMs, and PyTorch parameters.',
    type: 'course',
    url: 'https://example.com/ml-basics',
    thumbnail: 'bg-gradient-to-br from-indigo-500 to-purple-700'
  },
  {
    id: 'res-4',
    category: 'career',
    title: 'Cracking the Coding Interview: 10 Core Tips',
    description: 'Strategic guide on speaking out loud during whiteboard coding, asking clarifying questions, and writing test cases.',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=3S_vD_R2jSw',
    thumbnail: 'bg-gradient-to-br from-emerald-500 to-teal-700'
  },
  {
    id: 'res-5',
    category: 'career',
    title: 'SaaS Resume Building Guide & Templates',
    description: 'ATS-friendly Google Docs templates designed for modern tech companies with quantitative bullet point guides.',
    type: 'article',
    url: 'https://example.com/resume-guide',
    thumbnail: 'bg-gradient-to-br from-pink-500 to-rose-700'
  },
  {
    id: 'res-6',
    category: 'programming',
    title: 'NeetCode - Complete 150 Coding Algorithms Roadmap',
    description: 'An outstanding video collection that explains optimal dynamic programming, graphs, trees, arrays, and two-pointer solutions logically.',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=NK_mclKzYRE',
    thumbnail: 'bg-gradient-to-br from-red-500 to-rose-600'
  },
  {
    id: 'res-7',
    category: 'programming',
    title: 'Kunal Kushwaha - Complete Git & GitHub Masterclass',
    description: 'Understand local staging repos, remote synchronization branches, rebase workflows, cherry picking, and resolving scary merge conflicts.',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=apGV9AdZyms',
    thumbnail: 'bg-gradient-to-br from-orange-400 to-amber-600'
  },
  {
    id: 'res-8',
    category: 'aiml',
    title: 'freeCodeCamp - Machine Learning with Python Course',
    description: 'Learn tensor libraries, build neural predictions, configure regression bounds, and design computer vision layers.',
    type: 'course',
    url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
    thumbnail: 'bg-gradient-to-br from-violet-600 to-purple-800'
  },
  {
    id: 'res-9',
    category: 'career',
    title: 'Hussein Nasser - System Design Foundations for Juniors',
    description: 'Fascinating breakdown of database partitioners, horizontal replication, JSON Web Tokens structure, and microservice routers.',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=i53Gi_KVQAo',
    thumbnail: 'bg-[#1E1B4B]'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Dynamic Programming Practice Set',
    description: 'Complete the interactive House Robber logic in JS. Find the maximum amount of money you can rob from houses tonight without alerting police (cannot rob adjacent houses).',
    deadline: '2026-06-15',
    status: 'pending',
    functionName: 'rob',
    placeholderCode: `function rob(nums) {
  // nums is an array of non-negative integers (e.g. [2, 7, 9, 3, 1])
  // Return the maximum sum without choosing adjacent elements
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  // Write your DP algorithm here:
  let prev1 = 0;
  let prev2 = 0;
  for (let num of nums) {
    let temp = prev1;
    prev1 = Math.max(prev2 + num, prev1);
    prev2 = temp;
  }
  return prev1;
}`,
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 4 },
      { input: [[2, 7, 9, 3, 1]], expected: 12 },
      { input: [[5, 1, 1, 5]], expected: 10 }
    ]
  },
  {
    id: 'asg-2',
    title: 'Resume ATS Keyword Optimizer',
    description: 'Write a parser function "formatKeywords" to digest comma-separated skills, make them uppercase, filter out duplicates, and sort them alphabetically. This helps target ATS parsers!',
    deadline: '2026-06-18',
    status: 'pending',
    functionName: 'formatKeywords',
    placeholderCode: `function formatKeywords(skillsString) {
  // input skillsString is a comma separated string: "React, CSS, CSS, Node"
  // Return a sorted array of unique, uppercase, trimmed keywords: ["CSS", "NODE", "REACT"]
  if (!skillsString) return [];
  
  // Write matching parsing javascript here:
  const parts = skillsString.split(',').map(s => s.trim().toUpperCase());
  const unique = [...new Set(parts)].filter(Boolean);
  return unique.sort();
}`,
    testCases: [
      { input: ["React, CSS, HTML, CSS"], expected: ["CSS", "HTML", "REACT"] },
      { input: ["TypeScript, node.js, Node.js"], expected: ["NODE.JS", "TYPESCRIPT"] }
    ]
  },
  {
    id: 'asg-3',
    title: 'SQL Join simulation in Javascript',
    description: 'Simulate a relational SQL INNER JOIN query. Find matched objects from "users" ({ id, name }) and "orders" ({ userId, amount }) joining on user ID keys.',
    deadline: '2026-06-10',
    status: 'completed',
    functionName: 'innerJoin',
    placeholderCode: `function innerJoin(users, orders) {
  // Join users (array) and orders (array) where users.id === orders.userId
  // Return array of combined objects in this format: { id, name, amount }
  const result = [];
  
  // Write your simulation algorithm here:
  for (let u of users) {
    for (let o of orders) {
      if (u.id === o.userId) {
        result.push({
          id: u.id,
          name: u.name,
          amount: o.amount
        });
      }
    }
  }
  return result;
}`,
    testCases: [
      {
        input: [
          [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
          [{ userId: 1, amount: 250 }, { userId: 1, amount: 100 }, { userId: 3, amount: 50 }]
        ],
        expected: [
          { id: 1, name: "Alice", amount: 250 },
          { id: 1, name: "Alice", amount: 100 }
        ]
      }
    ]
  }
];

export const MOCK_JD_ANALYSIS: JDAnalysisResult = {
  skillsRequired: [
    'React & Frontend Architecture',
    'Node.js & Backend Rest APIs',
    'Responsive Fluid Layout styling',
    'SQL/NoSQL database management',
    'Flexible Problem Solving (DSA)'
  ],
  topicsToLearn: [
    'State management optimization (useMemo, useCallback)',
    'Dynamic routing and secure server middleware',
    'Unified query execution across relational schemas',
    'Designing highly-adaptable interfaces and grids'
  ],
  interviewQuestions: [
    {
      question: 'What is the purpose of Vite.js in web applications?',
      answer: 'Vite is a dynamic bundling and serving system that utilizes native browser modules in development to yield rapid start times, hot updates, and efficient bundling in production using Rollup.',
      category: 'technical'
    },
    {
      question: 'How do you handle responsiveness in tailwindcss?',
      answer: " Tailwind operates on a mobile-first philosophy. Prefixing classes with screens landmarks (e.g., md:grid-cols-2) maps layout updates dynamically when screens expand past those breakpoint widths.",
      category: 'technical'
    },
    {
      question: 'Explain a time you solved a bottleneck in communication.',
      answer: 'Highlight an instance of clarifying client models by writing mock API endpoints or OpenAPI schemas to align parallel engineering teams before implementing backend databases.',
      category: 'hr'
    }
  ],
  roadmap: [
    {
      phase: 'Phase 1: Foundations',
      description: 'Stabilize TypeScript enums, basic forms, and local storage variables.',
      duration: 'Days 1-3'
    },
    {
      phase: 'Phase 2: API & Design',
      description: 'Construct server-side routes, optimize styling density, and build layouts.',
      duration: 'Days 4-7'
    },
    {
      phase: 'Phase 3: Integration & Tests',
      description: 'Perform mock assessments, debug build outputs, and submit drafts.',
      duration: 'Days 8-10'
    }
  ],
  resources: [
    {
      title: 'Fullstack Express Router Guides',
      type: 'Guide',
      url: 'https://expressjs.com'
    },
    {
      title: 'React 19 Hooks and Transitions API Reference',
      type: 'Official docs',
      url: 'https://react.dev'
    }
  ]
};

export const MOCK_SCHEDULE: AIScheduleResult = {
  schedule: [
    {
      day: 1,
      topics: ['Advanced Array Methods', 'Aptitude: Time and Work'],
      tasks: ['Practice 5 LeetCode Array Problems', 'Solve 10 Work-rate word problems']
    },
    {
      day: 2,
      topics: ['REST APIs & Middleware', 'HR: Pitching Projects'],
      tasks: ['Write a clean Express server wrapper', 'Record self answering "Tell me about yourself"']
    },
    {
      day: 3,
      topics: ['Dynamic Programming Basics', 'React Ref Performance'],
      tasks: ['Solve Climb Stairs & Fibonacci with memorization', 'Test rendering count counters']
    },
    {
      day: 4,
      topics: ['System Design: Databases', 'Quant: Profit and Loss'],
      tasks: ['Read up on SQL vs NoSQL scaling constraints', 'Complete PnL assessment exercises']
    },
    {
      day: 5,
      topics: ['Full Mock Assessment', 'Resume Polish'],
      tasks: ['Take the Frontend MCQ Test with active timers', 'Align text blocks on the home card details']
    }
  ],
  tips: [
    'Dedicate at least 45 minutes of quiet time for coding questions daily.',
    'Always formulate the brute force explanation before diving into optimization.',
    'Keep your resume targeted to 1 page and use the STAR format for bullet points.'
  ]
};
