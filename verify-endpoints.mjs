// Verification test script for IronMind API endpoints and Anti-Cheat RPG Progression

async function runTests() {
  const baseUrl = "http://localhost:3000";
  console.log("=== Testing IronMind Endpoints ===");

  // 1. AI Quest Suggestions
  console.log("\n--- Testing /api/quest-ai ---");
  const aiRes1 = await fetch(`${baseUrl}/api/quest-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: "intellect" }),
  }).then((r) => r.json());
  console.log("Intellect Quest:", aiRes1.quest);
  if (!aiRes1.quest || aiRes1.quest.split(" ").length > 15) {
    throw new Error("AI Quest failed length requirement!");
  }

  const aiRes2 = await fetch(`${baseUrl}/api/quest-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: "willpower" }),
  }).then((r) => r.json());
  console.log("Willpower Quest:", aiRes2.quest);

  // 2. Auth protection check (Without headers must return 401)
  console.log("\n--- Testing Auth Protection ---");
  const unauthRes = await fetch(`${baseUrl}/api/user/me`);
  console.log("Unauthenticated /api/user/me status:", unauthRes.status);
  if (unauthRes.status !== 401) {
    throw new Error("Expected 401 Unauthorized for unauthenticated request!");
  }

  // 3. User initialization
  const testUid = `warrior_test_${Date.now()}`;
  const authHeaders = {
    "Content-Type": "application/json",
    "x-ironmind-demo-uid": testUid,
    "Authorization": `Bearer demo-token-${testUid}`,
  };

  console.log("\n--- Testing /api/user/init ---");
  const initRes = await fetch(`${baseUrl}/api/user/init`, {
    method: "POST",
    headers: authHeaders,
  }).then((r) => r.json());
  console.log("User profile initialized:", initRes.profile);
  if (initRes.profile.level !== 1 || initRes.profile.streak !== 0) {
    throw new Error("Unexpected initial stats!");
  }

  // 4. Create Tasks (Intellect & Willpower)
  console.log("\n--- Testing /api/tasks (POST) ---");
  const task1 = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Read 20 pages of distributed systems",
      category: "intellect",
    }),
  }).then((r) => r.json());
  console.log("Created task 1:", task1.task);

  const task2 = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Complete 40 pushups and 5 min plank",
      category: "willpower",
    }),
  }).then((r) => r.json());
  console.log("Created task 2:", task2.task);

  // 5. Fetch Tasks
  console.log("\n--- Testing /api/tasks (GET) ---");
  const tasksRes = await fetch(`${baseUrl}/api/tasks`, {
    headers: authHeaders,
  }).then((r) => r.json());
  console.log(`Fetched ${tasksRes.tasks.length} tasks.`);

  // 6. Complete Task 1 (Atomic progression)
  console.log("\n--- Testing /api/tasks/complete ---");
  const completeRes = await fetch(`${baseUrl}/api/tasks/complete`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ taskId: task1.task.id }),
  }).then((r) => r.json());

  console.log("Task completed response:", {
    xpGained: completeRes.data.progression.xpGained,
    currentXp: completeRes.data.progression.currentXp,
    level: completeRes.data.progression.newLevel,
    streak: completeRes.data.streak.newStreak,
    coins: completeRes.data.updatedProfile.coins,
    intellect: completeRes.data.updatedProfile.attributes.intellect,
    willpower: completeRes.data.updatedProfile.attributes.willpower,
  });

  if (completeRes.data.streak.newStreak !== 1) {
    throw new Error(`Expected streak 1, got ${completeRes.data.streak.newStreak}`);
  }
  if (completeRes.data.updatedProfile.attributes.intellect !== 11) {
    throw new Error("Expected intellect 11!");
  }

  // 7. Anti-Cheat: Try completing the same task again (must reject!)
  console.log("\n--- Testing Anti-Cheat Duplicate Completion Prevention ---");
  const dupRes = await fetch(`${baseUrl}/api/tasks/complete`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ taskId: task1.task.id }),
  });
  console.log("Duplicate complete status:", dupRes.status);
  if (dupRes.status !== 409 && dupRes.status !== 400) {
    throw new Error("Anti-cheat failed: Duplicate task completion did not reject!");
  }

  // 8. Delete task 2
  console.log("\n--- Testing /api/tasks/[id] (DELETE) ---");
  const deleteRes = await fetch(`${baseUrl}/api/tasks/${task2.task.id}`, {
    method: "DELETE",
    headers: authHeaders,
  }).then((r) => r.json());
  console.log("Task deletion result:", deleteRes);

  console.log("\n✓ ALL SERVER-SIDE ANTI-CHEAT & RPG PROGRESSION TESTS PASSED!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
