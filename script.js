(function () {

class Tooltip {
    constructor() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'js-tooltip';
        this.tooltip.style.display = 'none';
        document.body.appendChild(this.tooltip);
        
        // Bind methods
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.move = this.move.bind(this);
    }

    show(event, content) {
        this.tooltip.innerHTML = content;
        this.tooltip.style.display = 'block';
        this.move(event);
    }

    hide() {
        this.tooltip.style.display = 'none';
    }

    move(event) {
        const margin = 15;
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        // Calculate position
        let x = event.clientX + margin;
        let y = event.clientY + margin;

        // Check if tooltip would go off screen
        if (x + tooltipRect.width > window.innerWidth) {
            x = event.clientX - tooltipRect.width - margin;
        }
        if (y + tooltipRect.height > window.innerHeight) {
            y = event.clientY - tooltipRect.height - margin;
        }

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    init() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const title = element.getAttribute('data-tooltip-title') || '';
                const description = element.getAttribute('data-tooltip-description') || '';
                const content = `
                    <div class="tooltip-title">${title}</div>
                    <div class="tooltip-description">${description}</div>
                `;
                this.show(e, content);
            });

            element.addEventListener('mousemove', this.move);
            element.addEventListener('mouseleave', this.hide);
        });
    }
}

// Create and initialize tooltip instance
const tooltip = new Tooltip();
document.addEventListener('DOMContentLoaded', () => tooltip.init());
window.reinitTooltips = () => tooltip.init();  // Add reinitialization function

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

const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
const closeSettings = document.getElementById('closeSettings');
const mpsCounterCheckbox = document.getElementById('enableMpsCounter');
const musicVolumeSlider = document.getElementById('musicVolume');
const sfxVolumeSlider = document.getElementById('sfxVolume');

const laserPointerRow = document.getElementById("laserpointerrow");
const yarnBallRow = document.getElementById("yarnballrow");
const toyMouseRow = document.getElementById("toymouserow");
const catBedRow = document.getElementById("catbedrow");
const cardboardRow = document.getElementById("cardboardrow");

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

const weatherCooldown = 120;

const upgradePrices = [50, 250, 150, 300, 1500];
const upgradeBreakPoints = [25, 100, 75, 200, 1000];
const upgradeActive = [0, 0, 0, 0, 0];
const upgradeRows = [laserPointerRow, yarnBallRow, toyMouseRow, catBedRow, cardboardRow];

let musicVolume = 50;
let backgroundMusic = new Audio("./audio/background-music.mp3");
let musicEnabled = true;
let sfxVolume = 75;
let mpsCounterOn = true;
const meowSounds = ["./audio/meow1.mp3","./audio/meow2.mp3","./audio/meow3.mp3"]

const BASE_NINE_LIVES_REQUIREMENT = 1000000;
let totalCatnip = 0;
let catnipMultiplier = 1;

const nineLivesButton = document.getElementById('nineLivesButton');
const catnipBonusText = document.getElementById('catnipBonusText');
const catnipOnResetText = document.getElementById('catnipOnResetText');

const resetAllButton = document.getElementById('resetAllButton');

const statsButton = document.getElementById('statsButton');
const statsMenu = document.getElementById('statsMenu');
const closeStats = document.getElementById('closeStats');

let gameStartTime = Date.now();
let totalMeowsGenerated = 0;
let meowsFromClicks = 0;
let meowsFromCats = 0;
let totalClicks = 0;
let bestMps = 0;

function initBackgroundMusic() {
    return new Promise((resolve) => {
        backgroundMusic.loop = true;
        backgroundMusic.volume = musicVolume / 200;

        // Start playing immediately if volume > 0
        if (musicEnabled && musicVolume > 0) {
            document.addEventListener('click', () => {
                if (backgroundMusic && !backgroundMusic.playing && musicEnabled) {
                    backgroundMusic.play();
                }
            }, { once: true });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (backgroundMusic) {
                    backgroundMusic.pause();
                }
            } else {
                if (backgroundMusic && musicEnabled && musicVolume > 0) {
                    backgroundMusic.play();
                }
            }
        });

        // Resolve immediately since dont need to wait for user interaction
        resolve();
    });
}

musicVolumeSlider.addEventListener('input', () => {
    const volume = parseInt(musicVolumeSlider.value);
    musicVolume = volume;
    if (backgroundMusic) {
        backgroundMusic.volume = volume / 200;
        if (volume === 0) {
            backgroundMusic.pause();
            musicEnabled = false;
        } else if (!backgroundMusic.playing && !document.hidden && musicEnabled) {
            backgroundMusic.play();
            musicEnabled = true;
        }
    }
    console.log(`Music volume: ${volume}`);
});

