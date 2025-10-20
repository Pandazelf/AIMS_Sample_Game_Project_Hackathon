// Game state
let collectedItems = [];
let timeLeft = 60;
let timerInterval;
let currentScenarioIndex = 0;
let selectedScenarios = [];
let safeCount = 0;
let riskyCount = 0;
let dangerCount = 0;
let lessons = [];

// Items available in the house
const items = [
  {
    id: 1,
    name: "Bottled Water",
    vn: "Nước đóng chai",
    icon: "💧",
    points: 10,
    helps: ["water", "thirst", "contaminated", "drink"],
    consumable: true,
  },
  {
    id: 2,
    name: "Food",
    vn: "Đồ ăn",
    icon: "🥫",
    points: 8,
    helps: ["food", "hunger", "supplies", "eat"],
    consumable: true,
  },
  {
    id: 3,
    name: "First Aid Kit",
    vn: "Hộp sơ cứu",
    icon: "🩹",
    points: 10,
    helps: ["medical", "injury", "health", "wound", "sick"],
    consumable: true,
  },
  {
    id: 4,
    name: "Flashlight",
    vn: "Đèn pin",
    icon: "🔦",
    points: 9,
    helps: ["light", "darkness", "signal", "night", "rescue"],
    consumable: false,
  },
  {
    id: 5,
    name: "Important Documents",
    vn: "Giấy tờ quan trọng",
    icon: "📄",
    points: 10,
    helps: ["documents", "evacuation", "id", "insurance"],
    consumable: false,
  },
  {
    id: 6,
    name: "Phone",
    vn: "Điện thoại",
    icon: "📱",
    points: 7,
    helps: ["communication", "phone", "contact"],
    consumable: false,
  },
  {
    id: 7,
    name: "Radio",
    vn: "Radio",
    icon: "📻",
    points: 8,
    helps: ["information", "news", "warning", "updates"],
    consumable: false,
  },
  {
    id: 8,
    name: "Cash Money",
    vn: "Tiền mặt",
    icon: "💵",
    points: 7,
    helps: ["money", "evacuation", "supplies", "transport", "emergency"],
    consumable: true,
  },
  {
    id: 9,
    name: "Medicine",
    vn: "Thuốc men",
    icon: "💊",
    points: 9,
    helps: ["medical", "medicine", "health", "sick", "chronic"],
    consumable: true,
  },
  {
    id: 10,
    name: "Matches/Lighter",
    vn: "Diêm/Bật lửa",
    icon: "🔥",
    points: 6,
    helps: ["fire", "cooking", "warmth", "signal"],
    consumable: false,
  },
  {
    id: 11,
    name: "Rope",
    vn: "Dây thừng",
    icon: "🪢",
    points: 7,
    helps: ["rescue", "climbing", "emergency", "escape"],
    consumable: false,
  },
  {
    id: 12,
    name: "Whistle",
    vn: "Còi",
    icon: "📣",
    points: 7,
    helps: ["signal", "rescue", "alert", "attention"],
    consumable: false,
  },
  {
    id: 13,
    name: "Plastic Bags",
    vn: "Túi ni-lông",
    icon: "🛍️",
    points: 5,
    helps: ["waterproof", "storage", "protect", "documents"],
    consumable: true,
  },
  {
    id: 14,
    name: "Blanket",
    vn: "Chăn",
    icon: "🛏️",
    points: 6,
    helps: ["warmth", "cold", "shelter", "comfort"],
    consumable: false,
  },
];

