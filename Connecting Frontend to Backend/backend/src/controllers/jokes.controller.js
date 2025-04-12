const jokesController = (req, res, next) => {
  res.json([
    {
      id: 1,
      title: "Why don't scientists trust atoms?",
      content: "Because they make up everything!",
    },
    {
      id: 2,
      title: "Why did the scarecrow win an award?",
      content: "Because he was outstanding in his field!",
    },
    {
      id: 3,
      title: "Why don't skeletons fight each other?",
      content: "They don't have the guts.",
    },
    {
      id: 4,
      title: "What do you call fake spaghetti?",
      content: "An impasta!",
    },
    {
      id: 5,
      title: "Why did the bicycle fall over?",
      content: "Because it was two-tired!",
    },
    {
      id: 6,
      title: "What do you call cheese that isn't yours?",
      content: "Nacho cheese!",
    },
    {
      id: 7,
      title: "Why can't your nose be 12 inches long?",
      content: "Because then it would be a foot!",
    },
    {
      id: 8,
      title: "What do you call a bear with no teeth?",
      content: "A gummy bear!",
    },
    {
      id: 9,
      title: "Why did the math book look sad?",
      content: "Because it had too many problems.",
    },
    {
      id: 10,
      title: "What do you call a belt made of watches?",
      content: "A waist of time!",
    },
  ]);
  next();
};

export default jokesController;
