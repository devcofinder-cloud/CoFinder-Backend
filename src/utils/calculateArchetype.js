const archetypes = require("./archetypes");

const calculateArchetype = (questions, answers) => {
  const scores = {
    technology: 0,
    design: 0,
    marketing: 0,
    sales: 0,
    management: 0,
    finance: 0,
  };

  answers.forEach((item) => {
    const question = questions.find(
      (q) => q._id.toString() === item.question.toString()
    );

    if (!question) return;

    scores[question.category] += Number(item.answer);
  });

  let highestCategory = null;
  let highestScore = -1;

  for (const category in scores) {
    if (scores[category] > highestScore) {
      highestScore = scores[category];
      highestCategory = category;
    }
  }

  return {
    categoryScores: scores,
    archetype: archetypes[highestCategory],
  };
};

module.exports = calculateArchetype;