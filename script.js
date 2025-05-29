(function () {

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

const laserPointerRow = document.getElementById("laserpointerrow");
const yarnBallRow = document.getElementById("yarnballrow");

let totalMeows = 0;
let clickTimestamps = [];
let meowsPerSecond = 0;
const catQuantities = [0, 0, 0, 0, 0, 0, 0, 0];

const catMps = [1, 5, 20, 100, 500, 2500, 15000, 100000];
const catBasePrices = [25, 150, 1000, 10000, 75000, 350000, 1250000, 10000000];
const buyCatButtons = [buyCat1Button, buyCat2Button, buyCat3Button, buyCat4Button, buyCat5Button,
    buyCat6Button, buyCat7Button, buyCat8Button];
const catTexts = [cat1Text, cat2Text, cat3Text, cat4Text, cat5Text, cat6Text, cat7Text,
    cat8Text];
const catRows = [cat1Row, cat2Row, cat3Row, cat4Row, cat5Row, cat6Row, cat7Row, cat8Row];

// Laser pointer = 0 ;
const upgradePrices = [50, 250];
const upgradeBreakPoints = [25, 100];
const upgradeActive = [0, 0];
const upgradeRows = [laserPointerRow, yarnBallRow];


function updateMeowsCounter() {
    meowsCounter.innerText = "Meows (Ⲙ): " + Math.floor(totalMeows) + " | Ⲙps: " +
        Math.floor(generateMeowsPerSecond());
    requestAnimationFrame(updateMeowsCounter);
}

function updateCatShop() {
    for (let i = 0; i < catQuantities.length; i++) {
        buyCatButtons[i].innerText = `BUY: (Ⲙ) ${getCatCost(i + 1, catQuantities[i])}`;
        catTexts[i].innerText = `Cat ${i + 1} : ${catQuantities[i]} Owned : ${getTierMps(i + 1)} Ⲙps`;
        if (i > 0 && catQuantities[i - 1] > 0) {
            catRows[i].classList.remove("hidden");
        }
    }
    requestAnimationFrame(updateCatShop);
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

    totalMeows += generateMeowsPerClick();
}

function generateMeowsPerSecondBase() {
    let total = 0;
    for (let i = 0; i < catQuantities.length; i++) {
        let mps = catMps[i];

        if (i === 0 && upgradeActive[1] === 1) mps *= 2; // yarn ball

        total += catQuantities[i] * mps;
    }
    return total;
}

function addMeowsPerSecondBase() {
    setInterval(() => {
        totalMeows += generateMeowsPerSecondBase() / 20;
    }, 50);
}

function generateMeowsPerSecond() {
    return getClicksPerSecond() * generateMeowsPerClick() + generateMeowsPerSecondBase();
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

function generateMeowsPerClick() {
    let base = 1;
    let multiplicativeMultipliers = 1;
    let additiveMultipliers = 0;

    //laser pointer
    if (upgradeActive[0] === 1) multiplicativeMultipliers *= 2;

    return (base * multiplicativeMultipliers) + additiveMultipliers;
}

function updateUpgradeRows(index) {
    let price = upgradePrices[index];
    let active = upgradeActive[index] === 1;
    let row = upgradeRows[index];
    if (!active && price <= totalMeows) {
        totalMeows -= price;
        row.classList.add("hidden");
        upgradeActive[index] = 1;
    }
}

function pollBreakPoints() {
    setInterval(() => {
        for (let i = 0; i < upgradeActive.length; i++) {
            if (upgradeActive[i] === 0) {
                if (totalMeows >= upgradeBreakPoints[i] && upgradeBreakPoints[i] >= 0) {
                    upgradeRows[i].classList.remove('hidden');
                }
            }
        }
    }, 250)
}

function main(){
    updateMeowsCounter();
    updateCatShop();
    addMeowsPerSecondBase()
    pollBreakPoints();
}
main();

window.catClicked = catClicked;
window.attemptCatBuy = attemptCatBuy;
window.updateUpgradeRows = updateUpgradeRows;

//_______________________TESTING_______________________________
let isDevMode = true; // WILL DETERMINE IF CHEATS ARE ON

if (isDevMode) {

    window.help = function () {
        console.log("Commands:\naddMeows(amount);\nsetMeows(amount);\ngiveCats(tier, quantity);\n" +
            "unlockUpgrades();");
    }

    window.addMeows = function (amount) {
        totalMeows += amount;
        console.log('Added ${amount} meows. Total: ${totalMeows}');
    };

    window.setMeows = function (amount) {
        totalMeows = amount;
        console.log('Set total meows to ${totalMeows}');
    };

    window.giveCats = function (tier, quantity) {
        if (tier < 1 || tier > catQuantities.length) {
            console.warn("Invalid tier number.");
            return;
        }
        catQuantities[tier - 1] += quantity;
        console.log('Gave ${quantity} Cat ${tier}. Owned now: ${catQuantities[tier - 1]}');
    };

    window.unlockUpgrades = function () {
        for (let i = 0; i < upgradeActive.length; i++) {
            upgradeActive[i] = 1;
            upgradeRows[i].classList.add("hidden");
        }
        console.log("All upgrades unlocked");
    };

    window.allCats = function (quantity) {
        if (quantity === undefined) quantity = 1;
        for (let i = 0; i < catQuantities.length; i++) {
            catQuantities[i] += quantity;
        }
        console.log(`Gave ${quantity} of all Cats`);
    }

    help();
}


})();