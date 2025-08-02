const messages = [
  "Here's your daily dose of distraction!",
  "Productivity is overrated. Let's procrastinate!",
  "You could be doing anything else right now..."
];

const links = [
  "https://theuselessweb.com/",
  "https://www.youtube.com/",
  "https://flappybird.io/",
  "https://www.instagram.com/",
  "https://slither.io/"
];

document.getElementById("distract").addEventListener("click", () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const link = links[Math.floor(Math.random() * links.length)];

  alert(msg);
  window.open(link, "_blank");
});
