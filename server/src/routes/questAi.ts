import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const FALLBACK_SUGGESTIONS = [
  { title: "Review binary search tree invariants", type: "study", category: "Study", priority: "medium" },
  { title: "Perform 4 sets of weighted pull-ups", type: "gym", category: "Gym", priority: "high" },
  { title: "Read 15 pages on system design caching", type: "study", category: "Study", priority: "medium" },
  { title: "Practice touch typing or speed reading drills", type: "study", category: "Study", priority: "low" },
  { title: "Active recovery: 20 min dynamic stretching", type: "gym", category: "Gym", priority: "low" },
];

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key") {
      console.warn("⚠️ [QuestAI] GEMINI_API_KEY is not configured in .env. Returning fallback template.");
      const randomFallback =
        FALLBACK_SUGGESTIONS[Math.floor(Math.random() * FALLBACK_SUGGESTIONS.length)];
      return res.status(200).json({
        success: true,
        suggestion: randomFallback,
        quest: randomFallback.title,
        source: "fallback",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `Generate a single concise RPG micro-quest for a gamified productivity application.
Return ONLY a valid JSON object matching this exact TypeScript structure without any markdown fencing:
{
  "title": "string (actionable, max 60 chars)",
  "type": "general" | "gym" | "study",
  "category": "Study" | "Gym" | "Work" | "Personal",
  "priority": "low" | "medium" | "high"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("✨ [QuestAI] Gemini successfully generated quest:", parsed.title);
      return res.status(200).json({
        success: true,
        suggestion: parsed,
        quest: parsed.title,
        source: "gemini-ai",
      });
    }

    throw new Error("Invalid AI JSON payload format");
  } catch (error: any) {
    console.error("❌ [QuestAI] Gemini API Error:", error?.message || error);
    const randomFallback =
      FALLBACK_SUGGESTIONS[Math.floor(Math.random() * FALLBACK_SUGGESTIONS.length)];
    return res.status(200).json({
      success: true,
      suggestion: randomFallback,
      quest: randomFallback.title,
      source: "fallback",
      error: error?.message || "AI generation failed",
    });
  }
});

// ==========================================
// 1. DSA AI Code Assistant & Hints Endpoint
// ==========================================
router.post("/dsa-hint", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { problemTitle, description, userCode, language, requestType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key") {
      return res.status(200).json({
        success: true,
        source: "fallback",
        feedback:
          "💡 **Offline Hint**: Focus on understanding the core invariant. Think about what data structure (e.g. Hash Map, Two Pointers, Monotonic Stack) can reduce the time complexity from O(N²) to O(N) or O(log N). Configure GEMINI_API_KEY for live AI code inspection.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    let systemInstruction = "";
    if (requestType === "hint") {
      systemInstruction =
        "You are an elite competitive programming and DSA mentor. Give a clever, progressive hint for the problem and the user's current code without giving the full code directly. Guide them towards the optimal algorithm and edge cases.";
    } else if (requestType === "bug_check") {
      systemInstruction =
        "Analyze the user's code for potential logical bugs, boundary conditions, edge cases (empty input, duplicates, negative numbers, overflow), and syntax issues. Explain what's wrong succinctly.";
    } else if (requestType === "complexity") {
      systemInstruction =
        "Analyze the Time Complexity and Space Complexity of the user's code. Explain step-by-step why it takes that time and memory, and suggest if it can be optimized.";
    } else {
      systemInstruction =
        "Provide a concise pedagogical explanation of the best approach, intuition, and algorithm design patterns for this DSA problem.";
    }

    const prompt = `${systemInstruction}

Problem: ${problemTitle || "DSA Problem"}
Description:
${description || ""}

Language: ${language || "cpp"}
User's Current Code:
\`\`\`${language || "cpp"}
${userCode || "// Empty code"}
\`\`\`

Provide your response in clean Markdown with bold headings and code snippets if needed.`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    return res.status(200).json({
      success: true,
      source: "gemini-ai",
      feedback,
    });
  } catch (error: any) {
    console.error("❌ [QuestAI] DSA Hint Error:", error?.message || error);
    return res.status(200).json({
      success: true,
      source: "fallback",
      feedback:
        "⚠️ Could not connect to Gemini service. Make sure your GEMINI_API_KEY is valid. General tip: Double check base cases, array bounds, and pointer increment logic.",
    });
  }
});