function updateMeowsCounter() {
    let mpsText = "";
    if (mpsCounterOn) {
        mpsText = " | Ⲙps: " +
        Math.floor(generateMeowsPerSecond());
    }
    meowsCounter.innerText = "Meows (Ⲙ): " + Math.floor(totalMeows) + mpsText;
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

    const pawEmojis = ['🐾', '🐱', '😺', '😻', `+${Math.floor(generateMeowsPerClick())}`];
    const randomEmoji = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
    paws.push({
        x: x + Math.random() * 80 - 50,
        y: y + Math.random() * 20 - 10,
        opacity: 1,
        speed: 4 + Math.random(),
        size: 24 + Math.random() * 16,
        emoji: randomEmoji
    });
    if (paws.length > 7) {
        paws.shift(); // remove the oldest paw (first in the array)
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
        p.opacity -= 0.05;
        if (p.opacity <= 0) paws.splice(i, 1);
    }
    ectx.globalAlpha = 1;
    requestAnimationFrame(draw);
}


function updateCatShop() {
    for (let i = 0; i < catQuantities.length; i++) {
        buyCatButtons[i].innerText = `BUY: (Ⲙ) ${getCatCost(i + 1, catQuantities[i])}`;
        catTexts[i].innerText = `Cat ${i + 1} : ${catQuantities[i]} Owned : ${Math.floor(getTierMps(i + 1))} Ⲙps`;
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
    playMeow();

    const clickValue = generateMeowsPerClick();
    totalMeows += clickValue;
    totalMeowsGenerated += clickValue;
    meowsFromClicks += clickValue;
    totalClicks++;
}

function generateMeowsPerSecondBase() {
    let total = 0;
    for (let i = 1; i <= catQuantities.length; i++) {
        total += getTierMps(i)
    }
    return total;
}

function addMeowsPerSecondBase() {
    setInterval(() => {
        const mpsValue = generateMeowsPerSecondBase() / 20;
        totalMeows += mpsValue;
        totalMeowsGenerated += mpsValue;
        meowsFromCats += mpsValue;
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
  const scaling = 1.15;

  let weatherScaling = 1.0;
  if (weatherState === "rainy") weatherScaling = 0.5;

  return Math.floor((base * Math.pow(scaling, quantityOwned)) * weatherScaling);
}

function getTierMps(tier) {
    let multiplier = 1.0;
    let weatherMultiplier = 1.0;
    if (weatherState === "stormy") weatherMultiplier = 2.0;
    if (weatherState === "rainy" && upgradeActive[3] === 1) weatherMultiplier *= 1.1; // cat bed rain bonus
    if (tier === 1 && upgradeActive[1] === 1) multiplier *= 2; // yarn ball
    return catQuantities[tier - 1] * catMps[tier - 1] * weatherMultiplier * multiplier * catnipMultiplier;
}

function generateMeowsPerClick() {
    let base = 1;
    let multiplicativeMultipliers = 1;
    let additiveMultipliers = 0;

    //laser pointer
    if (upgradeActive[0] === 1) multiplicativeMultipliers *= 2;
    //toy mouse
    if (upgradeActive[2] === 1) additiveMultipliers += 1;
    //cardboard box
    if (upgradeActive[4] === 1) {
        let uniqueCatTypes = 0;
        for (let i = 0; i < catQuantities.length; i++) {
            if (catQuantities[i] > 0) uniqueCatTypes++;
        }
        multiplicativeMultipliers *= (1 + (0.05 * uniqueCatTypes));
    }
    //weather
    if (weatherState === "night") additiveMultipliers += 1;

    return ((base + additiveMultipliers) * multiplicativeMultipliers) * catnipMultiplier;
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

let weatherState = "sunny"; // sunny, rainy, stormy, night
let nightStars = null;
let lightningFlash = false;
let timeUntilWeatherChange = 30;
let lightningFlashEndTime = 0;
const backdropImage = document.getElementById("backdropImage");
const weatherCanvas = document.getElementById("weatherCanvas");
const weatherText = document.getElementById("weatherText");
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
                length: 5 + Math.random() * 10,
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
            backdropImage.src = "./images/sunnyBackdrop.png";
            let grd = wctx.createLinearGradient(0, 0, 0, weatherCanvas.height);
            grd.addColorStop(0, "#9ebfed");
            grd.addColorStop(1, "#b2ccf1");
            wctx.fillStyle = grd;
            wctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);
            break;

        case "rainy":
        case "stormy":
            backdropImage.src = "./images/nightBackdrop.png";
            wctx.fillStyle = weatherState === "stormy" ? "#2c2c2c" : "#979797";
            wctx.fillRect(0, 0, weatherCanvas.width, weatherCanvas.height);
            wctx.strokeStyle = "#b5dbfb";
            wctx.lineWidth = Math.random()*0.7 + 0.3;
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
                } else if (Math.random() < 0.005) {
                    lightningFlash = true;
                    lightningFlashEndTime = performance.now() + 200; // Flash duration in milliseconds
                } else {
                    lightningFlash = false;
                }
            }
            break;

        case "night":
            backdropImage.src = "./images/nightBackdrop.png";
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
    const weatherCycle = ["rainy", "stormy", "night"];
    const weatherOdds = [2,1,3];

    if (weatherState !== "sunny") {
        weatherState = "sunny";
    }
    else {
        const totalWeight = weatherOdds.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < weatherCycle.length; i++) {
            random -= weatherOdds[i];
            if (random < 0) {
                changeWeather(weatherCycle[i]);
                updateWeatherTimer();
                break;
            }
        }
    }
}

