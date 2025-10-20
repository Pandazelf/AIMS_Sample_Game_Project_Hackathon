// Game state
let collectedItems = [];
let timeLeft = 60;
let timerInterval;
let currentScenarioIndex = 0;
let safeCount = 0;
let riskyCount = 0;
let dangerCount = 0;
let lessons = [];

// Items available in the house
const items = [
    { id: 1, name: "Bottled Water", vn: "Nước đóng chai", icon: "💧", points: 10, helps: ["water", "thirst", "contaminated"] },
    { id: 2, name: "Canned Food", vn: "Thực phẩm đóng hộp", icon: "🥫", points: 8, helps: ["food", "hunger", "supplies"] },
    { id: 3, name: "First Aid Kit", vn: "Hộp sơ cứu", icon: "🩹", points: 10, helps: ["medical", "injury", "health"] },
    { id: 4, name: "Flashlight", vn: "Đèn pin", icon: "🔦", points: 9, helps: ["light", "darkness", "signal", "night"] },
    { id: 5, name: "Important Documents", vn: "Giấy tờ quan trọng", icon: "📄", points: 10, helps: ["documents", "evacuation", "id"] },
    { id: 6, name: "Phone Charger", vn: "Sạc điện thoại", icon: "🔌", points: 7, helps: ["communication", "phone", "contact"] },
    { id: 7, name: "Radio", vn: "Radio", icon: "📻", points: 8, helps: ["information", "news", "warning"] },
    { id: 8, name: "Cash Money", vn: "Tiền mặt", icon: "💵", points: 7, helps: ["money", "evacuation", "supplies", "transport"] },
    { id: 9, name: "Medicine", vn: "Thuốc men", icon: "💊", points: 9, helps: ["medical", "medicine", "health", "sick"] },
    { id: 10, name: "Instant Noodles", vn: "Mì gói", icon: "🍜", points: 6, helps: ["food", "hunger", "supplies"] },
    { id: 11, name: "Matches/Lighter", vn: "Diêm/Bật lửa", icon: "🔥", points: 6, helps: ["fire", "cooking", "warmth"] },
    { id: 12, name: "Rope", vn: "Dây thừng", icon: "🪢", points: 7, helps: ["rescue", "climbing", "emergency"] },
    { id: 13, name: "Whistle", vn: "Còi", icon: "📣", points: 7, helps: ["signal", "rescue", "alert"] },
    { id: 14, name: "Plastic Bags", vn: "Túi ni-lông", icon: "🛍️", points: 5, helps: ["waterproof", "storage", "protect"] },
    { id: 15, name: "Blanket", vn: "Chăn", icon: "🛏️", points: 6, helps: ["warmth", "cold", "shelter"] }
];

