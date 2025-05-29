(function () {

const meowsCounter = document.getElementById("meowsCounter");
const pawEffectCanvas = document.getElementById("pawEffectCanvas");

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

/* Handles paw effect on click */
const ectx = pawEffectCanvas.getContext('2d');
let paws = [];
function resizeCanvas(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(pawEffectCanvas);
document.getElementById('catButton').addEventListener('click', (e) => {
    const rect = pawEffectCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pawEmojis = ['🐾', '🐱', '😺', '😻'];
    const randomEmoji = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
    for (let i = 0; i < 1; i++) { // spawn 1 per click
        paws.push({
            x: x + Math.random() * 80 - 50,
            y: y + Math.random() * 20 - 10,
            opacity: 1,
            speed: 2 + Math.random(),
            size: 24 + Math.random() * 16,
            emoji: randomEmoji
        });
    }
});
function draw() {
    ectx.clearRect(0, 0, pawEffectCanvas.width, pawEffectCanvas.height);
    for (let i = paws.length - 1; i >= 0; i--) {
        const p = paws[i];
        ectx.globalAlpha = p.opacity;
        ectx.font = `${p.size}px Patrick Hand, sans-serif`;
        ectx.fillText(p.emoji, p.x, p.y);
        p.y -= p.speed;
        p.opacity -= 0.01;
        if (p.opacity <= 0) paws.splice(i, 1);
    }
    ectx.globalAlpha = 1;
    requestAnimationFrame(draw);
}
/*     */

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

let weatherState = "night"; // sunny, rainy, stormy, night
let nightStars = null;
let lightningFlash = false;
let lightningFlashEndTime = 0;
const weatherCanvas = document.getElementById("weatherCanvas");
const wctx = weatherCanvas.getContext('2d');
function resizeWeatherCanvas() {
    weatherCanvas.width = weatherCanvas.offsetWidth;
    weatherCanvas.height = weatherCanvas.offsetHeight;
}
window.addEventListener("resize", resizeWeatherCanvas);
resizeWeatherCanvas();
let particlesWeather = [];
function changeWeather(state) {
    weatherState = state;
    particlesWeather = [];
    if (state === "rainy" || state === "stormy") {
        for (let i = 0; i < 100; i++) {
            particlesWeather.push({
                x: Math.random() * weatherCanvas.width,
                y: Math.random() * weatherCanvas.height,
                speed: 2 + Math.random() * 3,
                length: 10 + Math.random() * 10,
            });
        }
    }

    if (state !== "night") {
        nightStars = null; // Reset stars if not night
    }
}

function drawWeather(timestamp) {
    wctx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    switch (weatherState) {
        case "sunny":
            let grd = wctx.createLinearGradient(0, 0, 0, weatherCanvas.height);
            grd.addColorStop(0, "#FFD580");
            grd.addColorStop(1, "#FFF5CC");
            wctx.fillStyle = grd;
            wctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);
            break;

        case "rainy":
        case "stormy":
            wctx.fillStyle = weatherState === "stormy" ? "#2c2c2c" : "#555";
            wctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);
            wctx.strokeStyle = "#A3D5FF";
            wctx.lineWidth = 1;
            particlesWeather.forEach(p => {
                wctx.beginPath();
                wctx.moveTo(p.x, p.y);
                wctx.lineTo(p.x, p.y + p.length);
                wctx.stroke();
                p.y += p.speed;
                if (p.y > weatherCanvas.height) {
                    p.y = -p.length;
                    p.x = Math.random() * weatherCanvas.width;
                }
            });
            if (weatherState === "stormy") {
                if (lightningFlash && performance.now() < lightningFlashEndTime) {
                    wctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                    wctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);
                } else if (Math.random() < 0.0125) {
                    lightningFlash = true;
                    lightningFlashEndTime = performance.now() + 200; // Flash duration in milliseconds
                } else {
                    lightningFlash = false;
                }
            }
            break;

        case "night":
            wctx.fillStyle = "#0d1b2a";
            wctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);

            if (!nightStars) {
                nightStars = [];
                for (let i = 0; i < 100; i++) {
                    nightStars.push({
                        x: Math.random() * weatherCanvas.width,
                        y: Math.random() * weatherCanvas.height * 0.8,
                        radius: Math.random() * 1.5 + 0.5,
                        twinkleSpeed: Math.random() * 0.002 + 0.001,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            for (let star of nightStars) {
                const alpha = 0.5 + 0.5 * Math.sin(timestamp * star.twinkleSpeed + star.phase);
                wctx.beginPath();
                wctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
                wctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                wctx.fill();
            }
            break;

    }
}

function animateWeather(timestamp) {
    drawWeather(timestamp);
    requestAnimationFrame(animateWeather);
}

function cycleWeather() {
    const weatherCycle = ["sunny", "rainy", "stormy", "night"];
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % weatherCycle.length;
        changeWeather(weatherCycle[currentIndex]);
    }, 5000);
}

function main(){
    updateMeowsCounter();
    updateCatShop();
    addMeowsPerSecondBase()
    pollBreakPoints();
    draw();
    animateWeather();
    requestAnimationFrame(animateWeather);
    cycleWeather();
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