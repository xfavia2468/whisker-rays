let totalMeows = 0;
let meowsPerClick = 1;
let clickTimestamps = [];
let meowsPerSecond = 0;
const catQuantities = [0, 0, 0, 0, 0, 0, 0, 0];

const catMps = [1, 5, 20, 100, 500, 2500, 15000, 100000];
const catBasePrices = [15, 100, 800, 5000, 30000, 150000, 750000, 5000000];

const meowsCounter = document.getElementById("meowsCounter");

const buyCat1Button = document.getElementById("buycat1button");
const buyCat2Button = document.getElementById("buycat2button");
const buyCat3Button = document.getElementById("buycat3button");
const buyCat4Button = document.getElementById("buycat4button");
const buyCat5Button = document.getElementById("buycat5button");
const buyCat6Button = document.getElementById("buycat6button");
const buyCat7Button = document.getElementById("buycat7button");
const buyCat8Button = document.getElementById("buycat8button");
const cat1Text = document.getElementById("cat1text");
const cat2Text = document.getElementById("cat2text");
const cat3Text = document.getElementById("cat3text");
const cat4Text = document.getElementById("cat4text");
const cat5Text = document.getElementById("cat5text");
const cat6Text = document.getElementById("cat6text");
const cat7Text = document.getElementById("cat7text");
const cat8Text = document.getElementById("cat8text");
const cat1Row = document.getElementById("cat1row");
const cat2Row = document.getElementById("cat2row");
const cat3Row = document.getElementById("cat3row");
const cat4Row = document.getElementById("cat4row");
const cat5Row = document.getElementById("cat5row");
const cat6Row = document.getElementById("cat6row");
const cat7Row = document.getElementById("cat7row");
const cat8Row = document.getElementById("cat8row");

function updateMeowsCounter() {
    meowsCounter.innerText = "Meows (Ⲙ): " + Math.floor(totalMeows) + " | Ⲙps: " +
        Math.floor(generateMeowsPerSecond());
    requestAnimationFrame(updateMeowsCounter);
}

function updateCatShop() {
    buyCat1Button.innerText = "BUY: (Ⲙ) " + getCatCost(1, catQuantities[0]);
    cat1Text.innerText = "Cat 1 : " + catQuantities[0] + " Owned : " + getTierMps(1) +
            " Ⲙps";
    if (catQuantities[0] > 0) {
        cat2Row.classList.remove("hidden");
        buyCat2Button.innerText = "BUY: (Ⲙ) " + getCatCost(2, catQuantities[1]);
        cat2Text.innerText = "Cat 2 : " + catQuantities[1] + " Owned : " + getTierMps(2) +
            " Ⲙps";
    }
    if (catQuantities[1] > 0) {
        cat3Row.classList.remove("hidden");
        buyCat3Button.innerText = "BUY: (Ⲙ) " + getCatCost(3, catQuantities[2]);
       cat3Text.innerText = "Cat 3 : " + catQuantities[2] + " Owned : " + getTierMps(3) +
            " Ⲙps";
    }
    if (catQuantities[2] > 0) {
       cat4Row.classList.remove("hidden");
       buyCat4Button.innerText = "BUY: (Ⲙ) " + getCatCost(4, catQuantities[3]);
        cat4Text.innerText = "Cat 4 : " + catQuantities[3] + " Owned : " + getTierMps(4) +
            " Ⲙps";
    }
    if (catQuantities[3] > 0) {
        cat5Row.classList.remove("hidden");
        buyCat5Button.innerText = "BUY: (Ⲙ) " + getCatCost(5, catQuantities[4]);
        cat5Text.innerText = "Cat 5 : " + catQuantities[4] + " Owned : " + getTierMps(5) +
            " Ⲙps";
    }
    if (catQuantities[4] > 0) {
        cat6Row.classList.remove("hidden");
        buyCat6Button.innerText = "BUY: (Ⲙ) " + getCatCost(6, catQuantities[5]);
        cat6Text.innerText = "Cat 6 : " + catQuantities[5] + " Owned : " + getTierMps(6) +
            " Ⲙps";
    }
    if (catQuantities[5] > 0) {
        cat7Row.classList.remove("hidden");
        buyCat7Button.innerText = "BUY: (Ⲙ) " + getCatCost(7, catQuantities[6]);
        cat7Text.innerText = "Cat 7 : " + catQuantities[6] + " Owned : " + getTierMps(7) +
            " Ⲙps";
    }
    if (catQuantities[6] > 0) {
        cat8Row.classList.remove("hidden");
        buyCat8Button.innerText = "BUY: (Ⲙ) " + getCatCost(8, catQuantities[7]);
        cat8Text.innerText = "Cat 8 : " + catQuantities[7] + " Owned : " + getTierMps(8) +
            " Ⲙps";
    }
    if (catQuantities[7] > 0) {
    }
    requestAnimationFrame(updateCatShop)
}

function attemptCatBuy(tier) {
    const currentCost = getCatCost(tier, catQuantities[tier-1]);
    if (currentCost <= totalMeows) {
        catQuantities[tier-1] += 1;
        totalMeows -= currentCost
    }
}

let lastClickTime = 0; // for throttling
function catClicked() {
    const now = Date.now();
    if (now - lastClickTime < 100) return;
    lastClickTime = now;
    clickTimestamps.push(now);

    totalMeows += meowsPerClick;
}

function generateMeowsPerSecondBase() {
    meowsPerSecond =
      catQuantities[0] * catMps[0] +
      catQuantities[1] * catMps[1] +
      catQuantities[2] * catMps[2] +
      catQuantities[3] * catMps[3] +
      catQuantities[4] * catMps[4] +
      catQuantities[5] * catMps[5] +
      catQuantities[6] * catMps[6] +
      catQuantities[7] * catMps[7];

    return meowsPerSecond;
}

function addMeowsPerSecondBase() {
    setInterval(() => {
        totalMeows += generateMeowsPerSecondBase() / 20;
    }, 50);
}

function generateMeowsPerSecond() {
    return getClicksPerSecond() * meowsPerClick + generateMeowsPerSecondBase();
}

// this function filters out clicks older than 1 second
function getClicksPerSecond() {
  const now = Date.now();
  // keep only clicks from the last 1000ms
  clickTimestamps = clickTimestamps.filter(ts => now - ts <= 1000);
  return clickTimestamps.length;
}

function getCatCost(tier, quantityOwned) {
  const base = catBasePrices[tier-1];
  const scaling = 1.15; // can tweak between 1.07–1.25
  return Math.floor(base * Math.pow(scaling, quantityOwned));
}

function getTierMps(tier) {
  return catQuantities[tier - 1] * catMps[tier - 1];
}

function main(){
    updateMeowsCounter();
    updateCatShop();
    addMeowsPerSecondBase()
}
main();