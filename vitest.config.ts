import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // Vitest 5 exits 1 with no test files unless told otherwise (a behaviour
    // change from the brief's assumption); Task 0 ships no test file yet.
    passWithNoTests: true,
  },
});
