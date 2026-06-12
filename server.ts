import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client if API key is provided
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully with API key");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Server will run on mock fallback mode.");
}

// 1. API: Analyze Job Description
app.post("/api/analyze-jd", async (req, res) => {
  const { jd } = req.body;
  if (!jd || jd.trim().length === 0) {
    return res.status(400).json({ error: "Job description is empty" });
  }

  if (ai) {
    try {
      const prompt = `You are an expert technical recruiter and placement coach. Analyze the following Job Description and extract:
1. Skills required (strictly technical/conceptual, max 5)
2. Custom core topics the student must study/master
3. Exactly 3 tailored interview questions (a mix of coding, technical, and HR) with brief answers matching the role
4. A 3-phase study roadmap (Phase 1, Phase 2, Phase 3 with custom durations and descriptions)
5. 2 recommended learning resource categories or specific guides with URLs (invent suitable resources if needed)

Format the entire response STRICTLY as a single JSON object. No markdown syntax blockers, just clean JSON.

The structural interface of JSON must be:
{
  "skillsRequired": ["React", "CSS", ...],
  "topicsToLearn": ["Virtual DOM", "REST APIs", ...],
  "interviewQuestions": [
    {
      "question": "The question string",
      "answer": "The suggested model answer string",
      "category": "technical" | "coding" | "hr"
    }
  ],
  "roadmap": [
    {
      "phase": "Phase title",
      "description": "What to do in this phase",
      "duration": "Days 1-3"
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "type": "Guide" | "Article" | "Doc",
      "url": "https://..."
    }
  ]
}

Job Description:
${jd.substring(0, 4000)}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (response && response.text) {
        const textStr = response.text.trim();
        const parsedData = JSON.parse(textStr);
        return res.json(parsedData);
      }
    } catch (error: any) {
      console.error("Gemini AI JD analysis failure:", error);
      // fallback handled below
    }
  }

  // Graceful smart customized fallback
  console.log("Using customized fallback for JD analysis");
  const extractedSkills = ["React & TypeScript", "REST Design", "Tailwind UI", "General Problem Solving"];
  if (jd.toLowerCase().includes("python") || jd.toLowerCase().includes("django") || jd.toLowerCase().includes("flask")) {
    extractedSkills.push("Python Developer Stack");
  }
  if (jd.toLowerCase().includes("sql") || jd.toLowerCase().includes("postgres") || jd.toLowerCase().includes("database")) {
    extractedSkills.push("SQL & Schema Design");
  }
  if (jd.toLowerCase().includes("java") || jd.toLowerCase().includes("spring")) {
    extractedSkills.push("Java Foundations & JPA");
  }

  return res.json({
    skillsRequired: extractedSkills.slice(0, 5),
    topicsToLearn: [
      "Core framework lifecycle methods & hooks",
      "Handling state transitions and asynchronous side effects gracefully",
      "Designing responsive, high-fidelity interfaces",
      "Mocking real-world API requests & testing edge cases"
    ],
    interviewQuestions: [
      {
        question: "Explain the optimization strategies you would apply for this role.",
        answer: "Use memoization, throttle asynchronous state updates, build clean components, and audit the cumulative load size.",
        category: "technical"
      },
      {
        question: "How do you maintain code quality and fast iteration cycles?",
        answer: "By keeping functions pure, writing precise TypeScript interfaces, and decoupling business log from UI display layers.",
        category: "hr"
      },
      {
        question: "Write functions to parse a query string to key-value objects.",
        answer: "Use standard URLSearchParams or reduce split components into local hash keys.",
        category: "coding"
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: Concepts Mastery",
        description: "Read basic documentation and play with simple single-page interactive components.",
        duration: "Days 1-3"
      },
      {
        phase: "Phase 2: Project Development & Mock Interviews",
        description: "Integrate mock routing, handle network errors, and run mock MCQs.",
        duration: "Days 4-7"
      },
      {
        phase: "Phase 3: Portfolio Tuning & Code Review",
        description: "Optimize layout bounds for high-dpi screens, write test scripts and launch proofs of concept.",
        duration: "Days 8-10"
      }
    ],
    resources: [
      {
        title: "Modern Interactive Application Handbooks",
        type: "Guide",
        url: "https://example.com/interactive-guide"
      },
      {
        title: "System Design & Scalable Routing Sheets",
        type: "Article",
        url: "https://example.com/scale-routing"
      }
    ]
  });
});

// 2. API: Generate Customized Study Schedule
app.post("/api/generate-schedule", async (req, res) => {
  const { company, date, hours } = req.body;
  if (!company || !date) {
    return res.status(400).json({ error: "Missing required schedule fields" });
  }

  const studyHours = hours || 4;

  if (ai) {
    try {
      const prompt = `You are an expert career placement planner. Generate a customized 5-day preparation study program for a student targeting an interview or exam at "${company}" on the date "${date}".
The student can commit ${studyHours} hours per day for preparation.

Provide exactly:
1. Day 1 to Day 5 schedule (each day includes a list of 2 primary topics to learn, and 2 concrete testable tasks to complete)
2. Exactly 3 highly useful placement suggestions or tips for "${company}".

Format the entire response STRICTLY as a single JSON object. No markdown syntax blockers, just clean JSON.

Expected JSON schema:
{
  "schedule": [
    {
      "day": 1,
      "topics": ["Topic A", "Topic B"],
      "tasks": ["Task A detail", "Task B detail"]
    }
    // and so on for days 2, 3, 4, 5...
  ],
  "tips": [
    "Tip 1 for targeting this company",
    "Tip 2",
    "Tip 3"
  ]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (error) {
      console.error("Gemini AI schedule creation failure:", error);
    }
  }

  // Graceful fallback schedule customized to target company
  console.log("Using customized fallback for schedule generation");
  return res.json({
    schedule: [
      {
        day: 1,
        topics: [`${company} Core Architecture & Products`, 'System Design & High Performance Arrays'],
        tasks: [`Research ${company}'s standard technical values and recent tech blog releases`, 'Practice 3 medium array iteration questions']
      },
      {
        day: 2,
        topics: ['Data Structures: Linked Lists & Graphs', 'Cognitive Reasoning Practice'],
        tasks: ['Solve standard list cycle detections', 'Complete 15 online aptitude worksheets']
      },
      {
        day: 3,
        topics: ['Database normalization and indices', 'Object Oriented Programming Concepts'],
        tasks: ['Identify slow indexing patterns', 'Sketch out standard SOLID software design boards']
      },
      {
        day: 4,
        topics: ['HR mock tests & behavioral pitches', 'Dynamic algorithms & optimization'],
        tasks: ['Record mock interview answers under timed pressure', 'Trace Fibonacci optimization patterns']
      },
      {
        day: 5,
        topics: [`Comprehensive Mock final rehearsals for ${company}`, 'Resume tune-up and portfolio check'],
        tasks: ['Take our frontend technical assessments with absolute scoring reviews', 'Verify active git repositories are linked']
      }
    ],
    tips: [
      `Review ${company}'s founding history and core values prior to entering any executive panel interview.`,
      "Explain your problem-solving approaches slowly and clearly; interviewers care deeply about clarity over speed.",
      "Check your output profiles for clean grid alignments and correct text labels."
    ]
  });
});

// 3. API: Chatbot Assistant
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Empty message text is not allowed" });
  }

  if (ai) {
    try {
      // Format chat history for Gemini
      // Let's create a conversational prompt that includes recent history
      let conversationContext = "You are 'CareerHub Coach', an advanced premium AI Career Platform mentor. You are professional, supportive, concise, and focused on tech placements, interviews, resumes, coding doubts, and placement tracking.\n\n";
      
      if (history && history.length > 0) {
        conversationContext += "Recent conversation history:\n";
        history.forEach((h: any) => {
          conversationContext += `${h.role === 'user' ? 'Student' : 'Coach'}: ${h.text}\n`;
        });
      }
      conversationContext += `\nLatest student query: ${message}\nCoach response:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: conversationContext,
        config: {
          systemInstruction: "You are the premium placement expert at CareerHub. Answer questions about interview prep, DSA (Data Structures and Algorithms), HR panels, system designs, resumes, and study plans clearly and helpfully. Keep answers elegant, markdown-friendly, and concise.",
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        return res.json({ text: response.text });
      }
    } catch (error) {
      console.error("Gemini AI chatbot failure:", error);
    }
  }

  // Graceful smart offline fallback replies
  const lcMsg = message.toLowerCase();
  let reply = "I am currently in smart assistant offline mode. Here are some standard guidelines:\n\n";

  if (lcMsg.includes("binary search") || lcMsg.includes("algorithm")) {
    reply += "**Binary Search** is an efficient O(log N) algorithm for finding an element in a sorted list. It repeatedly divides the search interval in half. If the value of the key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half.";
  } else if (lcMsg.includes("resume") || lcMsg.includes("cv")) {
    reply += "A high-quality student resume should include:\n1. **Contact Details**: Name, email, phone, and links (Github, LinkedIn, etc.)\n2. **Education**: University name, degree, branch, and current CGPA\n3. **Skills**: Divided by category (e.g. Languages, Libraries, Tools)\n4. **Projects**: Bullet points using numerical outcomes (e.g. 'Optimized render cycles resulting in a 40% speed up')\n5. **Experience**: Internships, student clubs, or Hackathon milestones.";
  } else if (lcMsg.includes("interview") || lcMsg.includes("prepare") || lcMsg.includes("prep")) {
    reply += "To crack placements successfully, prioritize:\n- **Conceptual Stability**: Make sure your OOPs, basic databases, and OS concepts are rock solid.\n- **Aptitude Practice**: Spend 30 minutes daily on logical reasoning & arithmetic worksheets.\n- **Behavioral Prompts**: Frame project narratives using the STAR method (Situation, Task, Action, Result) to impress examiners.";
  } else if (lcMsg.includes("dsa") || lcMsg.includes("roadmap")) {
    reply += "A comprehensive Data Structures and Algorithms roadmap:\n- **Week 1-2**: Arrays, HashMaps, Two pointers, Binary Search\n- **Week 3-4**: Linked Lists, Stacks, Queues, Sliding Window\n- **Week 5-6**: Recursion, Trees, Graphs (BFS/DFS traversal)\n- **Week 7-8**: Advanced Heap priority queues, simple Dynamic Programming (Greedy strategies)";
  } else {
    reply += `Thank you for asking that! To best prepare for career goals, investigate technical indices, formulate structured mock interview solutions, and practice quantitative reasoning cards. \n\nIs there a specific topic from DSA, HR, or custom mock tests you'd like to explore further?`;
  }

  return res.json({ text: reply });
});

// Serve static elements or standard setup
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite dev helper to run the dev middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Register Vite middleware for processing spa assets
    app.use(vite.middlewares);
    console.log("Vite middleware mounted for development");
  } else {
    // Production serving from client dist build
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist directory");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerHub Backend running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start CareerHub Server:", err);
});
