const PASSWORD = "shreya";

const lockScreen = document.getElementById("lockScreen");
const giftScreen = document.getElementById("giftScreen");
const form = document.getElementById("unlockForm");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseText = document.getElementById("surpriseText");
const backBtn = document.getElementById("backBtn");
const musicBtn = document.getElementById("musicBtn");
const toast = document.getElementById("toast");

let audioContext = null;
let musicTimer = null;
let musicOn = false;
let noteIndex = 0;
const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value.trim().toLowerCase() === PASSWORD) {
    lockScreen.classList.add("hidden");
    giftScreen.classList.remove("hidden");
    errorMsg.textContent = "";
    passwordInput.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    errorMsg.textContent = "That password doesn't match. Try again 💜";
    passwordInput.select();
  }
});

surpriseBtn.addEventListener("click", () => {
  surpriseText.classList.remove("hidden");
  surpriseBtn.textContent = "Surprise unlocked ✨";
  sprinkleConfetti();
});

backBtn.addEventListener("click", () => {
  giftScreen.classList.add("hidden");
  lockScreen.classList.remove("hidden");
  surpriseText.classList.add("hidden");
  surpriseBtn.textContent = "One more little surprise ✨";
  stopMusic();
});

musicBtn.addEventListener("click", () => musicOn ? stopMusic() : startMusic());

function startMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    showToast("Audio isn't supported in this browser.");
    return;
  }
  audioContext = audioContext || new AudioCtx();
  audioContext.resume();
  musicOn = true;
  musicBtn.textContent = "♫ Music: On";
  musicBtn.setAttribute("aria-pressed", "true");
  playNote();
  musicTimer = setInterval(playNote, 650);
}

function playNote() {
  if (!audioContext || !musicOn) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = notes[noteIndex % notes.length];
  noteIndex++;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.55);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.56);
}

function stopMusic() {
  musicOn = false;
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  musicBtn.textContent = "♫ Music: Off";
  musicBtn.setAttribute("aria-pressed", "false");
}

function sprinkleConfetti() {
  const colors = ["#e4baff", "#ffb8e7", "#bba7ff", "#fff0b8"];
  for (let i = 0; i < 36; i++) {
    const piece = document.createElement("span");
    piece.textContent = i % 3 === 0 ? "✦" : "•";
    piece.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-20px;z-index:5;pointer-events:none;color:${colors[i%colors.length]};font-size:${10+Math.random()*14}px;transition:transform ${1.2+Math.random()}s ease,opacity 1.5s ease;`;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.transform = `translateY(${window.innerHeight + 60}px) rotate(${Math.random()*480}deg)`;
      piece.style.opacity = "0";
    });
    setTimeout(() => piece.remove(), 2700);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