// ==========================================
// 2. DSA Custom Problem Generator Endpoint
// ==========================================
// Fallback Problem Library for resilient DSA generation
const TOPIC_FALLBACK_PROBLEMS: Record<string, any[]> = {
  "Dynamic Programming": [
    {
      id: "coin-change",
      title: "322. Coin Change",
      difficulty: "Medium",
      category: "Dynamic Programming",
      description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
      examples: [
        { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
        { input: "coins = [2], amount = 3", output: "-1", explanation: "Cannot make amount 3 with only coin of 2." },
      ],
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      functionName: "coinChange",
      starterCode: {
        cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n        \n    }\n};",
        python: "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Write your solution here\n        pass",
        javascript: "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    // Write your solution here\n    \n};",
        java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n        \n    }\n}",
      },
      solutionCode: {
        cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; ++i) {\n            for (int coin : coins) {\n                if (coin <= i) dp[i] = min(dp[i], dp[i - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};",
        python: "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for coin in coins:\n                if coin <= i:\n                    dp[i] = min(dp[i], dp[i - coin] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1",
        javascript: "var coinChange = function(coins, amount) {\n    const dp = Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (const coin of coins) {\n            if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n};",
        java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int coin : coins) {\n                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}",
      },
      timeComplexity: "O(amount * coins.length) — Bottom-up 1D dynamic programming table",
      spaceComplexity: "O(amount) — Memory to store subproblem coin minima",
      approachExplanation: "We define dp[i] as the minimum coins needed to make amount i. For each sub-amount, iterate over all valid coin denominations.",
      testCases: [{ input: [[1, 2, 5], 11], expected: 3 }, { input: [[2], 3], expected: -1 }],
    },
    {
      id: "climbing-stairs",
      title: "70. Climbing Stairs",
      difficulty: "Easy",
      category: "Dynamic Programming",
      description: "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [
        { input: "n = 2", output: "2", explanation: "1 step + 1 step OR 2 steps" },
        { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
      ],
      constraints: ["1 <= n <= 45"],
      functionName: "climbStairs",
      starterCode: {
        cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write solution\n        \n    }\n};",
        python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
        javascript: "var climbStairs = function(n) {\n    \n};",
        java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}",
      },
      solutionCode: {
        cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n};",
        python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b",
        javascript: "var climbStairs = function(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        let c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n};",
        java: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}",
      },
      timeComplexity: "O(N) — Single pass Fibonacci state transition",
      spaceComplexity: "O(1) — Two register state variables",
      approachExplanation: "To reach step n, you must come from step n-1 or step n-2. Thus ways(n) = ways(n-1) + ways(n-2).",
      testCases: [{ input: [2], expected: 2 }, { input: [3], expected: 3 }, { input: [4], expected: 5 }],
    },
  ],
  "Graph Algorithms": [
    {
      id: "num-islands",
      title: "200. Number of Islands",
      difficulty: "Medium",
      category: "Graph Algorithms",
      description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
      examples: [
        { input: "grid = [['1','1','0'],['1','1','0'],['0','0','1']]", output: "2" },
      ],
      constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300"],
      functionName: "numIslands",
      starterCode: {
        cpp: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write solution\n        \n    }\n};",
        python: "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass",
        javascript: "var numIslands = function(grid) {\n    \n};",
        java: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}",
      },
      solutionCode: {
        cpp: "class Solution {\npublic:\n    void dfs(vector<vector<char>>& grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n    }\n    int numIslands(vector<vector<char>>& grid) {\n        int count = 0;\n        for (int i = 0; i < grid.size(); i++) {\n            for (int j = 0; j < grid[0].size(); j++) {\n                if (grid[i][j] == '1') {\n                    count++;\n                    dfs(grid, i, j);\n                }\n            }\n        }\n        return count;\n    }\n};",
        python: "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        if not grid: return 0\n        count = 0\n        def dfs(r, c):\n            if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]) or grid[r][c] != '1': return\n            grid[r][c] = '0'\n            dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n        for i in range(len(grid)):\n            for j in range(len(grid[0])):\n                if grid[i][j] == '1':\n                    count += 1\n                    dfs(i, j)\n        return count",
        javascript: "var numIslands = function(grid) {\n    let count = 0;\n    const dfs = (r, c) => {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== '1') return;\n        grid[r][c] = '0';\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n    };\n    for (let i = 0; i < grid.length; i++) {\n        for (let j = 0; j < grid[0].length; j++) {\n            if (grid[i][j] === '1') { count++; dfs(i, j); }\n        }\n    }\n    return count;\n};",
        java: "class Solution {\n    void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n    }\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int i = 0; i < grid.length; i++) {\n            for (int j = 0; j < grid[0].length; j++) {\n                if (grid[i][j] == '1') { count++; dfs(grid, i, j); }\n            }\n        }\n        return count;\n    }\n}",
      },
      timeComplexity: "O(M * N) — Each grid cell visited once in graph traversal",
      spaceComplexity: "O(M * N) — Max recursion call stack",
      approachExplanation: "Iterate through each cell. When land '1' is found, increment component count and sink connected land cells to '0' using Depth-First Search.",
      testCases: [{ input: [[["1","1","0"],["1","1","0"],["0","0","1"]]], expected: 2 }],
    },
  ],
  "Sliding Window": [
    {
      id: "max-profit",
      title: "121. Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      category: "Sliding Window",
      description: "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
      examples: [
        { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      ],
      constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
      functionName: "maxProfit",
      starterCode: {
        cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write solution\n        \n    }\n};",
        python: "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass",
        javascript: "var maxProfit = function(prices) {\n    \n};",
        java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
      },
      solutionCode: {
        cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = INT_MAX, maxProfit = 0;\n        for (int p : prices) {\n            minPrice = min(minPrice, p);\n            maxProfit = max(maxProfit, p - minPrice);\n        }\n        return maxProfit;\n    }\n};",
        python: "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        min_p, max_p = float('inf'), 0\n        for p in prices:\n            min_p = min(min_p, p)\n            max_p = max(max_p, p - min_p)\n        return max_p",
        javascript: "var maxProfit = function(prices) {\n    let minPrice = Infinity, maxProfit = 0;\n    for (const p of prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProfit = Math.max(maxProfit, p - minPrice);\n    }\n    return maxProfit;\n};",
        java: "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n        for (int p : prices) {\n            minPrice = Math.min(minPrice, p);\n            maxProfit = Math.max(maxProfit, p - minPrice);\n        }\n        return maxProfit;\n    }\n}",
      },
      timeComplexity: "O(N) — Linear single pass",
      spaceComplexity: "O(1) — Constant memory",
      approachExplanation: "Track the minimum price seen so far and update max profit at each step.",
      testCases: [{ input: [[7, 1, 5, 3, 6, 4]], expected: 5 }, { input: [[7, 6, 4, 3, 1]], expected: 0 }],
    },
  ],
};

