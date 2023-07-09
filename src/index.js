import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const START_BALL_FORM = document.getElementById("startBallForm"),
  BALL = document.getElementById("ball"),
  SETTINGS = document.getElementById("settings");

let PIXELS_PER_SECONDS, NECESSARY_DURATION;

const setAnimationOptions = ({ duration, itterations }) => {
  if (duration) {
    BALL.style.animationDuration = `${duration}s`;
  }
  if (itterations) {
    BALL.style.animationIterationCount = `${itterations}`;
  }
};

const calculateAnimationOptionsByArea = (area) => {
  const duration = (area.clientWidth - BALL.clientWidth) / PIXELS_PER_SECONDS,
    itterations = Math.ceil(NECESSARY_DURATION / duration);
  return { duration, itterations };
};

const moveBall = () => {
  const area = document.documentElement;
  const options = calculateAnimationOptionsByArea(area);
  setAnimationOptions(options);
};

const toggleVisibility = () => {
  if (BALL.style.display === "none") {
    SETTINGS.style.display = "none";
    BALL.style.display = "block";
  } else {
    SETTINGS.style.display = "block";
    BALL.style.display = "none";
  }
};

const startBall = (e) => {
  e.preventDefault();
  const data = new FormData(START_BALL_FORM);

  PIXELS_PER_SECONDS = parseInt(data.get("speed"));
  NECESSARY_DURATION = parseInt(data.get("duration"));

  const expiredOver = NECESSARY_DURATION * 1000 + 6000;
  moveBall();
  toggleVisibility();

  setTimeout(() => {
    toggleVisibility();
  }, expiredOver);
};

function onLoadPage() {
  const { classList } = BALL;
  classList.remove("load");
  classList.add("animate");

  BALL.style.display = "none";
  SETTINGS.style.display = "block";
}

const updateRangeLabel = (rangeId, labelTmplt) => {
  const range = document.getElementById(rangeId),
    label = document.querySelector(`[for="${rangeId}"]`);
  label.innerHTML = labelTmplt.replace("%VAL%", range.value);
};

const updateSpeedRangeLabel = () =>
  updateRangeLabel("speedRange", "Speed (%VAL% pixels per seconds)");
const updateDurationRangeLabel = () =>
  updateRangeLabel("durationRange", "Duration (%VAL% seconds)");

START_BALL_FORM.addEventListener("submit", startBall);
[
  ["#speedRange", updateSpeedRangeLabel],
  ["#durationRange", updateDurationRangeLabel]
].forEach(([id, func]) => {
  START_BALL_FORM.querySelector(id).addEventListener("change", func);
  func();
});

onLoadPage();
