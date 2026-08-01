const archetypes = require("./archetypes");

const calculateArchetype = (questions, answers) => {
    console.log("Questions =>", questions);
  console.log("Answers =>", answers);

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

    console.log("Matched Question =>", question);

    if (!question) return;

    console.log(
      "Category:",
      question.category,
      "Answer:",
      item.answer
    );

    scores[question.category] += Number(item.answer);
  });

  console.log("Scores =>", scores);


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