export const playSound = (sound) => {
  const audio = new Audio(sound);

  audio.volume = 0.7;

  audio.play().catch((err) => {
    console.log("Sound blocked:", err);
  });
};