// Flood scenarios
const scenarios = [
    {
        title: "Evacuation Order",
        text: "Authorities announce: Water will rise 2 meters in 2 hours. Evacuate NOW! But you have elderly relatives who can't walk easily.",
        icon: "🚨",
        choices: [
            {
                text: "Help elderly evacuate immediately with documents and money",
                needs: ["documents", "money"],
                outcome: "safe",
                feedback: "✅ SAFE! You evacuated early with proper ID and funds. Your family reached the shelter safely. Lives saved!",
                lesson: "Always evacuate immediately when warned. Bring ID documents and cash."
            },
            {
                text: "Stay home - the house seems strong enough",
                needs: [],
                outcome: "danger",
                feedback: "❌ DANGER! Water rose faster than expected. You're trapped on the roof. Rescue teams are overwhelmed. Never ignore evacuation orders!",
                lesson: "NEVER ignore official evacuation orders. Floods can worsen rapidly."
            }
        ]
    },
    {
        title: "Thirst Crisis",
        text: "You've been at the evacuation center for 6 hours. You're very thirsty. Floodwater surrounds the building. Others are drinking it.",
        icon: "💧",
        choices: [
            {
                text: "Drink your bottled water",
                needs: ["water"],
                outcome: "safe",
                feedback: "✅ SAFE! Your clean water kept you healthy. Many who drank floodwater got diarrhea and had to be hospitalized.",
                lesson: "Always bring clean drinking water. Floodwater contains sewage, chemicals, and bacteria."
            },
            {
                text: "Drink floodwater - it looks okay",
                needs: [],
                outcome: "danger",
                feedback: "❌ DANGER! You contracted leptospirosis and severe diarrhea. You need hospital treatment. Floodwater is NEVER safe to drink!",
                lesson: "Floodwater is highly contaminated. It can cause serious diseases like cholera, typhoid, and leptospirosis."
            }
        ]
    },
    {
        title: "Night Falls",
        text: "It's dark at the evacuation center. Power is out. You hear cries for help outside but can't see anything. Rescue teams need help locating people.",
        icon: "🌙",
        choices: [
            {
                text: "Use flashlight to signal and help guide rescuers",
                needs: ["light"],
                outcome: "safe",
                feedback: "✅ SAFE! Your flashlight helped rescue teams find 3 trapped families in the dark. You saved lives! Flashlights are essential in floods.",
                lesson: "Flashlights help rescue teams locate people at night and signal for help."
            },
            {
                text: "Wait in darkness - stay still",
                needs: [],
                outcome: "risky",
                feedback: "⚠️ RISKY! Rescue teams couldn't see anyone signaling. Some people weren't found until morning. Always bring light sources.",
                lesson: "In emergencies, light sources are critical for rescue operations."
            }
        ]
    },
    {
        title: "Medical Emergency",
        text: "A child at the shelter fell and cut their leg badly. It's bleeding. The cut might get infected. Medical help is hours away.",
        icon: "🩹",
        choices: [
            {
                text: "Use first aid kit to clean and bandage the wound",
                needs: ["medical"],
                outcome: "safe",
                feedback: "✅ SAFE! You cleaned the wound properly and prevented infection. The child recovered well. First aid knowledge saves lives in disasters!",
                lesson: "First aid kits and basic medical supplies are essential in floods. Wounds can easily get infected."
            },
            {
                text: "Wash wound with floodwater nearby",
                needs: [],
                outcome: "danger",
                feedback: "❌ DANGER! The wound became severely infected from contaminated water. The child needed emergency antibiotics. Never use floodwater on wounds!",
                lesson: "Floodwater contains dangerous bacteria. Always clean wounds with clean water and antiseptic."
            }
        ]
    },
    {
        title: "Information Crisis",
        text: "Day 2 at the shelter. You hear rumors: 'Water will rise 3 more meters!' or 'We can go home tomorrow.' People are panicking. What's the truth?",
        icon: "📡",
        choices: [
            {
                text: "Listen to battery radio for official news",
                needs: ["information"],
                outcome: "safe",
                feedback: "✅ SAFE! The radio gave official updates: water will recede in 2 days, stay put. You avoided panic and made smart decisions based on facts.",
                lesson: "Always get information from official sources (radio, authorities). Rumors during disasters can be deadly."
            },
            {
                text: "Believe rumors and try to leave early",
                needs: [],
                outcome: "danger",
                feedback: "❌ DANGER! You tried to cross floodwater based on false rumors. You nearly drowned. Never trust unverified information in emergencies!",
                lesson: "In disasters, false information spreads quickly. Only trust official emergency broadcasts."
            }
        ]
    }
];

// Initialize game
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showInstructions() {
    showScreen('instructions-screen');
}

function startGame() {
    // Reset game state
    collectedItems = [];
    timeLeft = 60;
    currentScenarioIndex = 0;
    safeCount = 0;
    riskyCount = 0;
    dangerCount = 0;
    lessons = [];
    
    // Show preparation screen
    showScreen('preparation-screen');
    
    // Generate items
    generateItems();
    
    // Start timer
    startTimer();
}