function weatherTimer() {
    setInterval(() => {
        timeUntilWeatherChange -= 1;
        updateWeatherTimer();
        if (timeUntilWeatherChange <= 0) {
            timeUntilWeatherChange = weatherCooldown;
            cycleWeather();
        }
    }, 1000);
}

function updateWeatherTimer() {
    let timer = secondsToMinutesSeconds(timeUntilWeatherChange);
    let vanityWeather = weatherState.charAt(0).toUpperCase() + weatherState.slice(1);
    let vanityDescription = "";
    switch (weatherState) {
        case "sunny":
            vanityDescription = "";
            break;
        case "rainy":
            vanityDescription = " | Cats are 50% off!";
            break;
        case "stormy":
            vanityDescription = " | Boosts cat Ⲙps x2";
            break;
        case "night":
            vanityDescription = " | Gain an additional Ⲙ per click";
            break;
    }

    weatherText.innerText = vanityWeather + " | " + "Changes in " + timer + vanityDescription;
}

function secondsToMinutesSeconds(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (seconds < 10) {
        return ""+minutes+":0"+seconds;
    }
    return ""+minutes+":"+seconds;
}

settingsButton.addEventListener('click', () => {
    if (settingsMenu.classList.contains('hidden')) {
        settingsMenu.classList.remove('hidden');
        statsMenu.classList.add('hidden');
    } else {
        settingsMenu.classList.add('hidden');
    }
});

closeSettings.addEventListener('click', () => {
    settingsMenu.classList.add('hidden');
});

mpsCounterCheckbox.addEventListener('change', () => {
    if (mpsCounterCheckbox.checked) {
        mpsCounterOn = true;
        console.log('Ⲙps counter enabled');
    } else {
        mpsCounterOn = false;
        console.log('Ⲙps counter disabled');
    }
});

musicVolumeSlider.addEventListener('input', () => {
    const volume = parseInt(musicVolumeSlider.value);
    musicVolume = volume;
    console.log(`Music volume: ${volume}`);
});

sfxVolumeSlider.addEventListener('input', () => {
    const volume = parseInt(sfxVolumeSlider.value);
    sfxVolume = volume;
    console.log(`SFX volume: ${volume}`);
});

function playMeow() {
    let meowToPlay = meowSounds[Math.floor(Math.random() * meowSounds.length)];
    const meow = new Audio(meowToPlay);
    meow.volume = sfxVolume / 100;
    meow.play();
}

function calculateCatnipGain() {
    // Square root of total meows divided by 100,000 (rounded down)
    return Math.floor(Math.sqrt(totalMeows / 100000));
}

function getNineLivesRequirement() {
    // Each catnip makes the next reset require 50% more meows
    return Math.floor(BASE_NINE_LIVES_REQUIREMENT * Math.pow(1.5, totalCatnip));
}

function formatLargeNumber(num) {
    num = Math.floor(num);
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
}

