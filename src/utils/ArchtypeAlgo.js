'use strict';

// ==========================================
// 1. ARCHETYPE RULE MATRIX & CONFIGURATION
// ==========================================
// Rule conditions are defined as objects: { condition, weight }
// High >= 4, Low <= 2
const ARCHETYPE_RULES = {
  "The Bold Executor": {
    Q4: { condition: (x) => x >= 4, weight: 3 }, // Risk Appetite
    Q7: { condition: (x) => x >= 4, weight: 2 }, // Speed Bias
    Q8: { condition: (x) => x >= 4, weight: 2 }, // Decision Speed
    Q2: { condition: (x) => x <= 2, weight: 1 }, // Operational Time Horizon
  },
  "The Strategic Disruptor": {
    Q2: { condition: (x) => x >= 4, weight: 3 }, // Operational Time Horizon
    Q4: { condition: (x) => x >= 4, weight: 2 }, // Risk Appetite
    Q3: { condition: (x) => x >= 4, weight: 2 }, // Ownership Mindset
    Q7: { condition: (x) => x <= 2, weight: 1 }, // Speed Bias
    Q8: { condition: (x) => x <= 2, weight: 1 }, // Decision Speed
  },
  "The Rapid Prototyper": {
    Q7: { condition: (x) => x >= 4, weight: 3 }, // Speed Bias
    Q8: { condition: (x) => x >= 4, weight: 2 }, // Decision Speed
    Q2: { condition: (x) => x <= 2, weight: 2 }, // Operational Time Horizon
    Q4: { condition: (x) => x >= 4, weight: 1 }, // Risk Appetite
    Q9: { condition: (x) => x <= 2, weight: 1 }, // Follow-Through / Focus
  },
  "The Systematic Founder": {
    Q9: { condition: (x) => x <= 2, weight: 3 }, // Follow-Through / Focus (Systems)
    Q2: { condition: (x) => x >= 4, weight: 3 }, // Operational Time Horizon
    Q1: { condition: (x) => x >= 4, weight: 2 }, // Commitment Level
    Q4: { condition: (x) => x <= 2, weight: 2 }, // Risk Appetite
    Q7: { condition: (x) => x <= 2, weight: 1 }, // Speed Bias
  },
  "The Collaborative Realist": {
    Q6: { condition: (x) => x >= 4, weight: 3 }, // Partnership Style (Parity)
    Q5: { condition: (x) => x >= 4, weight: 2 }, // Candor / Communication
    Q1: { condition: (x) => x <= 2, weight: 2 }, // Commitment Level
    Q3: { condition: (x) => x <= 2, weight: 1 }, // Ownership Mindset
    Q4: { condition: (x) => x <= 2, weight: 1 }, // Risk Appetite
  },
};

const FALLBACK_THRESHOLD = 0.45;
const FALLBACK_ARCHETYPE = "The Balanced Builder";

// ==========================================
// 2. ARCHETYPE CALCULATOR ENGINE
// ==========================================
/**
 * Evaluates a user's 1-5 slider responses against the archetype matrix.
 * Returns the assigned archetype name and its alignment ratio.
 *
 * @param {Object<string, number>} vector
 * @returns {[string, number]} [archetypeName, normalizedScore]
 */
function calculateArchetype(vector) {
  let bestArchetype = FALLBACK_ARCHETYPE;
  let highestScore = 0.0;

  for (const [archetype, rules] of Object.entries(ARCHETYPE_RULES)) {
    const totalPossibleWeight = Object.values(rules).reduce(
      (sum, rule) => sum + rule.weight,
      0
    );
    let earnedWeight = 0;

    for (const [qKey, rule] of Object.entries(rules)) {
      if (rule.condition(vector[qKey])) {
        earnedWeight += rule.weight;
      }
    }

    // Normalize the score (0.0 to 1.0)
    const normalizedScore = earnedWeight / totalPossibleWeight;

    if (normalizedScore > highestScore) {
      highestScore = normalizedScore;
      bestArchetype = archetype;
    }
  }

  // Apply the fallback threshold guardrail
  if (highestScore < FALLBACK_THRESHOLD) {
    return [FALLBACK_ARCHETYPE, highestScore];
  }

  return [bestArchetype, Math.round(highestScore * 100) / 100];
}

// ==========================================
// 3. PAIRWISE VECTOR MATCHING ENGINE
// ==========================================
/**
 * Computes a 0-100% compatibility rating between two founders using a dual-track framework:
 * Symmetry on Core Values (Similarity) and Polarity on Operational Blind Spots (Complementarity).
 *
 * @param {Object<string, number>} vectorA
 * @param {Object<string, number>} vectorB
 * @returns {number}
 */