function getTopicFallback(topic: string, difficulty: string) {
  const normalizedTopic = Object.keys(TOPIC_FALLBACK_PROBLEMS).find((k) =>
    topic.toLowerCase().includes(k.toLowerCase())
  );

  const list = normalizedTopic
    ? TOPIC_FALLBACK_PROBLEMS[normalizedTopic]
    : TOPIC_FALLBACK_PROBLEMS["Dynamic Programming"];

  const problem = list[Math.floor(Math.random() * list.length)];
  return {
    ...problem,
    id: `${problem.id}-${Date.now()}`,
    difficulty: difficulty || problem.difficulty,
  };
}

// ==========================================
// 2. DSA Custom Problem Generator Endpoint
// ==========================================
router.post("/dsa-problem", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { topic = "Dynamic Programming", difficulty = "Medium" } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "your_gemini_api_key" && apiKey.startsWith("AIzaSy")) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `Generate a complete LeetCode-style Data Structures & Algorithms problem on the topic "${topic}" with difficulty "${difficulty}".
Return ONLY a valid JSON object matching this exact TypeScript structure:
{
  "id": "kebab-case-problem-id-${Date.now()}",
  "title": "Problem Title",
  "difficulty": "${difficulty}",
  "category": "${topic}",
  "description": "Clear problem statement with inputs and output specifications.",
  "examples": [
    {
      "input": "input example string",
      "output": "output example string",
      "explanation": "why this output is produced"
    }
  ],
  "constraints": ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 1000"],
  "functionName": "solveFunction",
  "starterCode": {
    "cpp": "class Solution {\\npublic:\\n    int solveFunction(...) {\\n        // Write code\\n    }\\n};",
    "python": "class Solution:\\n    def solveFunction(self, ...):\\n        pass",
    "javascript": "var solveFunction = function(...) {\\n    \\n};",
    "java": "class Solution {\\n    public int solveFunction(...) {\\n        \\n    }\\n}"
  },
  "solutionCode": {
    "cpp": "// optimal C++ solution",
    "python": "# optimal python solution",
    "javascript": "// optimal JS solution",
    "java": "// optimal Java solution"
  },
  "timeComplexity": "O(...) - Explanation",
  "spaceComplexity": "O(...) - Explanation",
  "approachExplanation": "Intuitive walkthrough of how the algorithm works.",
  "testCases": [
    {
      "input": ["sample_arg_1"],
      "expected": 0
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const parsedProblem = JSON.parse(responseText);

      console.log("✨ [QuestAI] Gemini generated DSA problem:", parsedProblem.title);
      return res.status(200).json({
        success: true,
        source: "gemini-ai",
        problem: parsedProblem,
      });
    } catch (error: any) {
      console.warn("⚠️ [QuestAI] Gemini DSA generation error, using resilient fallback:", error?.message || error);
    }
  }

  // Resilient offline fallback generator
  const fallbackProblem = getTopicFallback(topic, difficulty);
  console.log("ℹ️ [QuestAI] Served resilient fallback problem:", fallbackProblem.title);
  return res.status(200).json({
    success: true,
    source: "fallback",
    problem: fallbackProblem,
  });
});

// ==========================================
// 3. Gym AI Workout Generator Endpoint
// ==========================================
router.post("/gym-workout", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      goal = "Hypertrophy",
      muscleGroup = "Chest & Triceps",
      level = "Intermediate",
      equipment = "Gym Barbell & Dumbbell",
      durationMinutes = 45,
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key") {
      // Fallback offline routine
      return res.status(200).json({
        success: true,
        source: "fallback",
        workoutName: `${muscleGroup} Power Workout`,
        focus: `${goal} Routine (${level})`,
        summary: "Balanced physical training session designed to stimulate progressive overload.",
        exercises: [
          { exercise: "Bench Press / Pushups", muscleGroup: "Chest", sets: 4, reps: 10, formTip: "Keep shoulders retracted and core braced.", restSec: 90 },
          { exercise: "Incline Dumbbell Press", muscleGroup: "Upper Chest", sets: 3, reps: 12, formTip: "Full range of motion with slow eccentric.", restSec: 60 },
          { exercise: "Tricep Rope Pushdowns", muscleGroup: "Triceps", sets: 3, reps: 15, formTip: "Lock elbows at sides and flare ropes at bottom.", restSec: 45 },
          { exercise: "Dips or Diamond Pushups", muscleGroup: "Chest & Arms", sets: 3, reps: 12, formTip: "Lean slightly forward to target lower chest.", restSec: 60 },
        ],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are a world-class strength coach and fitness scientist. Generate an optimal, science-backed workout routine for:
- Goal: ${goal}
- Target Muscle Group: ${muscleGroup}
- Fitness Level: ${level}
- Available Equipment: ${equipment}
- Target Duration: ${durationMinutes} minutes

Return ONLY a valid JSON object matching this exact structure without markdown code blocks:
{
  "workoutName": "string (e.g. Chest & Tricep Hypertrophy Protocol)",
  "focus": "string (e.g. Strength & Muscle Growth)",
  "summary": "string (1-2 sentences on why this routine is effective)",
  "exercises": [
    {
      "exercise": "string (e.g. Barbell Incline Bench Press)",
      "muscleGroup": "string (e.g. Upper Chest)",
      "sets": 4,
      "reps": 10,
      "formTip": "string (critical cue for safety and maximum mind-muscle connection)",
      "restSec": 90
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsedWorkout = JSON.parse(jsonMatch[0]);
      console.log("✨ [QuestAI] Gemini generated workout:", parsedWorkout.workoutName);
      return res.status(200).json({
        success: true,
        source: "gemini-ai",
        ...parsedWorkout,
      });
    }

    throw new Error("Invalid gym workout JSON payload format");
  } catch (error: any) {
    console.error("❌ [QuestAI] Gym AI Workout Error:", error?.message || error);
    return res.status(200).json({
      success: true,
      source: "fallback",
      workoutName: "Strength Protocol",
      focus: "General Conditioning",
      summary: "Standard routine provided as fallback.",
      exercises: [
        { exercise: "Compound Press", muscleGroup: "Upper Body", sets: 4, reps: 8, formTip: "Brace core and keep spine neutral.", restSec: 90 },
        { exercise: "Bodyweight Dips", muscleGroup: "Triceps & Chest", sets: 3, reps: 12, formTip: "Smooth controlled tempo.", restSec: 60 },
      ],
    });
  }
});

// ==========================================
// 4. Study AI Plan & Topic Directive Endpoint
// ==========================================
router.post("/study-plan", requireAuth, async (req: AuthenticatedRequest, res) => {
  const {
    subject = "Computer Science",
    topic = "Dynamic Programming",
    durationMinutes = 45,
    goal = "Master Core Invariants & Patterns",
  } = req.body || {};

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key") {
      return res.status(200).json({
        success: true,
        source: "fallback",
        studyTitle: `Deep Focus: ${topic}`,
        subject: subject,
        duration: durationMinutes,
        keyConcepts: ["Core Definitions & Invariants", "Time & Space Complexity Tradeoffs", "Hands-on Practice Problems"],
        milestones: [
          { step: "Theory Review (15 min)", task: `Read core notes on ${topic}` },
          { step: "Implementation (20 min)", task: `Code 1 classic problem on ${topic}` },
          { step: "Spaced Retrieval (10 min)", task: "Write a 3-bullet takeaway summary in IronMind" },
        ],
        recommendedTaskTitle: `Master ${topic} core patterns`,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are an MIT/Stanford computer science professor and cognitive mastery mentor. Generate a structured deep-study directive for:
- Subject: ${subject}
- Topic: ${topic}
- Duration: ${durationMinutes} minutes
- Learning Goal: ${goal}

Return ONLY a valid JSON object matching this exact structure without markdown fences:
{
  "studyTitle": "string (e.g. Dynamic Programming: 1D Memoization Mastery)",
  "subject": "${subject}",
  "duration": ${durationMinutes},
  "keyConcepts": ["string (concept 1)", "string (concept 2)", "string (concept 3)"],
  "milestones": [
    {
      "step": "string (e.g. Conceptual Foundation (10 min))",
      "task": "string (specific actionable directive)"
    }
  ],
  "recommendedTaskTitle": "string (actionable quest title under 50 chars for IronMind quest system)"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsedPlan = JSON.parse(jsonMatch[0]);
      console.log("✨ [QuestAI] Gemini generated study plan:", parsedPlan.studyTitle);
      return res.status(200).json({
        success: true,
        source: "gemini-ai",
        ...parsedPlan,
      });
    }

    throw new Error("Invalid study plan JSON payload format");
  } catch (error: any) {
    console.error("❌ [QuestAI] Study AI Plan Error:", error?.message || error);
    return res.status(200).json({
      success: true,
      source: "fallback",
      studyTitle: `Deep Study: ${topic}`,
      subject: subject,
      duration: durationMinutes,
      keyConcepts: ["Fundamental Principles", "Architecture & Invariants"],
      milestones: [
        { step: "Read & Understand", task: `Learn key concepts of ${topic}` },
        { step: "Apply & Code", task: "Solve representative practice questions" },
      ],
      recommendedTaskTitle: `Master ${topic} core patterns`,
    });
  }
});

export default router;