function generateItems() {
    const container = document.getElementById('house-items');
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card';
        itemDiv.id = `item-${item.id}`;
        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-vn">${item.vn}</div>
        `;
        itemDiv.onclick = () => collectItem(item);
        container.appendChild(itemDiv);
    });
}

function collectItem(item) {
    // Check if already collected
    if (collectedItems.find(i => i.id === item.id)) return;
    
    // Check backpack capacity
    if (collectedItems.length >= 8) {
        alert('🎒 Backpack is full! You can only carry 8 items.');
        return;
    }
    
    // Add to collection
    collectedItems.push(item);
    
    // Update UI
    document.getElementById(`item-${item.id}`).classList.add('collected');
    document.getElementById('backpack-count').textContent = collectedItems.length;
    
    updateBackpackDisplay();
    
    // Check if backpack is full
    if (collectedItems.length === 8) {
        setTimeout(() => {
            if (confirm('🎒 Backpack full! Ready to face the flood?')) {
                endPreparation();
            }
        }, 300);
    }
}

function updateBackpackDisplay() {
    const display = document.getElementById('backpack-display');
    
    if (collectedItems.length === 0) {
        display.innerHTML = '<div class="empty-backpack">Empty - start collecting!</div>';
        return;
    }
    
    display.innerHTML = collectedItems.map(item => `
        <div class="backpack-item">
            <span class="backpack-item-icon">${item.icon}</span>
            <span>${item.name}</span>
        </div>
    `).join('');
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        // Urgent state
        if (timeLeft <= 10) {
            timerEl.classList.add('urgent');
        }
        
        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endPreparation();
        }
    }, 1000);
}

function endPreparation() {
    clearInterval(timerInterval);
    
    if (collectedItems.length === 0) {
        alert('⚠️ You didn\'t collect anything! This will be very dangerous...');
    }
    
    // Move to scenarios
    setTimeout(() => {
        showScreen('scenario-screen');
        loadScenario();
    }, 500);
}

function loadScenario() {
    if (currentScenarioIndex >= scenarios.length) {
        showResults();
        return;
    }
    
    const scenario = scenarios[currentScenarioIndex];
    
    // Update UI
    document.getElementById('scenario-number').textContent = currentScenarioIndex + 1;
    document.querySelector('.scenario-icon').textContent = scenario.icon;
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-text').textContent = scenario.text;
    
    // Show collected items
    const itemsList = document.getElementById('available-items');
    if (collectedItems.length === 0) {
        itemsList.innerHTML = '<span style="color:#999; font-style:italic;">Nothing! You\'re unprepared...</span>';
    } else {
        itemsList.innerHTML = collectedItems.map(item => 
            `<div class="available-item">${item.icon} ${item.name}</div>`
        ).join('');
    }
    
    // Load choices
    scenario.choices.forEach((choice, index) => {
        const btn = document.getElementById(`choice-${index}`);
        btn.querySelector('.choice-text').textContent = choice.text;
    });
    
    // Clear feedback
    document.getElementById('scenario-feedback').textContent = '';
    document.getElementById('scenario-feedback').className = 'scenario-feedback';
}

function makeDecision(choiceIndex) {
    const scenario = scenarios[currentScenarioIndex];
    const choice = scenario.choices[choiceIndex];
    
    // Check if player has needed items
    let hasItems = true;
    if (choice.needs && choice.needs.length > 0) {
        hasItems = choice.needs.some(need => 
            collectedItems.some(item => item.helps.includes(need))
        );
    }
    
    // Determine actual outcome
    let actualOutcome = choice.outcome;
    if (choice.needs && choice.needs.length > 0 && !hasItems) {
        // Player tried to do something but doesn't have the right items
        actualOutcome = choice.outcome === 'safe' ? 'risky' : 'danger';
    }
    
    // Show feedback
    const feedbackEl = document.getElementById('scenario-feedback');
    feedbackEl.textContent = choice.feedback;
    feedbackEl.className = `scenario-feedback ${actualOutcome}`;
    
    // Track stats
    if (actualOutcome === 'safe') safeCount++;
    else if (actualOutcome === 'risky') riskyCount++;
    else dangerCount++;
    
    // Save lesson
    if (choice.lesson) {
        lessons.push(choice.lesson);
    }
    
    // Disable buttons temporarily
    document.getElementById('choice-0').disabled = true;
    document.getElementById('choice-1').disabled = true;
    
    // Move to next scenario
    setTimeout(() => {
        document.getElementById('choice-0').disabled = false;
        document.getElementById('choice-1').disabled = false;
        currentScenarioIndex++;
        loadScenario();
    }, 4000);
}

function showResults() {
    showScreen('results-screen');
    
    // Calculate score
    const totalDecisions = safeCount + riskyCount + dangerCount;
    const score = (safeCount * 20) + (riskyCount * 10);
    
    // Update stats
    document.getElementById('safe-count').textContent = safeCount;
    document.getElementById('risky-count').textContent = riskyCount;
    document.getElementById('danger-count').textContent = dangerCount;
    
    // Determine rating
    let stars, message, bannerClass;
    
    if (safeCount >= 4) {
        stars = '⭐⭐⭐';
        message = 'EXCELLENT! You survived the flood with smart preparation and decisions. You\'re a Mekong Guardian!';
        bannerClass = 'excellent';
    } else if (safeCount >= 2) {
        stars = '⭐⭐';
        message = 'GOOD JOB! You survived but made some risky choices. Learn and prepare better next time.';
        bannerClass = 'good';
    } else {
        stars = '⭐';
        message = 'YOU SURVIVED... BARELY. Many dangerous decisions put you at serious risk. Please take flood safety seriously!';
        bannerClass = 'poor';
    }
    
    // Update results
    document.getElementById('stars').textContent = stars;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-banner').className = `result-banner ${bannerClass}`;
    
    // Show lessons
    const lessonsList = document.getElementById('lessons-list');
    if (lessons.length > 0) {
        lessonsList.innerHTML = lessons.map(lesson => 
            `<div class="lesson-item">💡 ${lesson}</div>`
        ).join('');
    } else {
        lessonsList.innerHTML = '<div class="lesson-item">Play again and try to make safer choices!</div>';
    }
}

function shareScore() {
    const stars = document.getElementById('stars').textContent;
    const message = `I scored ${stars} in Mekong Guardian - Flood Survival Game! 🌊\n\nMy Results:\n✅ Safe: ${safeCount}\n⚠️ Risky: ${riskyCount}\n❌ Danger: ${dangerCount}\n\nLearn flood safety: [Your Game URL]`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mekong Guardian - My Score',
            text: message
        }).catch(() => {
            copyToClipboard(message);
        });
    } else {
        copyToClipboard(message);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('📋 Score copied to clipboard! Share it with friends!');
    }).catch(() => {
        alert(text);
    });
}