function calculateCompatibility(vectorA, vectorB) {
  // Define weight multipliers
  const wQ1 = 0.2,
    wQ2 = 0.15,
    wQ5 = 0.1; // Similarity Weight Total = 0.45
  const wCompGroup1 = 0.2,
    wCompGroup2 = 0.2,
    wCompGroup3 = 0.15; // Complementarity Weight Total = 0.55

  // Helper function for Similarity Axes: Score = 1 - (abs(A - B) / 4)
  const similarityScore = (qKey) =>
    1.0 - Math.abs(vectorA[qKey] - vectorB[qKey]) / 4.0;

  // Helper function for Complementarity Axes: Score = abs(A - B) / 4
  const complementarityScore = (qKey) =>
    Math.abs(vectorA[qKey] - vectorB[qKey]) / 4.0;

  // A. SIMILARITY TRACK (45% Total Weight)
  const scoreQ1 = similarityScore("Q1"); // Commitment Level
  const scoreQ2 = similarityScore("Q2"); // Time Horizon
  const scoreQ5 = similarityScore("Q5"); // Candor / Communication

  const totalSimilarityContribution =
    scoreQ1 * wQ1 + scoreQ2 * wQ2 + scoreQ5 * wQ5;

  // B. COMPLEMENTARITY TRACK (55% Total Weight)
  // Speed vs. Thoroughness (Q7, Q10 blended equally into a 20% weight group)
  const speedThoroughnessScore =
    (complementarityScore("Q7") + complementarityScore("Q10")) / 2.0;

  // Vision vs. Technical Execution (Q9 carries a 20% weight group)
  const visionExecutionScore = complementarityScore("Q9");

  // Risk & Decision Profile (Q4, Q8 blended equally into a 15% weight group)
  const riskDecisionScore =
    (complementarityScore("Q4") + complementarityScore("Q8")) / 2.0;

  const totalComplementarityContribution =
    speedThoroughnessScore * wCompGroup1 +
    visionExecutionScore * wCompGroup2 +
    riskDecisionScore * wCompGroup3;

  // Aggregate total matching score
  const finalCompatibility =
    (totalSimilarityContribution + totalComplementarityContribution) * 100.0;

  return Math.round(finalCompatibility);
}

// ==========================================
// 4. RUNNABLE EXECUTION TEST FRAMEWORK
// ==========================================
function main() {
  // Simulated User Profile A (High-velocity, high-risk technical Builder)
  const founderAResponses = {
    Q1: 5, // 60+ hrs/wk (Extreme Build)
    Q2: 1, // 3 months max (Fast Fail)
    Q3: 5, // Venture hyper-scale
    Q4: 5, // Take high calculated personal risk
    Q5: 5, // Immediate Radical Candor
    Q6: 1, // Dynamic equity based on milestones
    Q7: 5, // Hyper-speed distribution over code polish
    Q8: 5, // Act swiftly on intuitive deductions
    Q9: 1, // Deep execution, engineering & systems
    Q10: 1, // Pivot immediately to new concepts
  };

  // Simulated User Profile B (Complimentary Business/Strategy Partner)
  const founderBResponses = {
    Q1: 5, // 60+ hrs/wk (Perfect operational sync with Founder A)
    Q2: 2, // 3 months max (Aligned validation goals)
    Q3: 5, // Venture hyper-scale
    Q4: 2, // Prefers minimizing baseline risk profile
    Q5: 4, // High candor/direct communication
    Q6: 2, // Metrics leaning dynamic
    Q7: 2, // Prefers robust operational validation
    Q8: 2, // Prefers waiting for data telemetry
    Q9: 5, // Macro strategy, vision & external positioning
    Q10: 4, // Methodically isolates execution variables
  };

  // 1. Run Archetype Classifications
  const [archA, matchPctA] = calculateArchetype(founderAResponses);
  const [archB, matchPctB] = calculateArchetype(founderBResponses);

  console.log("--- Test Execution Results ---");
  console.log(`Founder A Profile: ${archA} (Rule Confidence: ${matchPctA * 100}%)`);
  console.log(`Founder B Profile: ${archB} (Rule Confidence: ${matchPctB * 100}%)`);

  // 2. Run Compatibility Cross-Evaluation
  const matchScore = calculateCompatibility(founderAResponses, founderBResponses);
  console.log(`Calculated Pairwise Match Score: ${matchScore}%`);
}

if (require.main === module) {
  main();
}

module.exports = {
  ARCHETYPE_RULES,
  FALLBACK_THRESHOLD,
  FALLBACK_ARCHETYPE,
  calculateArchetype,
  calculateCompatibility,
};