function updateNineLivesDisplay() {
    const requirement = getNineLivesRequirement();
    const catnipGain = calculateCatnipGain();
    const nextMilestone = Math.ceil(Math.sqrt((requirement * 100000) / Math.pow(100000, 2))) + 1;
    const meowsForNextCatnip = Math.pow(nextMilestone, 2) * 100000;
    const progress = ((totalMeows / meowsForNextCatnip) * 100).toFixed(1);
    
    document.getElementById('nineLivesInfo').innerHTML = `
        <div class="nineLivesStats">
            <div class="nineLivesStat">
                <p>Current Catnip</p>
                <span>${totalCatnip} | +${((catnipMultiplier - 1) * 100).toFixed(1)}%</span>
            </div>
            <div class="nineLivesStat">
                <p>Catnip on Reset</p>
                <span>${catnipGain}</span>
            </div>
            <div class="nineLivesStat">
                <p>Progress to Next</p>
                <span>${progress}%</span>
            </div>
        </div>
        <button id="nineLivesButton" class="nineLivesButton" 
            data-tooltip 
            data-tooltip-title="Nine Lives Mode" 
            data-tooltip-description="Trade your current progress for Catnip, which permanently increases all Meow production!"
            ${totalMeows >= requirement ? '' : 'disabled'}>
            ${totalMeows >= requirement ? `Reset for ${catnipGain} Catnip` : `Requires ${formatLargeNumber(requirement)} Meows`}
        </button>
    `;
    
    // Re-attach the click handler
    document.getElementById('nineLivesButton').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset? You will lose all progress but gain Catnip!')) {
            performNineLivesReset();
        }
    });

    // Reinitialize tooltips after updating the display
    window.reinitTooltips();
}

function performNineLivesReset() {
    const requirement = getNineLivesRequirement();
    if (totalMeows < requirement) return;
    
    // Calculate catnip gain
    const catnipGain = calculateCatnipGain();
    totalCatnip += catnipGain;
    
    // Update multiplier (each catnip gives 1% bonus)
    catnipMultiplier = 1 + (totalCatnip * 0.01);
    
    totalMeows = 0;
    catQuantities.fill(0);
    upgradeActive.fill(0);
    
    upgradeRows.forEach(row => row.classList.add('hidden'));
    
    for (let i = 1; i < catRows.length; i++) {
        catRows[i].classList.add('hidden');
    }
    
    const prestigeSound = new Audio('./audio/prestige.mp3');
    prestigeSound.volume = sfxVolume / 100;
    prestigeSound.play();
    
    updateNineLivesDisplay();
}

resetAllButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
        // Reset all game variables
        totalMeows = 0;
        catQuantities.fill(0);
        upgradeActive.fill(0);
        totalCatnip = 0;
        catnipMultiplier = 1;
        clickTimestamps = [];
        meowsPerSecond = 0;
        
        // Hide all upgrade rows
        upgradeRows.forEach(row => row.classList.add('hidden'));
        
        // Hide all cat rows except the first
        for (let i = 1; i < catRows.length; i++) {
            catRows[i].classList.add('hidden');
        }

        // Reset weather
        timeUntilWeatherChange = weatherCooldown;
        changeWeather('sunny');
        
        const resetSound = new Audio('./audio/meow1.mp3');
        resetSound.volume = sfxVolume / 100;
        resetSound.play();
        
        // Update displays
        updateNineLivesDisplay();
        
        settingsMenu.classList.add('hidden');
        
        // Reset stats
        gameStartTime = Date.now();
        totalMeowsGenerated = 0;
        meowsFromClicks = 0;
        meowsFromCats = 0;
        totalClicks = 0;
        bestMps = 0;
        
        updateStats();
    }
});

// Modify the stats button event listener
statsButton.addEventListener('click', () => {
    if (statsMenu.classList.contains('hidden')) {
        updateStats();
        statsMenu.classList.remove('hidden');
        settingsMenu.classList.add('hidden');
    } else {
        statsMenu.classList.add('hidden');
    }
});

closeStats.addEventListener('click', () => {
    statsMenu.classList.add('hidden');
});

function updateStats() {
    // Production stats
    document.getElementById('totalMeowsGenerated').textContent = formatLargeNumber(totalMeowsGenerated);
    document.getElementById('meowsFromClicks').textContent = formatLargeNumber(meowsFromClicks);
    document.getElementById('meowsFromCats').textContent = formatLargeNumber(meowsFromCats);
    document.getElementById('currentClickValue').textContent = formatLargeNumber(generateMeowsPerClick());

    // Multiplier stats
    let clickMultiplier = 1;
    if (upgradeActive[0]) clickMultiplier *= 2; // Laser pointer
    if (upgradeActive[2]) clickMultiplier += 1; // Toy mouse
    document.getElementById('clickMultiplier').textContent = clickMultiplier.toFixed(2) + 'x';
    
    let catMultiplier = 1;
    if (upgradeActive[1]) catMultiplier *= 2; // Yarn ball
    document.getElementById('catMultiplier').textContent = catMultiplier.toFixed(2) + 'x';
    
    let weatherMultiplier = 1;
    if (weatherState === "stormy") weatherMultiplier = 2;
    if (weatherState === "rainy" && upgradeActive[3]) weatherMultiplier *= 1.1;
    document.getElementById('weatherMultiplier').textContent = weatherMultiplier.toFixed(2) + 'x';
    
    document.getElementById('catnipMultiplierStat').textContent = catnipMultiplier.toFixed(2) + 'x';

    // Time stats
    const playtime = Math.floor((Date.now() - gameStartTime) / 1000);
    const hours = Math.floor(playtime / 3600);
    const minutes = Math.floor((playtime % 3600) / 60);
    const seconds = playtime % 60;
    document.getElementById('totalPlaytime').textContent = 
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('totalClicks').textContent = totalClicks;
    
    const currentMps = generateMeowsPerSecond();
    bestMps = Math.max(bestMps, currentMps);
    document.getElementById('bestMps').textContent = formatLargeNumber(bestMps);
}