// 20 Scenarios
const allScenarios = [
  // EVACUATION & WARNINGS
  {
    title: "Immediate Evacuation Order",
    text: "Authorities announce Level 3 flood warning: Water will rise 2 meters in 2 hours. Evacuate NOW! Your elderly neighbor can't walk.",
    icon: "🚨",
    choices: [
      {
        text: "Help elderly neighbor evacuate with documents and cash for transport",
        needs: ["documents", "money"],
        consumes: ["money"],
        outcome: "safe",
        feedback:
          "✅ SAFE! You used cash for emergency transport. Both families reached shelter safely. Money well spent! 💵 [-Cash]",
        lesson:
          "Emergency cash is for life-saving expenses like transport during evacuation.",
      },
      {
        text: "Show documents to get priority evacuation assistance",
        needs: ["documents"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Documents proved residency and got you both on official evacuation bus. 📄 [Documents kept]",
        lesson:
          "Important documents help authorities assist you efficiently during emergencies.",
      },
      {
        text: "Help neighbor walk to shelter together slowly",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You made it but barely. Water was rising fast. Having transport money would have been safer.",
        lesson:
          "Walking during evacuation is risky when time is limited. Plan transport ahead.",
      },
      {
        text: "Stay home - the house seems strong enough",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Water rose faster than predicted. You're trapped on the roof. Never ignore evacuation orders!",
        lesson:
          "NEVER ignore official evacuation orders. Floods can escalate within minutes.",
      },
    ],
  },
  {
    title: "False Alarm Dilemma",
    text: "You hear conflicting reports: Some say evacuate, others say it's a false alarm. Your family is tired from evacuating last week.",
    icon: "📢",
    choices: [
      {
        text: "Listen to battery radio for verified official information",
        needs: ["information"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Radio confirmed it's real. You evacuated in time. Always trust official broadcasts! 📻 [Radio kept]",
        lesson:
          "Official emergency broadcasts (radio/TV) are the most reliable during disasters.",
      },
      {
        text: "Check phone for official government alerts",
        needs: ["phone"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Government SMS confirmed evacuation. You acted on verified info. 📱 [Phone kept]",
        lesson:
          "Government emergency SMS systems provide verified information during disasters.",
      },
      {
        text: "Ask neighbors what they're doing and follow majority",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Most neighbors evacuated so you did too. Turned out to be real but following crowds is unreliable.",
        lesson:
          "Following crowds without verified info is risky. Seek official sources.",
      },
      {
        text: "Assume it's another false alarm and stay put",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! This time it was real. You're now trapped with rising water. Never gamble with warnings!",
        lesson:
          "Treat every official warning as real. It's better to evacuate unnecessarily than risk death.",
      },
    ],
  },
  {
    title: "Night-Time Evacuation",
    text: "Evacuation order at 2 AM. It's pitch dark and raining heavily. You can barely see the road.",
    icon: "🌙",
    choices: [
      {
        text: "Use flashlight to navigate safely to shelter",
        needs: ["light"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Flashlight helped you avoid obstacles and dangerous water. Reached shelter safely! 🔦 [Flashlight kept]",
        lesson:
          "Flashlights are critical for night evacuations. Keep batteries fresh always.",
      },
      {
        text: "Use phone flashlight to see the path",
        needs: ["phone"],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Phone battery drained to 2% but you made it. Dedicated flashlights are more reliable. 📱 [Phone kept, low battery]",
        lesson:
          "Phone flashlights drain battery fast. Carry dedicated flashlights for emergencies.",
      },
      {
        text: "Follow others who have lights and stay close",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You stumbled several times in darkness but followed others safely. Having your own light is crucial.",
        lesson:
          "Relying on others' light sources is risky. Always bring your own emergency lighting.",
      },
      {
        text: "Wait until morning when you can see better",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! By morning, water was chest-high. You couldn't escape. Never delay evacuation!",
        lesson:
          "Evacuate immediately regardless of time. Waiting for daylight can be fatal.",
      },
    ],
  },
  {
    title: "Vehicle or Walk?",
    text: "Roads are starting to flood. The evacuation center is 2km away. Water is ankle-deep and rising fast.",
    icon: "🛵",
    choices: [
      {
        text: "Walk carefully with flashlight to spot hidden dangers",
        needs: ["light"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Flashlight revealed manholes and obstacles. You arrived safely on foot. 🔦 [Flashlight kept]",
        lesson:
          "Walking is often safer than vehicles in floods. 30cm of water can sweep away cars.",
      },
      {
        text: "Use rope to guide yourself while walking through water",
        needs: ["rescue"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Rope helped you stay balanced in current and mark safe path. Smart thinking! 🪢 [Rope kept]",
        lesson:
          "Rope can be lifesaving in floods - for balance, rescue, and marking safe routes.",
      },
      {
        text: "Walk slowly and feel ground with each step carefully",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You nearly fell into a hidden manhole but caught yourself. Made it but very dangerous without light.",
        lesson:
          "Walking in floods without visibility tools is extremely dangerous. Carry flashlights.",
      },
      {
        text: "Drive motorbike quickly to beat rising water",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Bike stalled in water. Engine ruined. You had to abandon it and walk anyway in deeper water!",
        lesson:
          "Never drive through floodwater. Engines fail and currents sweep vehicles away.",
      },
    ],
  },

  // WATER SAFETY & CONTAMINATION
  {
    title: "Thirst Crisis at Shelter",
    text: "You've been at evacuation center for 8 hours. You're very thirsty. Water distribution ran out. Floodwater is outside.",
    icon: "💧",
    choices: [
      {
        text: "Drink your bottled water",
        needs: ["water"],
        consumes: ["water"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your clean water kept you healthy while others got sick from floodwater. Preparation paid off! 💧 [-Bottled Water used]",
        lesson:
          "Always bring clean drinking water. Floodwater contains sewage, chemicals, and deadly bacteria.",
      },
      {
        text: "Share your water with sick child, go thirsty yourself",
        needs: ["water"],
        consumes: ["water"],
        outcome: "safe",
        feedback:
          "✅ SAFE! You prioritized a vulnerable child. Officials arrived with water later. Your compassion saved a life! 💧 [-Water shared]",
        lesson:
          "In disasters, prioritize children, elderly, and sick. Community solidarity saves lives.",
      },
      {
        text: "Wait patiently for officials to bring more clean water",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You became dehydrated waiting. Help arrived 6 hours later. You needed medical attention for dehydration.",
        lesson:
          "Bring your own supplies. Emergency services can be delayed during major disasters.",
      },
      {
        text: "Drink floodwater - you're too thirsty to wait",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! You contracted leptospirosis. Hospitalized for weeks. Floodwater is NEVER safe regardless of appearance!",
        lesson:
          "Floodwater appearance is deceiving. It contains invisible bacteria, viruses, and sewage.",
      },
    ],
  },
  {
    title: "Cooking Water Dilemma",
    text: "Day 3 at shelter. You're hungry and have instant noodles. Only floodwater available nearby.",
    icon: "🍜",
    choices: [
      {
        text: "Use your bottled water to cook noodles safely",
        needs: ["water", "food"],
        consumes: ["water", "food"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Hot noodles with clean water kept you healthy and fed. Smart resource use! 💧🍜 [-Water & Noodles used]",
        lesson:
          "Use clean water for all food preparation. It's worth consuming your supplies safely.",
      },
      {
        text: "Eat noodles dry without cooking to avoid using bad water",
        needs: ["food"],
        consumes: ["food"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Dry noodles aren't tasty but kept you fed and healthy. Avoided contaminated water! 🍜 [-Noodles eaten dry]",
        lesson:
          "In emergencies, uncooked food is safer than food prepared with contaminated water.",
      },
      {
        text: "Trade noodles with someone who has clean water",
        needs: ["food"],
        consumes: ["food"],
        outcome: "safe",
        feedback:
          "✅ SAFE! You traded noodles for clean water. Lost food but stayed healthy. Smart bartering! 🍜 [-Noodles traded]",
        lesson:
          "In disasters, trading and sharing resources helps everyone survive safely.",
      },
      {
        text: "Cook noodles with floodwater - you're starving",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Severe food poisoning. Now dehydrated and need IV fluids. Hunger isn't worth risking death!",
        lesson:
          "Contaminated water in cooking still causes disease. Always use clean water or eat dry food.",
      },
    ],
  },
  {
    title: "Wound in Floodwater",
    text: "You cut your foot on submerged debris. It's bleeding. You're waist-deep in floodwater trying to reach dry ground.",
    icon: "🩸",
    choices: [
      {
        text: "Use first aid kit immediately - clean and bandage",
        needs: ["medical"],
        consumes: ["medical"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Antiseptic and bandages prevented infection. First aid knowledge saved you from sepsis! 🩹 [-First Aid Kit used]",
        lesson:
          "Wounds exposed to floodwater must be cleaned immediately with antiseptic.",
      },
      {
        text: "Wrap wound with plastic bag to keep water out temporarily",
        needs: ["waterproof"],
        consumes: ["waterproof"],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Plastic helped but water still got in. Minor infection developed but treatable. 🛍️ [-Plastic Bag used]",
        lesson:
          "Waterproofing wounds helps but proper medical treatment is still essential ASAP.",
      },
      {
        text: "Get out of water quickly and wash wound with any clean water available",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You rinsed it but without antiseptic. Mild infection developed. Better than nothing but not ideal.",
        lesson:
          "Cleaning wounds immediately is good but antiseptic treatment is essential for flood wounds.",
      },
      {
        text: "Ignore it - just a small cut, focus on escaping first",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Wound became infected. You developed sepsis and needed ICU. Small cuts in floods can kill!",
        lesson:
          "Any wound exposed to floodwater can cause life-threatening infections. Never ignore cuts.",
      },
    ],
  },
  {
    title: "Baby Formula Emergency",
    text: "A mother at shelter needs water to prepare baby formula. Only floodwater available. The baby is crying from hunger.",
    icon: "🍼",
    choices: [
      {
        text: "Give her your bottled water - babies are priority",
        needs: ["water"],
        consumes: ["water"],
        outcome: "safe",
        feedback:
          "✅ SAFE! You saved an infant from waterborne disease. Officials brought more water later. Hero! 💧 [-Water given to baby]",
        lesson:
          "Babies are most vulnerable to contaminated water. Always prioritize them.",
      },
      {
        text: "Help boil floodwater thoroughly with matches (20+ minutes)",
        needs: ["fire"],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Boiling helped but baby still got mild diarrhea. Infant immune systems too weak. 🔥 [Matches kept]",
        lesson:
          "Even boiled floodwater is too risky for infants. They need clean bottled water only.",
      },
      {
        text: "Help mother contact medical team for emergency infant supplies",
        needs: [],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Medical team had emergency infant formula and clean water. Proper channels saved the baby!",
        lesson:
          "Infant emergencies should be reported to medical staff immediately. They have proper supplies.",
      },
      {
        text: "Suggest using floodwater - it's an emergency",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Baby contracted severe diarrhea and dehydration. Emergency hospitalization needed. Babies die from this!",
        lesson:
          "Never give infants contaminated water under any circumstances. Seek medical help instead.",
      },
    ],
  },

  // MEDICAL EMERGENCIES
  {
    title: "Chronic Medication Emergency",
    text: "An elderly person forgot their heart medication at home. They need it daily. The flooded house is risky to access.",
    icon: "💊",
    choices: [
      {
        text: "Give them your medicine if it's similar type",
        needs: ["medicine"],
        consumes: ["medicine"],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Similar medication helped temporarily but had side effects. Needed proper prescription. 💊 [-Medicine shared]",
        lesson:
          "Don't share prescription medications without medical approval. Different conditions need specific drugs.",
      },
      {
        text: "Use phone to call medical helicopter for emergency delivery",
        needs: ["phone"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! You called emergency services. Helicopter brought medication and doctor. Proper protocol! 📱 [Phone kept]",
        lesson:
          "Chronic conditions without medication are medical emergencies. Use proper emergency channels.",
      },
      {
        text: "Use radio to coordinate with shelter medical team",
        needs: ["information"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Medical team had emergency supplies. Gave temporary medication. Never return to flooded buildings! 📻 [Radio kept]",
        lesson:
          "Always bring medications during evacuation. Emergency teams can provide temporary replacements.",
      },
      {
        text: "Alert shelter staff and monitor person's condition closely",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Staff helped but person's condition worsened before medication arrived. Earlier medical contact needed.",
        lesson:
          "Medical emergencies require immediate professional help. Don't wait for conditions to worsen.",
      },
    ],
  },
  {
    title: "Child with High Fever",
    text: "A 3-year-old develops high fever (40°C). Parents panicking. Closest hospital is flooded.",
    icon: "🌡️",
    choices: [
      {
        text: "Use first aid kit to cool child with wet cloth, call for help",
        needs: ["medical", "phone"],
        consumes: ["medical"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Cooling treatment bought time while medical team arrived. First aid saved a life! 🩹📱 [-First Aid used, Phone kept]",
        lesson:
          "Basic first aid (cooling for fever) can save lives while waiting for professional help.",
      },
      {
        text: "Wrap child in damp cloth and call emergency services",
        needs: ["phone"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! You called for help immediately and cooled child. Medical team arrived in time. 📱 [Phone kept]",
        lesson:
          "High fevers in children are medical emergencies. Call for help immediately while providing first aid.",
      },
      {
        text: "Cool child with wet cloth and monitor closely until help arrives",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Cooling helped but fever stayed high. Needed medical intervention sooner. Alert medical staff immediately!",
        lesson:
          "High fevers (40°C+) in children need immediate professional medical attention.",
      },
      {
        text: "Wait for fever to break naturally - fevers are common",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Fever was from infection. Child developed seizures from high temperature. Emergency hospitalization!",
        lesson:
          "Never ignore high fevers in children. They can cause brain damage or death within hours.",
      },
    ],
  },
  {
    title: "Diabetic Emergency",
    text: "Someone shows signs of diabetic shock: confused, sweating, shaking. They haven't eaten in 18 hours.",
    icon: "🍽️",
    choices: [
      {
        text: "Give them your instant noodles immediately and call medical help",
        needs: ["food", "phone"],
        consumes: ["food"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Quick carbs stabilized them while medics arrived. You recognized hypoglycemia! 🍜📱 [-Noodles given, Phone kept]",
        lesson:
          "Diabetics need regular food. Low blood sugar is life-threatening. Give sugar/food immediately.",
      },
      {
        text: "Share your canned food and water",
        needs: ["food", "water"],
        consumes: ["food", "water"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Food raised blood sugar, water helped hydration. You prevented a crisis through sharing! 🥫💧 [-Food & Water shared]",
        lesson:
          "Sharing food can literally save lives, especially for diabetics with medical needs.",
      },
      {
        text: "Find any food from others and get medical help immediately",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You got help but person nearly passed out while waiting. Having emergency food saves critical minutes.",
        lesson:
          "Emergency food supplies help stabilize diabetics while waiting for medical help.",
      },
      {
        text: "Lay them down and wait for them to rest",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Person fell into diabetic coma. Needed immediate glucose IV. Minutes matter in diabetic emergencies!",
        lesson:
          "Diabetic emergencies require immediate food AND medical help. Waiting causes coma or death.",
      },
    ],
  },

  // RESCUE & SIGNALING
  {
    title: "Rescue Helicopter Overhead",
    text: "Day 4: You hear helicopter searching for stranded people. You're on a rooftop with others. Trees block the view.",
    icon: "🚁",
    choices: [
      {
        text: "Use flashlight and whistle to signal location",
        needs: ["light", "signal"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Helicopter spotted signals immediately. All rescued! Flashlight and whistle are lifesaving! 🔦📣 [Both kept]",
        lesson:
          "Visual and audio signals combined increase rescue chances dramatically.",
      },
      {
        text: "Use phone flashlight and blow whistle in SOS pattern",
        needs: ["phone", "signal"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! SOS signal (... --- ...) was recognized immediately. Professional signaling! 📱📣 [Both kept]",
        lesson:
          "Learn SOS signal: ... --- ... (3 short, 3 long, 3 short). Universal distress signal.",
      },
      {
        text: "Wave bright clothing and shout loudly together as a group",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Helicopter couldn't hear over engine but saw clothing on second pass. Lost time. Visual signals work better.",
        lesson:
          "Shouting rarely works with helicopters. Use bright visual signals and loud devices.",
      },
      {
        text: "Wait quietly assuming they'll eventually spot you",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Helicopter never saw you. It left the area. You waited 2 more days. Always signal actively!",
        lesson:
          "Passive waiting reduces rescue chances. Actively signal with every method available.",
      },
    ],
  },
  {
    title: "Boat Rescue Ethics",
    text: "Rescue boat arrives with space for 8 people. There are 12 on the roof. Boat can't make second trip due to weather.",
    icon: "⛵",
    choices: [
      {
        text: "Use rope to organize fair queue for vulnerable people first",
        needs: ["rescue"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your rope system created order. Most vulnerable evacuated first. Leadership saved lives! 🪢 [Rope kept]",
        lesson:
          "Leadership and organization during rescue prevents deaths from panic and chaos.",
      },
      {
        text: "Show documents to prove you're priority resident",
        needs: ["documents"],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Documents don't determine rescue priority - medical needs do. Left sick child behind. 📄 [Documents kept]",
        lesson:
          "Rescue priority is based on vulnerability, not status or documentation.",
      },
      {
        text: "Help organize by vulnerability: children, elderly, sick first. You wait.",
        needs: [],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! You prioritized vulnerable people. Another boat came later. Your selflessness saved lives!",
        lesson:
          "In disasters: children, elderly, sick, pregnant women first. International rescue protocol.",
      },
      {
        text: "First come, first served - rush to the boat",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Boat nearly capsized from rushing. Vulnerable left behind. Chaos kills in emergencies!",
        lesson:
          "Panic and selfishness during rescue can kill everyone. Follow organized procedures.",
      },
    ],
  },

  // COMMUNICATION & INFORMATION
  {
    title: "Rumor Control",
    text: "Rumor spreads: 'Water will rise 3 more meters tonight!' People panicking. You need accurate information.",
    icon: "📻",
    choices: [
      {
        text: "Use radio to share official verified information with everyone",
        needs: ["information"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Official broadcast confirmed water is stable. You prevented panic. Facts beat rumors! 📻 [Radio kept]",
        lesson:
          "Combat rumors with verified official information. Rumors cause dangerous decisions.",
      },
      {
        text: "Check phone for government emergency alerts",
        needs: ["phone"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Government SMS confirmed safety. You shared accurate info. Panic prevented! 📱 [Phone kept]",
        lesson:
          "Government emergency SMS systems provide verified information during disasters.",
      },
      {
        text: "Ask shelter staff for official updates and share with others",
        needs: [],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Staff confirmed it's a rumor. You helped calm people. Trust official channels!",
        lesson:
          "Shelter staff have official information. Always check with authorities during rumors.",
      },
      {
        text: "Believe rumor and try to leave shelter for higher ground",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Rumor was false. You left safety unnecessarily and nearly drowned. Trust authorities!",
        lesson:
          "In disasters, false information spreads quickly. Only trust official broadcasts.",
      },
    ],
  },

  // SHELTER LIFE & COMMUNITY
  {
    title: "Contaminated Food Supply",
    text: "Day 2 at shelter. Someone offers you food but it smells strange and looks spoiled. You're very hungry.",
    icon: "🍱",
    choices: [
      {
        text: "Eat your own canned food that you brought",
        needs: ["food"],
        consumes: ["food"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your preserved food kept you healthy. Others who ate spoiled food got severe food poisoning. 🥫 [-Canned Food eaten]",
        lesson:
          "Always bring non-perishable food to shelters. Don't trust unknown food sources during emergencies.",
      },
      {
        text: "Use radio to check if shelter officials verified the food source",
        needs: ["information"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Radio confirmed the food was contaminated. Officials removed it. Checking sources prevents illness! 📻 [Radio kept]",
        lesson:
          "Verify food sources through official channels. Contaminated food spreads disease in shelters.",
      },
      {
        text: "Politely decline and wait for official food distribution",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! You went hungry for 12 hours but avoided food poisoning. Distribution came eventually but hunger was painful.",
        lesson:
          "Waiting for verified food is safer but bring your own emergency supplies to avoid hunger.",
      },
      {
        text: "Eat the offered food - you're too hungry to care",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Severe food poisoning. You got diarrhea and dehydration. Needed medical treatment. Never eat unverified food!",
        lesson:
          "Spoiled food during floods is extremely dangerous. Contamination causes deadly outbreaks in shelters.",
      },
    ],
  },
  {
    title: "Generator Safety Crisis",
    text: "Day 3 at shelter. Power is out. Someone brought a gasoline generator and wants to run it inside the building for phone charging and light.",
    icon: "⚡",
    choices: [
      {
        text: "Use flashlight to provide light, insist generator stays outside",
        needs: ["light"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your flashlight provided light while you explained CO poisoning risks. Generator moved outside. You saved lives! 🔦 [Flashlight kept]",
        lesson:
          "Generators produce deadly carbon monoxide. Always run them outdoors, 20+ feet from windows and doors.",
      },
      {
        text: "Use phone to call shelter manager about the danger immediately",
        needs: ["phone"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Manager arrived quickly and moved generator outside. Official intervention prevented tragedy. 📱 [Phone kept]",
        lesson:
          "Report safety hazards to authorities immediately. Indoor generator use kills dozens during every major flood.",
      },
      {
        text: "Loudly warn everyone about carbon monoxide danger and demand it be moved",
        needs: [],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your vocal warning made people realize the danger. Generator moved outside. Speaking up saves lives!",
        lesson:
          "Don't be afraid to speak up about life-threatening hazards. Carbon monoxide is invisible, odorless, and deadly.",
      },
      {
        text: "Stay quiet - you don't want to cause conflict or seem paranoid",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Overnight, multiple people suffered CO poisoning. Two died in their sleep. Your silence cost lives. Always report hazards!",
        lesson:
          "Indoor generator use is the leading cause of carbon monoxide deaths during floods. Never stay silent about this hazard.",
      },
    ],
  },
  {
    title: "Food Distribution Chaos",
    text: "Shelter receives limited food: 1 meal per person. Some people taking extra while others get nothing.",
    icon: "🍱",
    choices: [
      {
        text: "Eat your own canned food, leave shelter food for others",
        needs: ["food"],
        consumes: ["food"],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your preparation meant you didn't take shelter food. More for others. 🥫 [-Canned Food eaten]",
        lesson:
          "Personal preparedness reduces burden on emergency resources, helping more survive.",
      },
      {
        text: "Use documents to help organize fair registration system",
        needs: ["documents"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Registration ensured everyone got fair share. Organization prevents conflict! 📄 [Documents kept]",
        lesson:
          "Organized distribution ensures fairness and prevents hoarding during shortages.",
      },
      {
        text: "Help volunteers organize a fair queue system for distribution",
        needs: [],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your leadership created order. Everyone got their share fairly. Community cooperation works!",
        lesson:
          "Volunteering to organize resources helps entire community survive fairly.",
      },
      {
        text: "Take extra food while you can - others are doing it",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Conflict erupted. Fighting led to injuries. Hoarding destroys community trust!",
        lesson:
          "Hoarding causes violence and social collapse. Fair sharing keeps communities safe.",
      },
    ],
  },
  {
    title: "Cold Night at Shelter",
    text: "Temperature drops to 15°C at night. No heating. An elderly person is shivering badly nearby.",
    icon: "🥶",
    choices: [
      {
        text: "Give them your blanket for the night",
        needs: ["warmth"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Elder survived the night safely. They returned blanket in morning. Compassion saves lives! 🛏️ [Blanket returned]",
        lesson:
          "Elderly are vulnerable to cold. Sharing warmth can prevent hypothermia deaths.",
      },
      {
        text: "Share blanket with them - huddle together for warmth",
        needs: ["warmth"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Sharing body heat kept both of you warm. Community solidarity works! 🛏️ [Blanket kept]",
        lesson:
          "Sharing resources and body heat is effective survival strategy in cold conditions.",
      },
      {
        text: "Help them huddle with others for shared body heat",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Body heat helped but elder still cold. They survived but blankets/warm clothes are much better.",
        lesson:
          "Body heat sharing helps but proper insulation is much more effective in cold.",
      },
      {
        text: "Do nothing - focus on keeping yourself warm",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Elder developed hypothermia overnight. Needed hospitalization. You could have helped!",
        lesson:
          "Vulnerable people die from cold faster. Always help elderly and children stay warm.",
      },
    ],
  },

  // PSYCHOLOGICAL & DECISION MAKING
  {
    title: "Panic Attack",
    text: "Someone at shelter is having panic attack: hyperventilating, screaming that everyone will die. Others getting scared.",
    icon: "😰",
    choices: [
      {
        text: "Calmly talk to them and use radio to show factual situation updates",
        needs: ["information"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Calm demeanor + factual radio info helped them breathe normally. Prevented mass panic! 📻 [Radio kept]",
        lesson:
          "Stay calm during others' panic. Use facts, not emotions, to reassure.",
      },
      {
        text: "Wrap them in blanket for comfort and security",
        needs: ["warmth"],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Physical comfort helped but they needed direct psychological intervention too. 🛏️ [Blanket kept]",
        lesson:
          "Panic attacks need both physical comfort and psychological intervention (calm talking).",
      },
      {
        text: "Talk to them calmly and help them slow their breathing",
        needs: [],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Your calm presence and breathing guidance helped them recover. Compassion prevents panic spread!",
        lesson:
          "Calm demeanor and breathing exercises can stop panic attacks. Stay composed in crises.",
      },
      {
        text: "Ignore them - they're being dramatic and it's annoying",
        needs: [],
        consumes: [],
        outcome: "danger",
        feedback:
          "❌ DANGER! Panic spread to others. Mass chaos erupted. People injured in stampede. Mental health matters!",
        lesson:
          "Ignoring psychological crises can cause physical harm. Address mental health in emergencies.",
      },
    ],
  },
  {
    title: "Property vs Safety",
    text: "Rumor spreads that looters are stealing from empty houses. People want to return home to protect property.",
    icon: "🏠",
    choices: [
      {
        text: "Use radio to share official info: police patrolling, stay put",
        needs: ["information"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Official broadcast confirmed police patrols. People stayed safe. Facts beat rumors! 📻 [Radio kept]",
        lesson:
          "Combat rumors with verified information. Rumors cause dangerous decisions.",
      },
      {
        text: "Show photos on phone of your property for insurance later",
        needs: ["phone"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! Photos prove ownership for insurance claims. Smart preparation without risking life! 📱 [Phone kept]",
        lesson:
          "Keep digital photos of valuables for insurance. No need to risk returning.",
      },
      {
        text: "Use documents to file police report from shelter about concerns",
        needs: ["documents"],
        consumes: [],
        outcome: "safe",
        feedback:
          "✅ SAFE! You reported concerns officially. Police increased patrols. Proper channels work! 📄 [Documents kept]",
        lesson:
          "Use official channels to report concerns. Authorities can respond appropriately.",
      },
      {
        text: "Convince others to stay and trust police are handling it",
        needs: [],
        consumes: [],
        outcome: "risky",
        feedback:
          "⚠️ RISKY! Most stayed but some left anyway. You tried but couldn't stop everyone from risking their lives.",
        lesson:
          "Peer influence helps but official information is more convincing during disasters.",
      },
    ],
  },
];

// Randomly select 10 scenarios
function selectRandomScenarios() {
  const shuffled = [...allScenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

// Start game
function startGame() {
  collectedItems = [];
  timeLeft = 60;
  currentScenarioIndex = 0;
  safeCount = 0;
  riskyCount = 0;
  dangerCount = 0;
  lessons = [];

  selectedScenarios = selectRandomScenarios();
  console.log(`Selected ${selectedScenarios.length} random scenarios`);

  showScreen("preparation-screen");
  initTilemap();
  startTimer();
}

function showScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function showInstructions() {
  showScreen("instructions-screen");
}

function collectItem(item) {
  if (collectedItems.find((i) => i.id === item.id)) return;

  if (collectedItems.length >= 8) {
    return;
  }

  collectedItems.push(item);
  const itemCard = document.getElementById(`item-${item.id}`);
  if (itemCard) {
    itemCard.classList.add("collected");
  }
  document.getElementById("backpack-count").textContent = collectedItems.length;
  updateBackpackDisplay();

  if (collectedItems.length === 8) {
    // Enable the "Start Flood" button
    const startBtn = document.getElementById("start-flood-btn");
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.classList.add("ready");
    }
  }
}

function updateBackpackDisplay() {
  const display = document.getElementById("backpack-display");

  if (collectedItems.length === 0) {
    display.innerHTML =
      '<div class="empty-backpack">Empty - start collecting!</div>';
    return;
  }

  display.innerHTML = collectedItems
    .map(
      (item) => `
        <div class="backpack-item">
            <span class="backpack-item-icon">${item.icon}</span>
            <span>${item.name}</span>
        </div>
    `
    )
    .join("");
}

function startTimer() {
  const timerEl = document.getElementById("timer");

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 10) {
      timerEl.classList.add("urgent");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endPreparation();
    }
  }, 1000);
}

function endPreparation() {
  clearInterval(timerInterval);

  if (collectedItems.length === 0) {
    alert("⚠️ You didn't collect anything! This will be very dangerous...");
  }

  setTimeout(() => {
    showScreen("scenario-screen");
    loadScenario();
  }, 500);
}

function loadScenario() {
  if (currentScenarioIndex >= selectedScenarios.length) {
    showResults();
    return;
  }

  const scenario = selectedScenarios[currentScenarioIndex];

  // Update UI
  document.getElementById("scenario-number").textContent =
    currentScenarioIndex + 1;
  document.querySelector(".scenario-icon").textContent = scenario.icon;
  document.getElementById("scenario-title").textContent = scenario.title;
  document.getElementById("scenario-text").textContent = scenario.text;

  // Show collected items
  const itemsList = document.getElementById("available-items");
  if (collectedItems.length === 0) {
    itemsList.innerHTML =
      '<span style="color:#999; font-style:italic;">Nothing left! You\'re unprepared...</span>';
  } else {
    itemsList.innerHTML = collectedItems
      .map(
        (item) => `<div class="available-item">${item.icon} ${item.name}</div>`
      )
      .join("");
  }

  // Clear previous choices
  const choicesContainer = document.querySelector(".choices");
  choicesContainer.innerHTML = "";

  // Create choice buttons
  scenario.choices.forEach((choice, index) => {
    // Check if player has required items
    let hasRequiredItems = true;
    let missingItems = [];

    if (choice.needs && choice.needs.length > 0) {
      hasRequiredItems = choice.needs.every((need) => {
        const hasItem = collectedItems.some((item) =>
          item.helps.includes(need)
        );
        if (!hasItem) {
          missingItems.push(need);
        }
        return hasItem;
      });
    }

    const choiceBtn = document.createElement("button");
    choiceBtn.className = "choice-btn";
    choiceBtn.onclick = () => makeDecision(index);

    // Disable button if player doesn't have required items
    if (!hasRequiredItems) {
      choiceBtn.disabled = true;
      choiceBtn.classList.add("disabled-choice");
      choiceBtn.innerHTML = `
                <span class="choice-letter">${String.fromCharCode(
                  65 + index
                )}</span>
                <span class="choice-text">${choice.text}</span>
                <span class="choice-requirement">❌ Missing: ${missingItems.join(
                  ", "
                )}</span>
            `;
    } else {
      // Show what will be consumed
      let consumeText = "";
      if (choice.consumes && choice.consumes.length > 0) {
        const consumeNames = choice.consumes
          .map((consumeNeed) => {
            const item = items.find((it) => it.helps.includes(consumeNeed));
            return item ? item.icon : consumeNeed;
          })
          .join(" ");
        consumeText = `<span class="choice-consume">Uses: ${consumeNames}</span>`;
      }

      choiceBtn.innerHTML = `
                <span class="choice-letter">${String.fromCharCode(
                  65 + index
                )}</span>
                <span class="choice-text">${choice.text}</span>
                ${consumeText}
            `;
    }

    choicesContainer.appendChild(choiceBtn);
  });

  // Clear feedback
  document.getElementById("scenario-feedback").textContent = "";
  document.getElementById("scenario-feedback").className = "scenario-feedback";
}

function makeDecision(choiceIndex) {
  const scenario = selectedScenarios[currentScenarioIndex];
  const choice = scenario.choices[choiceIndex];

  // Check if player has needed items
  let hasItems = true;
  if (choice.needs && choice.needs.length > 0) {
    hasItems = choice.needs.every((need) =>
      collectedItems.some((item) => item.helps.includes(need))
    );
  }

  if (!hasItems) {
    alert("⚠️ You don't have the required items for this choice!");
    return;
  }

  // CONSUME ITEMS
  if (choice.consumes && choice.consumes.length > 0) {
    choice.consumes.forEach((consumeNeed) => {
      const itemIndex = collectedItems.findIndex((item) =>
        item.helps.includes(consumeNeed)
      );
      if (itemIndex !== -1) {
        const consumedItem = collectedItems[itemIndex];
        const originalItem = items.find((it) => it.id === consumedItem.id);
        if (originalItem && originalItem.consumable) {
          collectedItems.splice(itemIndex, 1);
          console.log(`Consumed: ${consumedItem.name}`);
        }
      }
    });

    updateBackpackDisplay();
  }

  let actualOutcome = choice.outcome;

  // Show feedback
  const feedbackEl = document.getElementById("scenario-feedback");
  feedbackEl.textContent = choice.feedback;
  feedbackEl.className = `scenario-feedback ${actualOutcome}`;

  // Track stats
  if (actualOutcome === "safe") safeCount++;
  else if (actualOutcome === "risky") riskyCount++;
  else dangerCount++;

  // Save lesson
  if (choice.lesson) {
    lessons.push(choice.lesson);
  }

  // Disable all buttons
  const allButtons = document.querySelectorAll(".choice-btn");
  allButtons.forEach((btn) => (btn.disabled = true));

  // Move to next scenario
  setTimeout(() => {
    currentScenarioIndex++;
    loadScenario();
  }, 4500);
}

function showResults() {
  showScreen("results-screen");

  // Update stats
  document.getElementById("safe-count").textContent = safeCount;
  document.getElementById("risky-count").textContent = riskyCount;
  document.getElementById("danger-count").textContent = dangerCount;

  // Show remaining items
  const remainingItemsEl = document.getElementById("remaining-items");
  if (collectedItems.length > 0) {
    remainingItemsEl.innerHTML = `
            <h4>🎒 Items Remaining:</h4>
            <div class="remaining-items-list">
                ${collectedItems
                  .map((item) => `<span>${item.icon} ${item.name}</span>`)
                  .join(" ")}
            </div>
        `;
  } else {
    remainingItemsEl.innerHTML = `
            <h4>🎒 Items Remaining:</h4>
            <p style="color:#999; font-style:italic;">You used all your supplies! Excellent resource management.</p>
        `;
  }

  // Determine star rating and message
  let stars, message, bannerClass, rating;

  if (safeCount === 10) {
    // 5 STARS - PERFECT
    stars = "⭐⭐⭐⭐⭐";
    rating = "5/5 Stars";
    message =
      "🏆 PERFECT! Flawless survival! You made every single safe decision. You are completely FLOOD READY and prepared to help others stay safe!";
    bannerClass = "excellent";
  } else if (safeCount >= 7) {
    // 4 STARS - GOOD
    stars = "⭐⭐⭐⭐";
    rating = "4/5 Stars";
    message =
      "✨ GOOD! You survived with smart preparation and mostly good decisions. You understand flood safety well!";
    bannerClass = "good";
  } else if (safeCount >= 5) {
    // 3 STARS - AVERAGE
    stars = "⭐⭐⭐";
    rating = "3/5 Stars";
    message =
      "👍 AVERAGE. You survived but made several risky choices. You have basic flood safety knowledge but need more practice!";
    bannerClass = "average";
  } else if (safeCount >= 3) {
    // 2 STARS - POOR
    stars = "⭐⭐";
    rating = "2/5 Stars";
    message =
      "⚠️ POOR. Many dangerous decisions put you at serious risk. Please study flood safety guidelines and play again to learn!";
    bannerClass = "poor";
  } else {
    // 1 STAR - DISASTER
    stars = "⭐";
    rating = "1/5 Stars";
    message =
      "🚨 DISASTER! You made mostly life-threatening decisions. In a real flood, this would be fatal. Please take flood safety seriously and learn proper emergency procedures!";
    bannerClass = "disaster";
  }

  // Update results display
  document.getElementById("stars").textContent = stars;
  document.getElementById("rating-text").textContent = rating;
  document.getElementById("result-message").textContent = message;
  document.getElementById(
    "result-banner"
  ).className = `result-banner ${bannerClass}`;

  // Show lessons
  const lessonsList = document.getElementById("lessons-list");
  if (lessons.length > 0) {
    const uniqueLessons = [...new Set(lessons)];
    lessonsList.innerHTML = uniqueLessons
      .map((lesson) => `<div class="lesson-item">💡 ${lesson}</div>`)
      .join("");
  } else {
    lessonsList.innerHTML =
      '<div class="lesson-item">Play again to learn important flood safety lessons!</div>';
  }
}

function shareScore() {
  const stars = document.getElementById("stars").textContent;
  const message = `I scored ${stars} in Flood Ready! 🌊\n\nResults:\n✅ Safe: ${safeCount}\n⚠️ Risky: ${riskyCount}\n❌ Danger: ${dangerCount}\n\nLearn flood safety!`;

  if (navigator.share) {
    navigator
      .share({
        title: "Flood Ready - My Score",
        text: message,
      })
      .catch(() => {
        copyToClipboard(message);
      });
  } else {
    copyToClipboard(message);
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("📋 Score copied! Share with friends!");
    })
    .catch(() => {
      alert(text);
    });
}
