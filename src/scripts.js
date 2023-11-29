const playerWins = "playerWins";
const computerWins = "computerWins";

const winningRulesMap = {
  paper: ["rock"],
  rock: ["scissors"],
  scissors: ["paper"],
};

let state = {
  playerWins: Number(localStorage.getItem(playerWins)) || 0,
  computerWins: Number(localStorage.getItem(computerWins)) || 0,
  playerPick: null,
  computerPick: null,
};

const renderScore = () => {
  const pointsEl = document.querySelector(".points");
  pointsEl.innerText = state.playerWins - state.computerWins;
};

const bindPickEvents = () => {
  const opt = document.querySelector(".options");
  opt.addEventListener("click", (e) => {
    const closest = e.target.closest("button");
    if (closest) {
      updateState({ playerPick: closest.dataset.pick });
      updateState({ computerPick: pickByComputer() });
      hideOptions();
      showGame();
    }
  });

  document
    .querySelector(".result__button")
    .addEventListener("click", playAgain);
};

const updateState = (newState) => {
  state = {
    ...state,
    ...newState,
  };
};

const pickByComputer = () => {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * options.length)];
};

const hideOptions = () => {
  const optionsEl = document.querySelector(".options");
  optionsEl.classList.add("slide-left");
};

const showGame = () => {
  const gameEl = document.querySelector(".game");
  gameEl.classList.add("slide-left");
  createPickedElement("player", state.playerPick);
  createPickedElement("computer", state.computerPick);
  setTimeout(() => {
    document
      .querySelector(".pick__container--placeholder")
      .classList.add("hidden");
    document.querySelector(".pick__container--computer").classList.add("grow");
  }, 500);

  showResult();
};

const showResult = () => {
  const resultEl = document.querySelector(".result__text");
  let winner;
  if (state.playerPick === state.computerPick) {
    resultEl.innerText = "DRAW";
  } else if (winningRulesMap[state.playerPick].includes(state.computerPick)) {
    resultEl.innerText = "YOU WIN";
    localStorage.setItem(playerWins, state.playerWins + 1);
    updateState({ playerWins: state.playerWins + 1 });
    winner = "player";
  } else {
    resultEl.innerText = "YOU LOSE";
    localStorage.setItem(computerWins, state.computerWins + 1);
    updateState({ computerWins: state.computerWins + 1 });
    winner = "computer";
  }

  setTimeout(() => {
    renderResult(winner);
    renderScore();
  }, 1500);
};

const renderResult = (winner) => {
  document.querySelector(".result").classList.add("shown");
  document.querySelector(".pick--player").classList.add("moved");
  document.querySelector(".pick--computer").classList.add("moved");
  if (winner) {
    const winnerEl = document.querySelector(`.pick--${winner} .button`);
    winnerEl.classList.add("winner", "circle--1");
    setTimeout(() => winnerEl.classList.add("circle--2"), 150);
    setTimeout(() => winnerEl.classList.add("circle--3"), 300);
  }
};

const createPickedElement = (user, picked) => {
  const buttonEl = document.createElement("div");
  buttonEl.classList.add("button", `button--${picked}`);
  const imgContainerEl = document.createElement("div");
  imgContainerEl.classList.add("button__img-container");
  const imgEl = document.createElement("img");
  imgEl.src = `./images/icon-${picked}.svg`;
  imgEl.alt = picked;

  imgContainerEl.appendChild(imgEl);
  buttonEl.appendChild(imgContainerEl);

  const pickContainerEl = document.querySelector(`.pick__container--${user}`);
  pickContainerEl.innerHTML = "";
  pickContainerEl.appendChild(buttonEl);
};

const playAgain = () => {
  const gameEl = document.querySelector(".game");
  gameEl.classList.remove("slide-left");

  const optionsEl = document.querySelector(".options");
  optionsEl.classList.remove("slide-left");

  document
    .querySelector(".pick__container--placeholder")
    .classList.remove("hidden");
  document.querySelector(".pick__container--computer").classList.remove("grow");

  document.querySelector(".result").classList.remove("shown");
};

const init = () => {
  renderScore();
  bindPickEvents();
};

init();
