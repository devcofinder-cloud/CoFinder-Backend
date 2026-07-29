"use strict";

/**
 * @param {Array} questions
 * @param {Object} answers
 *
 * answers = {
 *   questionId: 4,
 *   questionId2: 2
 * }
 *
 * Question Structure:
 * {
 *   _id,
 *   mappings: [
 *      {
 *          category: {
 *              _id,
 *              name
 *          },
 *          weight: 5,
 *          direction: "positive"
 *      }
 *   ]
 * }
 */

function calculateCategory(questions, answers) {
  const categoryScores = {};

  for (const question of questions) {
    const answer = Number(answers[question._id]);

    if (!answer || answer < 1 || answer > 5) continue;

    for (const mapping of question.mappings) {
      const categoryName = mapping.category.name;

      if (!categoryScores[categoryName]) {
        categoryScores[categoryName] = {
          score: 0,
          maxScore: 0,
        };
      }

      // Reverse score if negative question
      const actualScore =
        mapping.direction === "negative"
          ? 6 - answer
          : answer;

      categoryScores[categoryName].score +=
        actualScore * mapping.weight;

      categoryScores[categoryName].maxScore +=
        5 * mapping.weight;
    }
  }

  // Convert into percentage
  const result = Object.entries(categoryScores).map(
    ([category, value]) => ({
      category,
      score: value.score,
      percentage:
        value.maxScore === 0
          ? 0
          : Number(
              (
                (value.score / value.maxScore) *
                100
              ).toFixed(2)
            ),
    })
  );

  // Highest percentage wins
  result.sort((a, b) => b.percentage - a.percentage);

  return {
    winner: result[0] || null,
    rankings: result,
  };
}

module.exports = calculateCategory;