// Add stats update interval
setInterval(updateStats, 1000);

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = loadingScreen.querySelector('h2');
    const imageList = Array.from(document.images); // lock snapshot
    const totalResources = imageList.length + 1; // +1 for bg music
    let loadedResources = 0;

    function updateProgress(progress, text = null) {
        loadingBar.style.width = `${progress}%`;
        if (text) {
            loadingText.textContent = text;
        }
    }

    let gameInitialized = false;
    function updateResourceProgress() {
        const progress = (loadedResources / totalResources) * 50; // Resources are first 50%
        updateProgress(progress, "Loading Resources...");
        console.log(loadedResources); //////////////////aaa
        if (loadedResources >= totalResources && !gameInitialized) {
            gameInitialized = true;
            initializeGame();
        }
    }

    async function initializeGame() {
        // Start initializing game systems
        updateProgress(50, "Initializing Game Systems...");
        
        // Initialize core systems
        updateMeowsCounter();
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(60, "Setting up Meow Counter...");
        
        updateCatShop();
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(70, "Preparing Cat Shop...");
        
        addMeowsPerSecondBase();
        pollBreakPoints();
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(80, "Configuring Game Logic...");
        
        draw();
        updateWeatherTimer();
        animateWeather();
        weatherTimer();
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(90, "Setting up Weather System...");
        
        await initBackgroundMusic();
        await updateNineLivesDisplay();
        setInterval(updateNineLivesDisplay, 1000);
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(100, "Starting Game...");

        // Final delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove loading screen
        loadingScreen.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        loadingScreen.remove();
    }

    // Track image loading
    imageList.forEach(img => {
        if (img.complete) {
            loadedResources++;
            updateResourceProgress();
        } else {
            const onLoadOrError = () => {
                img.removeEventListener('load', onLoadOrError);
                img.removeEventListener('error', onLoadOrError);
                loadedResources++;
                updateResourceProgress();
            };
            img.addEventListener('load', onLoadOrError);
            img.addEventListener('error', onLoadOrError);
        }
    });


    // Track audio loading
    function preloadAudio(url) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => {
                loadedResources++;
                updateResourceProgress();
                resolve();
            });
            audio.addEventListener('error', () => {
                loadedResources++;
                updateResourceProgress();
                console.error('Failed to load audio:', url);
                resolve();
            });
            audio.src = url;
        });
    }

    Promise.all([
        preloadAudio('./audio/background-music.mp3')
    ]).catch(console.error);
}

// Initialize loading screen when DOM is ready
document.addEventListener('DOMContentLoaded', initLoadingScreen);

// Export necessary functions to window
window.catClicked = catClicked;
window.attemptCatBuy = attemptCatBuy;
window.updateUpgradeRows = updateUpgradeRows;

//_______________________TESTING_______________________________
let isDevMode = true; // WILL DETERMINE IF CHEATS ARE ON

if (isDevMode) {

    window.help = function () {
        console.log("Commands:\naddMeows(amount)\nsetMeows(amount)\ngiveCats(tier, quantity)\n" +
            "allCats()\nunlockUpgrades()\nsetWeather(weather)");
    }

    window.addMeows = function (amount) {
        totalMeows += amount;
        console.log(`Added ${amount} meows. Total: ${totalMeows}`);
    };

    window.setMeows = function (amount) {
        totalMeows = amount;
        console.log(`Set total meows to ${totalMeows}`);
    };

    window.giveCats = function (tier, quantity) {
        if (tier < 1 || tier > catQuantities.length) {
            console.warn("Invalid tier number.");
            return;
        }
        catQuantities[tier - 1] += quantity;
        console.log(`Gave ${quantity} Cat ${tier}. Owned now: ${catQuantities[tier - 1]}`);
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

    window.setWeather = function (weather) {
        changeWeather(weather);
    }

    help();
}


})();