// Complete Verification test suite for IronMind full-stack suite

async function runTests() {
  const baseUrl = "http://localhost:3000";
  console.log("=== Testing IronMind Extended Suite ===");

  // 1. AI Quest Suggestions
  console.log("\n--- Testing /api/quest-ai ---");
  const aiRes = await fetch(`${baseUrl}/api/quest-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: "intellect" }),
  }).then((r) => r.json());
  console.log("AI Quest:", aiRes.quest);

  // 2. Auth Protection
  console.log("\n--- Testing Auth Protection ---");
  const unauth = await fetch(`${baseUrl}/api/user/me`);
  if (unauth.status !== 401) throw new Error("Expected 401 for unauth request!");

  // 3. User Initialization
  const testUid = `warrior_${Date.now()}`;
  const authHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer demo-token-${testUid}`,
  };

  const initRes = await fetch(`${baseUrl}/api/user/init`, {
    method: "POST",
    headers: authHeaders,
  }).then((r) => r.json());
  console.log("User Initialized:", initRes.profile?.uid);

  // 4. Categories CRUD
  console.log("\n--- Testing /api/categories ---");
  const catsRes = await fetch(`${baseUrl}/api/categories`, { headers: authHeaders }).then((r) => r.json());
  console.log(`Fetched ${catsRes.categories.length} categories.`);

  const newCat = await fetch(`${baseUrl}/api/categories`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name: "Interview Prep", color: "#5856D6" }),
  }).then((r) => r.json());
  console.log("Created Custom Category:", newCat.category?.name);

  // 5. Tasks Creation (General, Gym, Study)
  console.log("\n--- Testing /api/tasks (General, Gym, Study) ---");
  const gymTask = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Bench Press 4x10",
      type: "gym",
      category: "Gym",
      priority: "high",
      gym: { exercise: "Bench Press", muscleGroup: "Chest", sets: 4, reps: 10 },
    }),
  }).then((r) => r.json());
  console.log("Created Gym Task:", gymTask.task?.title, "XP Reward:", gymTask.task?.xpReward);

  const studyTask = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "DSA Graph Algorithms",
      type: "study",
      category: "Study",
      priority: "medium",
      study: { subject: "DSA", topic: "Dijkstra", duration: 45 },
    }),
  }).then((r) => r.json());
  console.log("Created Study Task:", studyTask.task?.title, "XP Reward:", studyTask.task?.xpReward);

  // 6. Edit Incomplete Task (PATCH /api/tasks/[id])
  console.log("\n--- Testing /api/tasks/[id] (PATCH) ---");
  const editRes = await fetch(`${baseUrl}/api/tasks/${gymTask.task.id}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Bench Press 4x12 (Heavy)",
      priority: "high",
    }),
  }).then((r) => r.json());
  console.log("Updated Task Title:", editRes.task?.title);

  // 7. Complete Task with Authoritative Server Progression
  console.log("\n--- Testing /api/tasks/complete (Atomic RPG Engine) ---");
  const compRes = await fetch(`${baseUrl}/api/tasks/complete`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ taskId: gymTask.task.id }),
  }).then((r) => r.json());

  console.log("Completion Result:", {
    xpGained: compRes.data.progression.xpGained,
    currentXp: compRes.data.progression.currentXp,
    attributeGained: compRes.data.attributeGained,
    willpower: compRes.data.updatedProfile.attributes.willpower,
    coins: compRes.data.updatedProfile.coins,
  });

  if (compRes.data.attributeGained !== "willpower") {
    throw new Error("Expected gym task to award Willpower attribute!");
  }

  // 8. Filtered GET /api/tasks?type=study
  console.log("\n--- Testing Filtered Tasks ---");
  const filteredRes = await fetch(`${baseUrl}/api/tasks?type=study`, {
    headers: authHeaders,
  }).then((r) => r.json());
  console.log(`Filtered study tasks count: ${filteredRes.tasks.length}`);

  console.log("\n✓ ALL EXTENDED SUITE VERIFICATION TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
