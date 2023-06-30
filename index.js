const fs = require("fs");
const util = require("util");
const log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
const log_stdout = process.stdout;

const logger = (d) => {
  //   log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

let count = 0;
let prev = "unknown";
let max = 0;
let countHistory = [];
let maxHistory = [];
let valueCount = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  0: 0,
};

let gamble = {
  pool: 0,
  currentBet: 10,
  min: 10,
  max: 60,
  betOn: "small",
  maxBet: 10,
};

const main = () => {
  // generate random number from one to six
  const generateRandomDiceVal = () => {
    const num = Math.floor(Math.random() * 6) + 1;
    valueCount[num]++;
    valueCount[0]++;
    return num;
  };
  const dices = [
    generateRandomDiceVal(),
    generateRandomDiceVal(),
    generateRandomDiceVal(),
  ];
  const sum = dices.reduce((a, b) => a + b, 0);
  let state = "null ";
  if (sum >= 11 && sum <= 17) {
    state = "big  ";
  } else if (sum >= 4 && sum <= 10) {
    state = "small";
  }

  if (state === prev) {
    count++;
    countHistory.push(dices);
  } else {
    count = 1;
    prev = state;
    countHistory = [dices];
  }

  if (count > max) {
    max = count;
    maxHistory = countHistory;
  }

  if (gamble.betOn === state) {
    gamble.pool += gamble.currentBet;
    gamble.currentBet = gamble.min;
    logger(
      `[${state === gamble.betOn}] pool: ${gamble.pool} bet: ${
        gamble.currentBet
      } max: ${max} (${gamble.maxBet})`
    );
  } else {
    gamble.pool -= gamble.currentBet;
    logger(
      `[${state === gamble.betOn ? "win " : "lose"}] pool: ${
        gamble.pool
      } bet: ${gamble.currentBet} max: ${max} (${gamble.maxBet})`
    );
    if (gamble.currentBet <= gamble.max) {
      gamble.currentBet =
        count < 3 ? gamble.currentBet + gamble.min : gamble.currentBet * 2;
    }
  }

  if (gamble.currentBet >= gamble.maxBet) {
    gamble.maxBet = gamble.currentBet;
  }

  //   logger(
  //     `${dices} ${state} dice: ${Object.keys(valueCount)
  //       .map((val) =>
  //         val !== "0"
  //           ? `${val}: ${Number((valueCount[val] * 100) / valueCount[0])
  //               .toFixed(2)
  //               .toLocaleString("en-SG", {
  //                 minimumIntegerDigits: 2,
  //                 useGrouping: false,
  //               })}%`
  //           : null
  //       )
  //       .filter((val) => val !== null)
  //       .join(", ")} max: ${max} |${maxHistory.join("|")}|`
  //   );
};

setInterval(() => {
  main();
}, 0);
