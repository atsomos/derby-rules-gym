const SOURCE_ROOT = "https://rules.wftda.com";
const CASEBOOK_ROOT = `${SOURCE_ROOT}/casebook`;
const PASS_RATE = 80;
const COMMON_TEST_SHARE = 0.8;
const REQUIRED_BANK_QUESTION_COUNT = 150;
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxOltswq5hb9IgsiRl_UmGfQJlGDj1OB7rHjsIOqlAsvFQ7qP2ybfMlEcht8cev0xZz2VWBZFM4GhR/pub?output=csv";
const SIX_MONTHS_MS = 183 * 24 * 60 * 60 * 1000;

const CASEBOOK_PAGE_BY_CHAPTER = {
  C2: "02_c_gameplay.html",
  C3: "03_c_scoring.html",
  C4: "04_c_penalties.html",
  C5: "05_c_officiating.html"
};

const RULE_ANCHOR_ALIASES = {
  "penalties-gaining-position": "penalties-structure-gaining-position",
  "penalties-multi-player-blocks": "penalties-multiplayer-blocks",
  "penalties-position": "penalties-structure-illegal-positioning"
};

const COMMON_CATEGORIES = new Set([
  "Jammer identity",
  "Lead Jammer",
  "Star Pass",
  "Starting positions",
  "Pack definition",
  "Passing",
  "Earning points",
  "Trips",
  "Scoring avoidance",
  "Penalized Jammers",
  "Illegal target zone",
  "Illegal blocking zone",
  "Other illegal contact",
  "Multi-Player Blocks",
  "Position and Pack",
  "Gaining position",
  "Game structure",
  "Blocker penalties",
  "Jammer penalties",
  "Assessing penalties"
]);

const OBSCURE_PATTERNS = [
  /expel|expulsion/i,
  /Team Staff|Captain/i,
  /Official/i,
  /mouthguard|protective gear/i,
  /substitute|injured|three jams/i,
  /water bottle|bench/i,
  /equipment/i
];

const LEARNING_PATH = [
  {
    title: "1. Track, roles, and starts",
    level: "Fundamentals",
    description: "Who is on the track, where they may start, and how the Pack is defined before judgment gets noisy.",
    categories: ["Jammer identity", "Starting positions", "Pack definition", "Passing"],
    focus: ["Roles and helmet covers", "False Starts", "Pack and No Pack", "Basic passing"]
  },
  {
    title: "2. Jam flow and Lead",
    level: "Core gameplay",
    description: "Build the mental timeline of a jam: initial trip, Lead status, Star visibility, and legal role changes.",
    categories: ["Lead Jammer", "Star Pass", "Game structure"],
    focus: ["Lead requirements", "Star Pass timing", "Calling and ending jams"]
  },
  {
    title: "3. Scoring that happens every game",
    level: "Common calls",
    description: "Move from simple passes to trips, not-on-the-track points, and scoring avoidance.",
    categories: ["Earning points", "Trips", "Scoring avoidance", "Penalized Jammers"],
    focus: ["Earned passes", "Scoring trips", "Unavailable blockers", "Jammer penalties"]
  },
  {
    title: "4. Contact penalties",
    level: "Impact judgment",
    description: "Separate legal derby contact from illegal target zones, illegal blocking zones, and sustained advantage.",
    categories: ["Illegal target zone", "Illegal blocking zone", "Other illegal contact", "Multi-Player Blocks"],
    focus: ["Back blocks", "Forearms", "Low blocks", "Links and multi-player actions"]
  },
  {
    title: "5. Position, re-entry, and penalties",
    level: "Applied judgment",
    description: "Layer Pack status, out-of-play blocks, re-entry, cutting, and penalty enforcement onto the core model.",
    categories: ["Position and Pack", "Gaining position", "Blocker penalties", "Jammer penalties", "Assessing penalties"],
    focus: ["Out of Play", "Cutting", "Penalty Box timing", "Who serves"]
  },
  {
    title: "6. Procedures and edge cases",
    level: "Advanced",
    description: "Finish with less common procedural, safety, misconduct, and expulsion scenarios after the common calls are stable.",
    categories: ["Illegal procedures", "Unsporting conduct", "Unsporting contact", "Expulsions", "Protective gear", "Unable to serve"],
    focus: ["Administrative fixes", "Misconduct", "Safety equipment", "Expulsions"]
  }
];

const STUDY_PRACTICE_GROUPS = {
  jam: ["Lead Jammer", "Starting positions", "Game structure"],
  roles: ["Jammer identity", "Star Pass", "Starting positions"],
  pack: ["Pack definition", "Position and Pack"],
  scoring: ["Earning points", "Trips", "Scoring avoidance", "Penalized Jammers"],
  contact: ["Illegal target zone", "Illegal blocking zone", "Other illegal contact", "Multi-Player Blocks"],
  penalties: ["Illegal target zone", "Illegal blocking zone", "Other illegal contact", "Position and Pack", "Gaining position", "Assessing penalties"],
  common: [...COMMON_CATEGORIES],
  star: ["Star Pass", "Jammer identity", "Lead Jammer"],
  box: ["Blocker penalties", "Jammer penalties", "Unable to serve", "Protective gear"]
};

const STUDY_PRACTICE_SECTIONS = {
  jam: "study-jam",
  roles: "study-roles",
  pack: "study-pack",
  scoring: "study-scoring",
  contact: "study-contact",
  penalties: "study-penalties",
  common: "study-common",
  star: "study-star-pass",
  box: "study-box"
};

const STUDY_PRACTICE_CARDS = [
  {
    key: "jam",
    title: "Jam flow",
    description: "Follow one jam from lineup to call-off, then test the order until it feels automatic."
  },
  {
    key: "roles",
    title: "Roles",
    description: "Use the Star and Stripe to decide who can score, who can receive, and who is still a Blocker."
  },
  {
    key: "pack",
    title: "Pack logic",
    description: "Learn how 10 ft spacing creates the Pack, the Engagement Zone, and out-of-play calls."
  },
  {
    key: "scoring",
    title: "Scoring",
    description: "Separate the scoring moment from the messy thing that may happen right after it."
  },
  {
    key: "contact",
    title: "Legal contact",
    description: "Start with legal contact so penalties make sense as broken versions of normal play."
  },
  {
    key: "common",
    title: "Common situations",
    description: "Practice the rulings players actually meet: cuts, re-entry, back blocks, yielding, and out-of-play."
  }
];

const STUDY_LAYER_CONTENT = {
  start: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        {
          text: "Start every ruling by finding the Jammer. Blockers are the other on-track skaters who mostly control space.",
          terms: [
            { text: "Jammer", popup: "term-jammer" },
            { text: "Blockers", popup: "term-blocker" }
          ]
        },
        {
          text: "Then ask four track-status questions: who is in bounds, who is upright, who is in play, and who passed whom?",
          terms: [
            { text: "in bounds", popup: "term-in-bounds" },
            { text: "upright", popup: "term-upright" },
            { text: "in play", popup: "term-in-play" },
            { text: "passed", popup: "term-pass" }
          ]
        },
        { text: "Derby rules usually judge what changed on track, not what someone meant to do. Position, contact, safety, and advantage matter most." },
        {
          text: "Your first useful habit is simple: stay in bounds, stay near the Pack, pass legally, and return legally when you leave.",
          terms: [
            { text: "Pack", popup: "term-pack" }
          ]
        },
        { type: "self-check", text: "Self-check: name the four track-status questions from above: boundary, body position, play status, and pass status." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        { text: "The same-looking action can be legal in one jam and illegal in another because Pack location, direction, and impact changed." },
        { text: "Messy is not the same as illegal. Ask whether the action changed safety, position, scoring, or game structure." },
        { text: "When a play feels impossible to judge, split it into snapshots: before, during, and after. Most confusion lives between snapshots." }
      ]
    }
  ],
  jam: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "Line up legally first. A lot of early penalties are just bad starting position or moving too soon." },
        {
          text: "On the initial trip, Jammers are not scoring yet. They are trying to clear the Pack cleanly and become eligible for Lead.",
          terms: [
            { text: "initial trip", popup: "term-initial-trip" },
            { text: "Lead", popup: "lead-eligibility" }
          ]
        },
        {
          text: "Once a Jammer has completed the initial trip, later trips are usually scoring trips.",
          terms: [
            { text: "scoring trips", popup: "term-scoring-trip" }
          ]
        },
        { text: "Lead matters because it gives one Jammer control over the clock: keep the jam going or call it before the opponent scores more." },
        { type: "self-check", text: "Say the five jam moments in order: lineup, initial trip, Lead, scoring trips, jam ends." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "Lead Jammer is not simply 'first skater out of the Pack.'",
          children: [
            { text: "The Jammer must get through legally enough to satisfy the Lead requirements." },
            { text: "The timing matters: a Jammer can do the right-looking thing too late or after losing eligibility." },
            { text: "Star visibility and some track-status problems can change Lead eligibility.", popup: "lead-eligibility" }
          ]
        },
        { text: "A jam ends by call-off, by time expiring, or because officials stop play. Learn these endings so the whistle pattern feels less mysterious." },
        { text: "Keep initial trip and scoring trip separate in your head. The same pass can matter for Lead on one trip and points on another." }
      ]
    },
    {
      title: "Deep end",
      level: "Advanced / official",
      items: [
        { text: "Officials track trips, passes, Lead eligibility, Star status, and jam-ending signals at the same time.", popup: "official-jam-tracking" }
      ]
    }
  ],
  roles: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        {
          text: "The Star tells you who the Jammer is. If you are trying to count points, find the Star first.",
          terms: [
            { text: "Star", popup: "term-star" }
          ]
        },
        {
          text: "The Stripe tells you who the Pivot is: still a Blocker, but the one Blocker who may legally receive the Star.",
          terms: [
            { text: "Stripe", popup: "term-stripe" },
            { text: "Pivot", popup: "term-pivot" }
          ]
        },
        {
          text: "The Captain is the team's visible rules representative: they wear a C, may request timeouts and reviews, and can serve or receive certain team penalties.",
          terms: [
            { text: "Captain", popup: "term-captain" }
          ]
        },
        {
          text: "The Alternate wears an A and can also request timeouts and official reviews, but does not have to be a skater.",
          terms: [
            { text: "Alternate", popup: "term-alternate" }
          ]
        },
        { text: "Blockers do most of the space work. They form the Pack, make walls, assist, and create legal or illegal contact situations." },
        { text: "Before solving a strange play, name each skater's role at that exact moment. Role changes are where many edge cases begin." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "Role identity can change because of helmet cover control and timing.",
          children: [
            { text: "A skater can commit a penalty without losing their role." },
            { text: "Starting in the wrong place may create a penalty, but it does not automatically change who the Jammer is." },
            { text: "A Pivot remains a Blocker until a legal Star Pass actually changes the Jammer." },
            { text: "If a Star Pass feels weird, ask who controlled the Star and when the role changed.", popup: "star-pass-control" },
            { text: "If a timeout, review, or team procedure looks weird, ask whether the Captain or Alternate had the right to request it.", popup: "captain-official-privileges" }
          ]
        }
      ]
    },
    {
      title: "Deep end",
      level: "Advanced / official",
      items: [
        { text: "Captain penalties are where player learning crosses into team procedure: sometimes the Captain is penalized for a team or staff problem, not because they personally made the on-track action.", popup: "captain-penalty-responsibility" }
      ]
    }
  ],
  pack: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "The Pack is not any group of skaters. It is the largest group of in-bounds Blockers from both teams who are close enough to each other." },
        {
          text: "The Pack creates the Engagement Zone. That zone tells you where most blocking is allowed.",
          terms: [
            { text: "Engagement Zone", popup: "term-engagement-zone" }
          ]
        },
        {
          text: "If you are out of play, stop affecting the action and return toward legal play.",
          terms: [
            { text: "out of play", popup: "term-out-of-play" }
          ]
        },
        { text: "For a player, the Pack is your map. When you feel lost, find the Pack before you decide what you are allowed to do." },
        {
          text: "The important number is 10 ft (3.05 m): Blockers can connect into the Pack when each gap is 10 ft or less.",
          terms: [
            { text: "10 ft", popup: "ten-foot-pack-measurement" }
          ],
          children: [
            {
              text: "Measure the gap from hips, not skates, shoulders, fingertips, or where someone is leaning.",
              terms: [
                { text: "hips", popup: "term-hips" }
              ]
            },
            { text: "Measure along the track, parallel to the inside boundary. Do not take a diagonal shortcut across the infield.", popup: "ten-foot-pack-measurement" }
          ]
        }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "No Pack means the game has temporarily lost its normal playing space.",
          children: [
            { text: "Blockers should stop using the broken shape and reform the Pack immediately." },
            { text: "If you keep blocking, trapping, or delaying instead of reforming, you are using the broken structure as an advantage." },
            { text: "The rule is there to keep derby playable, not to reward distance games.", popup: "pack-definition" }
          ]
        },
        { text: "Out of play is not the same as out of bounds. You can be on the track and still too far from the Pack to block legally." },
        { type: "worked-example", text: "Worked example: Red 1 is near White 1, and White 1 is near Red 2. If both gaps are 10 ft or less along the track, those Blockers can connect as one Pack chain. If one gap opens beyond 10 ft and no other bridge exists, the Pack may split or disappear." },
        { type: "self-check", text: "Pick one Blocker and trace the chain: upright, in-bounds Blockers from both teams, with every link 10 ft or less. If the chain holds, you are probably finding the Pack." }
      ]
    },
    {
      title: "Deep end",
      level: "Advanced / official",
      items: [
        { text: "Officials judge Pack status continuously, then use that status to judge out-of-play blocks and failure-to-reform penalties.", popup: "official-pack-lens" }
      ]
    }
  ],
  scoring: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "The initial trip gets the Jammer into the game. It is for position and Lead, not points." },
        { text: "Scoring usually begins after that, when the Jammer comes around and enters the Pack again on a scoring trip." },
        {
          text: "A Jammer scores by earning passes on opposing Blockers, usually by getting their hips ahead legally.",
          terms: [
            { text: "earning passes", popup: "term-earned-pass" }
          ]
        },
        { text: "Most scoring questions are timing questions: did the pass become earned before something else changed?" },
        { text: "Do not erase a point just because the landing, contact, or re-entry afterward got messy. Decide first whether the point had already happened." },
        { type: "self-check", text: "In one sentence: what is different about the initial trip and a scoring trip?" }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "A pass is about legally gaining superior position, not just looking ahead for a split second.",
          children: [
            { text: "Watch hips, boundary status, and whether the Jammer stayed upright enough for the pass to count." },
            { text: "Being physically ahead is not enough if that position was gained illegally." },
            { text: "If the Jammer became out of bounds before earning the pass, scoring may change." }
          ]
        },
        {
          text: "Apex jumps are two questions, so do not collapse them into one answer.",
          children: [
            { text: "Question one: did the airborne pass count for points?" },
            { text: "Question two: after landing, is the Jammer out of bounds or required to re-enter behind someone?" },
            { text: "A Jammer can score on the jump and still need to solve a re-entry problem immediately after.", popup: "apex-jump-reentry" }
          ]
        },
        { type: "worked-example", text: "Worked example: you jump from in bounds, pass four opposing Blockers in the air, touch one skate down in bounds, then the other skate lands out. The points may already be earned; now you solve re-entry." },
        {
          text: "Unavailable opponents can still be part of scoring, so do not assume a skater becomes unscoreable by leaving the track.",
          terms: [
            { text: "Unavailable opponents", popup: "not-on-track-points" }
          ]
        }
      ]
    },
    {
      title: "Deep end",
      level: "Advanced / official",
      items: [
        { text: "Scoring avoidance exists so a team cannot erase scoring opportunity by leaving play.", popup: "scoring-avoidance" },
        { text: "Officials separate the scoring decision from the next legal-position decision, even when both happen in the same second.", popup: "apex-official-sequence" },
        { text: "Officials also manage score reporting errors and corrections, which is deeper than most player-first study needs." }
      ]
    }
  ],
  contact: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        {
          text: "Use legal blocking zones: mostly your torso, hips, and upper legs.",
          terms: [
            { text: "blocking zones", popup: "term-blocking-zones" }
          ]
        },
        {
          text: "Aim for legal target zones. Avoid backs, heads, knees, lower legs, and feet.",
          terms: [
            { text: "target zones", popup: "term-target-zones" }
          ]
        },
        {
          text: "Remember that blocking is not only hitting. Taking space with your body can still block someone.",
          terms: [
            { text: "blocking", popup: "term-blocking" }
          ]
        },
        { text: "Legal contact also needs legal timing: be upright, in bounds, in play, and moving in a legal direction when you initiate." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "Impact is what turns many illegal actions into penalties.",
          terms: [
            { text: "Impact", popup: "penalty-impact" }
          ],
          children: [
            { text: "A tiny illegal touch may be something to clean up, but not always a penalty." },
            { text: "Illegal contact that knocks someone down, sends them out, or meaningfully changes play usually matters.", popup: "penalty-impact" }
          ]
        },
        {
          text: "Counter-blocking is not the same as starting a new block. Ask who initiated the contact.",
          terms: [
            { text: "Counter-blocking", popup: "term-counter-blocking" }
          ]
        },
        { text: "Airborne contact is risky: brushing past someone is different from launching force into them." }
      ]
    }
  ],
  penalties: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "Contact penalties protect safety and fair physical play: where you hit, what you hit with, and what that contact changes." },
        { text: "Position penalties protect the shape of the game: Pack, Engagement Zone, in bounds, out of bounds, and legal re-entry." },
        { text: "Procedure penalties keep the game runnable: starts, substitutions, equipment, and listening to officials." },
        { text: "For re-entry, use one player habit: if you leave the track, do not use that off-track time to improve your place." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "Cutting and re-entry are about who you were behind when you left and where you come back.",
          terms: [
            { text: "Cutting", popup: "cutting-reentry" },
            { text: "re-entry", popup: "term-reentry" }
          ],
          children: [
            { text: "Return behind the upright, in-bounds skaters you were behind when you became out of bounds." },
            { text: "If you were already ahead of someone when you went out, you usually do not owe that skater position just because they later moved." },
            { text: "If you were behind someone when you went out, coming back ahead of them can be a cut." },
            { text: "The hard cases involve multiple opponents, downed skaters, out-of-play skaters, and a moving Pack.", popup: "cutting-reentry" }
          ]
        },
        {
          text: "Straddling is a re-entry warning light, not a normal skating state.",
          terms: [
            { text: "Straddling", popup: "straddling-reentry" }
          ],
          children: [
            { text: "One skate in and one skate out means you are straddling." },
            { text: "For re-entry thinking, treat that as out of bounds unless a specific rule says otherwise." },
            { text: "Before you keep playing, get fully in bounds without improving your position.", popup: "straddling-reentry" }
          ]
        },
        { type: "worked-example", text: "Worked example: you were behind White Pivot when you stepped out. If you return with your hips ahead of White Pivot, you used the out-of-bounds area to gain position. Give that position back before continuing." },
        { text: "Out-of-play calls often begin as a warning. They become penalties when a skater fails to return or keeps affecting play." }
      ]
    },
    {
      title: "Deep end",
      level: "Advanced / official",
      items: [
        { text: "Officials assess who caused the illegal impact, whether advantage changed, and whether an additional penalty is required.", popup: "official-penalty-assessment" }
      ]
    }
  ],
  common: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "If you leave the track, your next job is not offense or defense. Your next job is to come back legally and safely." },
        {
          text: "If an official tells you to yield, return, or stop doing something, treat that as useful information and act immediately.",
          terms: [
            { text: "yield", popup: "term-yield" }
          ]
        },
        {
          text: "The common calls players meet first are back blocks, cuts, out-of-play blocks, forearms, low blocks, and false starts.",
          terms: [
            { text: "back blocks", popup: "term-back-block" },
            { text: "forearms", popup: "term-forearm" },
            { text: "low blocks", popup: "term-low-block" },
            { text: "false starts", popup: "term-false-start" }
          ]
        },
        { text: "If one foot is in and one foot is out, do not keep playing like nothing happened. Treat it as a re-entry problem." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        { text: "When a play feels chaotic, ask what changed: did someone fall, go out, lose position, gain position, or lose an opportunity?" },
        { text: "Use the same order every time: find the Pack, name the roles, then judge the pass, contact, or re-entry." },
        {
          text: "For re-entry, ask who you owe position to before you skate forward again.",
          children: [
            { text: "Who was upright and in bounds?" },
            { text: "Who were you behind when you became out of bounds?" },
            { text: "Can you return fully in bounds without ending up ahead of them?", popup: "straddling-reentry" }
          ]
        },
        {
          text: "For apex jumps, separate the scoring moment from the landing aftermath.",
          children: [
            { text: "You may have earned points while airborne." },
            { text: "You may still have to re-enter legally after landing." },
            { text: "Those two answers can both be true.", popup: "apex-jump-reentry" }
          ]
        }
      ]
    }
  ],
  star: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "The Jammer may pass the Star to the Pivot. That is how the Jammer role can move to another skater." },
        {
          text: "The Pivot becomes the Jammer only when the Star Pass is actually successful.",
          terms: [
            { text: "Star Pass", popup: "star-pass-control" }
          ]
        },
        { text: "A Jammer without the Star still has Jammer responsibilities. Taking the cover off is not a pause button." },
        { text: "If the Star is off, slow down: who has it, who can receive it, and has the pass actually completed?" }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        {
          text: "Control, visibility, release, and receipt all matter because the role changes at a precise moment.",
          children: [
            { text: "Who has the Star at that moment can decide who can score or gain Lead." },
            { text: "If the Pivot never legally receives the Star, the old Jammer is still the Jammer." },
            { text: "If the pass completes, the new Jammer inherits the job immediately." },
            { text: "A failed Star Pass can look strange, but it still follows role, control, and timing rules.", popup: "star-pass-control" }
          ]
        }
      ]
    }
  ],
  box: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        {
          text: "When you are penalized, stop playing, leave the track legally, and report to the Penalty Box.",
          terms: [
            { text: "Penalty Box", popup: "penalty-box-service" }
          ]
        },
        { text: "Sit, serve the required time, wait to be released, then return legally." },
        { text: "Do not turn one penalty into more problems by ignoring officials, removing required gear incorrectly, or entering play illegally." },
        { text: "The safest habit is boring in the best way: hear the call, exit without contact, sit, wait, and re-enter cleanly." }
      ]
    },
    {
      title: "Game sense",
      level: "Intermediate",
      items: [
        { text: "Jammer penalties can change the scoring rhythm because the scoring skater may be off the track serving time." },
        { text: "Some Box questions are really role-and-timing questions, especially when Jammers are involved.", popup: "penalty-box-service" },
        { text: "Returning from the Box still uses the same re-entry brain: do not enter into an illegal or unfair position." }
      ]
    }
  ],
  later: [
    {
      title: "Player basics",
      level: "Beginner",
      items: [
        { text: "You do not need every edge case on day one. Learning too many rare cases early makes the common calls harder." },
        { text: "It is enough to know that official reviews, expulsions, substitutions, and rare penalty-service problems exist." },
        { text: "If a topic only matters once every few games, park it here until the common player decisions feel automatic." }
      ]
    },
    {
      title: "Deep end",
      level: "Advanced / official",
      items: [
        { text: "These topics are best learned after the core player model is stable.", popup: "advanced-edge-cases" }
      ]
    }
  ]
};

const STUDY_DEEP_DIVES = {
  "term-jammer": {
    title: "Jammer",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Jammer is the scoring skater for a team. They are identified by the Star helmet cover."
        ]
      },
      {
        heading: "Why beginners need it",
        paragraphs: [
          "Most scoring, Lead, Star Pass, and Penalty Box questions start by knowing who the Jammer is at that exact moment."
        ],
        note: "Shortcut: find the Star first, then ask whether the Jammer is on an initial trip or a scoring trip."
      }
    ],
    links: [
      { label: "Jammer", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-jammer` }
    ]
  },
  "term-blocker": {
    title: "Blocker",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Blockers are the non-Jammer skaters on the track. They form the Pack, make walls, assist their Jammer, and try to stop the opposing Jammer."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Pack, Engagement Zone, out-of-play, and many contact penalties are Blocker-centered. The Jammer scores, but Blockers create most of the legal playing space."
        ]
      }
    ],
    links: [
      { label: "Blocker", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-blocker` }
    ]
  },
  "term-in-bounds": {
    title: "In bounds",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "A skater is in bounds when they are touching the track and not touching beyond the track boundary. If they touch beyond the boundary, they are out of bounds or straddling."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Boundary status affects scoring, legal contact, re-entry, and cutting. A skater can do something that looks athletic and still owe a legal return before continuing."
        ],
        note: "Player habit: if you leave the track, solve re-entry before you solve offense or defense."
      }
    ],
    links: [
      { label: "Glossary: In Bounds", href: `${SOURCE_ROOT}/90_glossary.html#in-bounds` }
    ]
  },
  "term-upright": {
    title: "Upright",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Upright means the skater is not down. In many position and re-entry questions, downed skaters are treated differently until they become upright again."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "For cutting and re-entry, you usually care about upright, in-bounds opponents. A downed skater may not count the same way for the position you owe."
        ]
      }
    ],
    links: [
      { label: "Glossary: Down", href: `${SOURCE_ROOT}/90_glossary.html#down` }
    ]
  },
  "term-in-play": {
    title: "In play",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "In play means a Blocker is close enough to the Pack to legally engage. A skater can be on the track and still be out of play if they are too far from the Pack."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Out-of-play calls often feel random until you separate physical track position from legal play status. The Pack creates the zone where most blocking is allowed."
        ],
        note: "If you hear an out-of-play warning, return instead of continuing to block."
      }
    ],
    links: [
      { label: "Pack & Engagement Zone", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-pack-and-engagement-zone` }
    ]
  },
  "term-pass": {
    title: "Pass",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "A pass is about gaining superior position on another skater, usually judged by hips. In scoring, earned passes on opposing Blockers become points."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Being visually ahead is not always enough. The pass must be earned legally, and timing matters: did the pass happen before the skater went out, fell, or changed status?"
        ]
      }
    ],
    links: [
      { label: "Earning Points", href: `${SOURCE_ROOT}/03_scoring.html#scoring-earning-points` }
    ]
  },
  "term-earned-pass": {
    title: "Earning passes",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "An earned pass is a pass that counts for scoring or eligibility because the Jammer gained the position legally."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "A Jammer can appear ahead without earning the pass. Boundary status, upright status, trip status, and illegal position can all change the answer."
        ],
        note: "Scoring shortcut: ask whether the pass was earned before the next messy thing happened."
      }
    ],
    links: [
      { label: "Earning Points", href: `${SOURCE_ROOT}/03_scoring.html#scoring-earning-points` }
    ]
  },
  "term-pack": {
    title: "Pack",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Pack is the largest group of in-bounds Blockers from both teams skating close enough to each other. It is held together by 10 ft proximity links."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "The Pack creates the Engagement Zone. If you can find the Pack, you can answer many out-of-play, blocking, re-entry, and failure-to-reform questions."
        ],
        note: "Beginner shortcut: when lost, find the Pack before judging the penalty."
      }
    ],
    links: [
      { label: "Pack & Engagement Zone", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-pack-and-engagement-zone` }
    ]
  },
  "term-initial-trip": {
    title: "Initial trip",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The initial trip is the Jammer's first trip through the Pack in a jam. It is mainly about getting through the Pack and becoming eligible for Lead."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "The initial trip does not score points. That single fact prevents a lot of beginner scoring confusion."
        ],
        note: "Shortcut: initial trip = position and Lead, not points."
      }
    ],
    links: [
      { label: "Gameplay", href: `${SOURCE_ROOT}/02_gameplay.html` },
      { label: "Scoring", href: `${SOURCE_ROOT}/03_scoring.html` }
    ]
  },
  "term-scoring-trip": {
    title: "Scoring trip",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "A scoring trip is a later trip through the Pack where the Jammer can earn points by legally passing opposing Blockers."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Before counting points, first decide which trip the Jammer is on. Initial-trip answers and scoring-trip answers are different."
        ]
      }
    ],
    links: [
      { label: "Earning Points", href: `${SOURCE_ROOT}/03_scoring.html#scoring-earning-points` }
    ]
  },
  "term-star": {
    title: "Star",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Star is the Jammer helmet cover. It identifies the skater who can score for that team."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Star visibility and control affect Lead, scoring, and Star Pass questions. When the Star is off or hidden, slow down and ask who is still the Jammer."
        ]
      }
    ],
    links: [
      { label: "Jammer", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-jammer` }
    ]
  },
  "term-stripe": {
    title: "Stripe",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Stripe is the Pivot helmet cover. It identifies the Blocker who may legally receive the Star from the Jammer."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "The Stripe does not make the skater a Jammer by itself. The Pivot stays a Blocker until a legal Star Pass completes."
        ]
      }
    ],
    links: [
      { label: "Pivot", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-pivot` }
    ]
  },
  "term-pivot": {
    title: "Pivot",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Pivot is a Blocker wearing the Stripe helmet cover. The Pivot can receive the Star and become the Jammer if the Star Pass is legal."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Treat the Pivot as a Blocker until the Star Pass actually completes. That keeps role-change cases much cleaner."
        ]
      }
    ],
    links: [
      { label: "Pivot", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-pivot` },
      { label: "Passing the Star", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-passing-the-star` }
    ]
  },
  "term-captain": {
    title: "Captain",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Captain is the team's official on-game representative. They must be a skater, wear a visible C, and be able to serve penalties on behalf of the team."
        ]
      },
      {
        heading: "What a beginner should remember",
        list: [
          "The Captain is not a Jammer, Pivot, or Blocker role by itself; it is a team responsibility layered onto a skater.",
          "Captains can request Team Timeouts and Official Reviews.",
          "A Captain who is currently serving a penalty cannot request those timeouts or reviews.",
          "Some team or staff problems can be assessed to the Captain."
        ]
      }
    ],
    links: [
      { label: "Teams: Captains and Alternates", href: `${SOURCE_ROOT}/01_params.html#teams` },
      { label: "Team Timeouts", href: `${SOURCE_ROOT}/01_params.html#team-timeouts` }
    ]
  },
  "term-alternate": {
    title: "Alternate",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Alternate is the team's second official representative for timeout and review communication. The Alternate wears a visible A and may be a non-skating participant."
        ]
      },
      {
        heading: "How it differs from Captain",
        list: [
          "The Captain must be a skater able to serve team penalties.",
          "The Alternate may be non-skating.",
          "Both can request Team Timeouts and Official Reviews when eligible.",
          "If a non-skating Alternate creates a penalty situation, that penalty may be issued to the Captain."
        ]
      }
    ],
    links: [
      { label: "Teams: Captains and Alternates", href: `${SOURCE_ROOT}/01_params.html#teams` },
      { label: "Official Reviews", href: `${SOURCE_ROOT}/01_params.html#official-reviews` }
    ]
  },
  "term-engagement-zone": {
    title: "Engagement Zone",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "The Engagement Zone is the legal playing area around the Pack where most blocking can happen."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "A Blocker can be on the track but outside the Engagement Zone. If they keep blocking from there, they may become out of play."
        ],
        note: "Find the Pack first; the Engagement Zone comes from the Pack."
      }
    ],
    links: [
      { label: "Pack & Engagement Zone", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-pack-and-engagement-zone` }
    ]
  },
  "term-out-of-play": {
    title: "Out of play",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Out of play means a Blocker is not legally positioned to engage, usually because they are too far from the Pack or outside the Engagement Zone."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Out of play is not the same as out of bounds. You can be standing on the track and still be too far away to block."
        ],
        note: "If warned, stop affecting play and return."
      }
    ],
    links: [
      { label: "Pack & Engagement Zone", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-pack-and-engagement-zone` },
      { label: "Position penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-illegal-positioning` }
    ]
  },
  "term-hips": {
    title: "Hips",
    level: "Beginner term",
    body: [
      {
        heading: "Why hips matter",
        paragraphs: [
          "Derby uses hips as a practical reference point for many position questions: passes, superior position, Pack proximity, and re-entry."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Do not judge a pass by skates, shoulders, or fingertips. Ask where the hips are."
        ]
      }
    ],
    links: [
      { label: "Earning Points", href: `${SOURCE_ROOT}/03_scoring.html#scoring-earning-points` },
      { label: "Gaining Position", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-gaining-position` }
    ]
  },
  "term-blocking-zones": {
    title: "Blocking zones",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Blocking zones are the parts of your body you may legally use to initiate contact."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "A hit can be illegal because of what you used, even if the target was otherwise legal."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-target-zones": {
    title: "Target zones",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Target zones are the parts of an opponent's body you may legally hit."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "A hit can be illegal because of where it lands, even if you used a legal body part to make the block."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-blocking": {
    title: "Blocking",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Blocking means physically or positionally affecting an opponent. It is not limited to big hits."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Standing in someone's path, taking space, assisting a teammate, or making contact can all matter under blocking rules."
        ]
      }
    ],
    links: [
      { label: "Gameplay", href: `${SOURCE_ROOT}/02_gameplay.html` },
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-counter-blocking": {
    title: "Counter-blocking",
    level: "Intermediate term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Counter-blocking is contact made in response to an opponent's block. It is judged differently from initiating a fresh block."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "When contact gets tangled, ask who initiated the action and who was responding. That can change how the contact is judged."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-reentry": {
    title: "Re-entry",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Re-entry is the act of returning to the track after being out of bounds."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "You must return without gaining position on skaters you owed position to. That is why re-entry and cutting are learned together."
        ],
        note: "Safe habit: return behind more people than you think you need when unsure."
      }
    ],
    links: [
      { label: "Gaining Position", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-gaining-position` }
    ]
  },
  "term-yield": {
    title: "Yield",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "To yield is to give back illegally gained position or stop using an illegal advantage when instructed or required."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "If an official tells you to yield, act immediately. Delaying can turn a fixable situation into a penalty."
        ]
      }
    ],
    links: [
      { label: "Gaining Position", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-gaining-position` }
    ]
  },
  "term-back-block": {
    title: "Back block",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "A back block involves illegal contact to an opponent's back that creates meaningful impact."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Do not drive through the back of a skater to solve a wall. Change angle, slow down, or use legal contact."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-forearm": {
    title: "Forearm",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Forearm penalties involve using the arm in an illegal way to block, hold, push, or create advantage."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Keep your arms from becoming handles, hooks, or pushing tools. Use legal body position instead."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-low-block": {
    title: "Low block",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "Low block penalties involve illegal contact to or with lower parts of the body, especially when it trips or destabilizes another skater."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Protect knees, lower legs, and feet. Contact that takes away someone's base can become dangerous fast."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "term-false-start": {
    title: "False start",
    level: "Beginner term",
    body: [
      {
        heading: "What it means",
        paragraphs: [
          "A false start is a start-position or start-timing problem at the beginning of a jam."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Line up legally, wait for the Jam-Starting Whistle, and correct immediately if an official tells you to yield."
        ]
      }
    ],
    links: [
      { label: "Game Structure", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure` }
    ]
  },
  "lead-eligibility": {
    title: "Lead is not just first out",
    level: "Intermediate",
    body: [
      {
        heading: "The actual question",
        paragraphs: [
          "When people say 'first out,' they often mean first Jammer visibly clear of the Pack. Lead is narrower than that. The question is whether that Jammer was still eligible and completed the required initial-trip work legally."
        ]
      },
      {
        heading: "What can break the simple story",
        list: [
          "The Jammer did not complete the required pass sequence cleanly.",
          "The Jammer lost eligibility before becoming Lead.",
          "The Star was hidden or not worn in a way that preserves Lead eligibility.",
          "Track status changed the pass: out of bounds, out of play context, or an unearned pass."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Do not train your eye to ask only 'who got out first?' Ask 'who got through legally while still eligible?' That one extra check explains a lot of apparently weird Lead calls."
        ],
        note: "Beginner shortcut: first out is a clue, not the answer."
      }
    ],
    links: [
      { label: "Lead Jammer", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-lead-jammer` }
    ]
  },
  "official-jam-tracking": {
    title: "What officials are tracking during a jam",
    level: "Official lens",
    body: [
      {
        heading: "Why this feels hard",
        paragraphs: [
          "Players can learn a jam as a simple timeline. Officials have to watch several timelines at once, and one timeline can change the answer on another."
        ]
      },
      {
        heading: "The threads running at the same time",
        list: [
          "Pack status: is there a Pack, where is the Engagement Zone, and who is in play?",
          "Jammer status: who is the Jammer, is the Star visible, and is Lead still possible?",
          "Trip and pass status: which trip is this, and which passes were earned?",
          "Penalty status: did contact, position, or procedure create enough impact for a penalty?",
          "Jam-ending status: did Lead call it, did time expire, or did officials stop play?"
        ]
      },
      {
        heading: "How to use this as a player",
        paragraphs: [
          "If an official answer surprises you, do not assume they missed the obvious part. Often they answered a hidden prerequisite first: Pack, role, trip, or eligibility."
        ]
      }
    ],
    links: [
      { label: "Gameplay", href: `${SOURCE_ROOT}/02_gameplay.html` },
      { label: "Scoring", href: `${SOURCE_ROOT}/03_scoring.html` }
    ]
  },
  "star-pass-control": {
    title: "Star Pass control and timing",
    level: "Intermediate / official",
    body: [
      {
        heading: "The actual question",
        paragraphs: [
          "The Star Pass is not only 'did the cover move?' The question is whether the Jammer legally transferred the Star to the Pivot so that the Pivot actually became the new Jammer."
        ]
      },
      {
        heading: "What to check",
        list: [
          "Who is the Pivot at that moment?",
          "Who controls the Star?",
          "Was the Star released by the Jammer and received by the Pivot?",
          "Did the pass complete, or is the original Jammer still the Jammer?"
        ]
      },
      {
        heading: "Why edge cases get strange",
        paragraphs: [
          "A failed Star Pass can look like the Jammer role moved when it did not. That matters for scoring, Lead, penalties, and who is allowed to do what next."
        ],
        note: "Player shortcut: until the Pivot legally receives the Star, treat the original Jammer as the Jammer."
      }
    ],
    links: [
      { label: "Passing the Star", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-positions-passing-the-star` }
    ]
  },
  "captain-official-privileges": {
    title: "Captain and Alternate privileges",
    level: "Intermediate",
    body: [
      {
        heading: "The actual issue",
        paragraphs: [
          "Captain and Alternate are not skating positions like Jammer or Pivot. They are the team's official communication roles for specific clock and review requests."
        ]
      },
      {
        heading: "What they can request",
        list: [
          "A Team Timeout, if the team has one available.",
          "An Official Review, if the team has one available for that period.",
          "An Official Review used as a timeout, which spends the review instead of retaining it."
        ]
      },
      {
        heading: "What limits the privilege",
        list: [
          "The request has to come from the Captain or Alternate.",
          "They cannot request a Team Timeout or Official Review while currently serving a penalty.",
          "An Official Review must target an officiating decision from the prior jam, after the prior jam, or during the lineup time before the prior jam.",
          "After the final jam of a period, the timing window gets tight: the review must be requested within 30 seconds of the jam ending."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "For most players, the useful habit is simple: know who wears C and A, and route official requests through them. Do not assume any skater or coach can legally stop the clock."
        ]
      }
    ],
    links: [
      { label: "Team Timeouts", href: `${SOURCE_ROOT}/01_params.html#team-timeouts` },
      { label: "Official Reviews", href: `${SOURCE_ROOT}/01_params.html#official-reviews` }
    ]
  },
  "captain-penalty-responsibility": {
    title: "Why the Captain can receive team penalties",
    level: "Advanced / official",
    body: [
      {
        heading: "The actual issue",
        paragraphs: [
          "Some penalties belong to a team responsibility rather than a clean on-track action by one skater. The rules need a skater who can serve that penalty, so the Captain can become the enforcement point."
        ]
      },
      {
        heading: "Common situations",
        list: [
          "A team prevents the next jam from starting in a timely manner by failing to field legal skaters.",
          "A team requests a timeout it does not have, and has no legal review-as-timeout path left.",
          "Team Staff create a penalizable problem and the penalty must be served by a skater.",
          "A non-skater is expelled; the Captain serves the penalty when possible as a Blocker, but no penalty is recorded for the Captain in that expulsion case."
        ]
      },
      {
        heading: "The important nuance",
        paragraphs: [
          "A Captain penalty does not always mean the Captain personally did the wrong thing. Sometimes it means the team needs a skater to carry a team or bench-side consequence into the Penalty Box system."
        ],
        note: "Player shortcut: C is both privilege and responsibility. The C can ask for official help, but can also become the team's penalty handle."
      }
    ],
    links: [
      { label: "Teams: Captains and Alternates", href: `${SOURCE_ROOT}/01_params.html#teams` },
      { label: "Casebook: Illegal timeout request", href: `${CASEBOOK_ROOT}/04_c_penalties.html#scenario-67` },
      { label: "Fouling Out & Expulsions", href: `${SOURCE_ROOT}/04_penalties.html#fouling-out-expulsions` }
    ]
  },
  "pack-definition": {
    title: "Why the Pack definition carries so much weight",
    level: "Intermediate",
    body: [
      {
        heading: "The actual issue",
        paragraphs: [
          "The Pack is not just background scenery. It creates the Engagement Zone, and the Engagement Zone decides where most blocking is legal."
        ]
      },
      {
        heading: "What changes when the Pack changes",
        list: [
          "A Blocker can become out of play even while standing on the track.",
          "A block can become illegal because it happens too far from the Pack.",
          "A No Pack situation creates an immediate duty to reform.",
          "Some re-entry and return questions depend on the last defined Pack."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "When you are confused, find the Pack before you solve anything else. It is often the missing piece behind out-of-play calls, failure-to-reform calls, and weird-looking re-entry answers."
        ],
        note: "The Pack rule protects playable derby. It is not a tool for trapping opponents with distance."
      }
    ],
    links: [
      { label: "Pack & Engagement Zone", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-pack-and-engagement-zone` }
    ]
  },
  "ten-foot-pack-measurement": {
    title: "How 10 ft is measured",
    level: "Intermediate",
    body: [
      {
        heading: "The actual question",
        paragraphs: [
          "When two Blockers are near each other, the Pack question is not 'do they look close?' It is whether their hips are within 10 ft (3.05 m) measured along the track path."
        ]
      },
      {
        heading: "How to measure it",
        list: [
          "Use skater hips as the reference point.",
          "Measure the shortest distance parallel to the inside track boundary.",
          "Follow the curve or straight of the track; do not measure diagonally across the infield.",
          "Use the small 10 ft track marks as a visual aid, not as a replacement for the hip-to-hip question."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "The Pack can be built as a chain. If Red 1 is within 10 ft of White 1, and White 1 is within 10 ft of Red 2, those links can help connect one Pack. If a link opens beyond 10 ft and there is no other bridge, the Pack may split or disappear."
        ],
        note: "Player shortcut: if an official would have to guess whether you are connected, you are probably too far away."
      }
    ],
    links: [
      { label: "Pack & Engagement Zone", href: `${SOURCE_ROOT}/02_gameplay.html#gameplay-pack-and-engagement-zone` },
      { label: "Track Layout Guide", href: "https://static.wftda.com/resources/wftda-regulation-track-layout-guide.pdf" }
    ]
  },
  "official-pack-lens": {
    title: "Official Pack lens",
    level: "Official lens",
    body: [
      {
        heading: "What officials are solving first",
        paragraphs: [
          "Before an official can judge many blocks, they need a Pack answer. Is there a Pack? Where is it? Is this Blocker in play, out of play, or part of a No Pack situation?"
        ]
      },
      {
        heading: "Why that comes before the penalty",
        list: [
          "Out-of-play blocking depends on Pack location.",
          "Failure to reform depends on whether a No Pack exists and what skaters do next.",
          "Illegal position warnings depend on whether the skater can reasonably know they need to return.",
          "Continued engagement matters when a skater stays involved after they should stop."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "If you hear an out-of-play warning, do not debate the whole case in your head. Stop affecting play and return. The warning is useful real-time information."
        ]
      }
    ],
    links: [
      { label: "Position penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-illegal-positioning` }
    ]
  },
  "not-on-track-points": {
    title: "Unavailable opponents still matter",
    level: "Intermediate",
    body: [
      {
        heading: "The actual issue",
        paragraphs: [
          "Scoring would break if a team could avoid points simply by making opponents unavailable. The rules prevent that by allowing points in some cases where the Jammer had no normal chance to earn the pass on track."
        ]
      },
      {
        heading: "When to think about it",
        list: [
          "An opposing Blocker is in the Penalty Box.",
          "An opponent is out of bounds or otherwise unavailable.",
          "A Jammer completes a trip without a real opportunity to earn a pass on that opponent.",
          "The question is tied to trip status, not just where the opponent is standing."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Do not assume 'not on the track' means 'cannot be scored on.' First ask whether the Jammer completed the trip and whether the opponent was unavailable in a way the scoring rules handle."
        ]
      }
    ],
    links: [
      { label: "Earning Points", href: `${SOURCE_ROOT}/03_scoring.html#scoring-earning-points` }
    ]
  },
  "apex-jump-reentry": {
    title: "Apex jump: points first, re-entry second",
    level: "Intermediate",
    body: [
      {
        heading: "The actual question",
        paragraphs: [
          "This is really two questions that happen close together. First: did the airborne pass earn points? Second: after landing, is the Jammer legally positioned to keep playing?"
        ]
      },
      {
        heading: "How to sequence it",
        list: [
          "If the Jammer jumped from in bounds, treat the airborne part from that starting status.",
          "Ask whether the pass was earned before the landing problem happened.",
          "If the first floor contact is in bounds, the scoring pass may already be complete.",
          "If another skate then lands out of bounds or straddling, switch to the re-entry question."
        ]
      },
      {
        heading: "Why this matters",
        paragraphs: [
          "A Jammer can earn points and still immediately owe a legal re-entry. Those answers do not cancel each other out because they answer different moments."
        ],
        note: "Player shortcut: count the jump first, then ask who you must return behind before you continue."
      }
    ],
    links: [
      { label: "Earning Points", href: `${SOURCE_ROOT}/03_scoring.html#scoring-earning-points` },
      { label: "Scenario C3.1.D", href: `${CASEBOOK_ROOT}/03_c_scoring.html#document-casebook/03_c_scoring-scenario-3` }
    ]
  },
  "straddling-reentry": {
    title: "Straddling and re-entry",
    level: "Intermediate",
    body: [
      {
        heading: "The actual question",
        paragraphs: [
          "If one skate is in bounds and one skate is out of bounds, the tempting question is 'am I kind of still in?' For re-entry, the better question is 'what position would I have if I became fully in bounds from here?'"
        ]
      },
      {
        heading: "How to think on track",
        list: [
          "Treat straddling as a warning state, not a normal place to keep playing.",
          "Get fully in bounds before you continue normal play.",
          "Do not use that moment to end up ahead of upright, in-bounds skaters you were behind when you went out.",
          "If becoming fully in bounds would gain position, give that position back first."
        ]
      },
      {
        heading: "Example",
        paragraphs: [
          "You land with one skate in and one skate out after an apex jump. You may have scored already, but now you are not cleanly back in normal play. Before accelerating, ask whether stepping fully in bounds would put your hips ahead of someone you owed position to."
        ]
      }
    ],
    links: [
      { label: "Glossary: Straddling", href: `${SOURCE_ROOT}/90_glossary.html#straddling` },
      { label: "Gaining Position", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-gaining-position` }
    ]
  },
  "apex-official-sequence": {
    title: "Official sequence for apex landings",
    level: "Official lens",
    body: [
      {
        heading: "The official sequence",
        paragraphs: [
          "Officials separate the scoring status from the later track-status problem. First decide whether the airborne pass was earned. Then decide what the landing did to the Jammer's legal position."
        ]
      },
      {
        heading: "What that prevents",
        paragraphs: [
          "Without this sequence, a completed scoring action could be undone by something that happened afterward. The cleaner approach is to preserve the completed answer, then judge the next rules question."
        ]
      },
      {
        heading: "How to explain it to a player",
        paragraphs: [
          "The point can be real. The re-entry problem can also be real. Officials are not contradicting themselves; they are answering two different snapshots."
        ]
      }
    ],
    links: [
      { label: "Scenario C3.1.D", href: `${CASEBOOK_ROOT}/03_c_scoring.html#document-casebook/03_c_scoring-scenario-3` },
      { label: "Gaining Position", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-gaining-position` }
    ]
  },
  "scoring-avoidance": {
    title: "Scoring avoidance",
    level: "Advanced / official",
    body: [
      {
        heading: "The actual issue",
        paragraphs: [
          "Scoring avoidance exists because the game cannot let teams erase scoring opportunities by making scoring targets unavailable at the right moment."
        ]
      },
      {
        heading: "What the rule protects",
        list: [
          "A Jammer's normal chance to earn passes.",
          "A scoring trip that would otherwise be completed against available opponents.",
          "The principle that opponents avoid points by staying ahead or making passes unearned, not by vanishing from the scoring problem."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Do not try to become unscoreable through leaving play, procedural weirdness, or timing tricks. If the Jammer had no normal chance to earn the pass because of availability, the scoring rules may still give the point."
        ]
      }
    ],
    links: [
      { label: "Scoring Avoidance", href: `${SOURCE_ROOT}/03_scoring.html#scoring-scoring-avoidance` }
    ]
  },
  "penalty-impact": {
    title: "Impact is the bridge between illegal and penalized",
    level: "Intermediate",
    body: [
      {
        heading: "The actual issue",
        paragraphs: [
          "Derby has many technical illegal actions, but not every tiny technical problem deserves a penalty. Often the question is whether the action created meaningful impact."
        ]
      },
      {
        heading: "Impact can mean",
        list: [
          "A skater falls or is forced out.",
          "A skater loses or gains meaningful position.",
          "A scoring opportunity changes.",
          "The Pack, start, timing, or game structure is disrupted.",
          "A safety risk becomes real rather than theoretical."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "When reviewing contact, ask two questions. First, what was illegal about the action? Second, what did it change? That second question is often the difference between noise and a penalty."
        ]
      }
    ],
    links: [
      { label: "Contact Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-contact` }
    ]
  },
  "cutting-reentry": {
    title: "Cutting and re-entry",
    level: "Intermediate / advanced",
    body: [
      {
        heading: "The actual question",
        paragraphs: [
          "Cutting is not simply 'you stepped out.' The question is whether you used the out-of-bounds area to gain position on an upright, in-bounds skater."
        ]
      },
      {
        heading: "The player version",
        list: [
          "Remember who you were behind when you became out of bounds.",
          "Return behind those upright, in-bounds skaters.",
          "If you come back ahead of someone you owed position to, give that position back immediately.",
          "If you were blocked out, the skater who blocked you has special relevance for where you may return."
        ]
      },
      {
        heading: "Why the hard cases feel unfair",
        paragraphs: [
          "Downed skaters, out-of-play skaters, teammates, and a moving Pack can all change the answer. A downed skater's position is not assessed until they are upright, which is why some re-entry cases feel counterintuitive at first."
        ],
        note: "Player shortcut: if you are unsure, return behind more people than you think you need to. It is usually the safer choice."
      }
    ],
    links: [
      { label: "Gaining Position", href: `${SOURCE_ROOT}/04_penalties.html#penalties-structure-gaining-position` },
      { label: "Casebook: Gaining Position", href: `${CASEBOOK_ROOT}/04_c_penalties.html#document-casebook/04_c_penalties-scenario-59` }
    ]
  },
  "official-penalty-assessment": {
    title: "Penalty assessment",
    level: "Official lens",
    body: [
      {
        heading: "What officials are deciding",
        paragraphs: [
          "A penalty assessment is not just 'something looked illegal.' Officials identify the action, the responsible skater, the rule category, and whether the threshold for a penalty was met."
        ]
      },
      {
        heading: "The assessment stack",
        list: [
          "Who initiated or caused the action?",
          "What role and status did that skater have?",
          "Which rule category controls the action?",
          "Was there enough impact, advantage, safety risk, or game-structure disruption?",
          "Does the case require an additional or different penalty?"
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Players benefit most from the intuition: identify what changed. Officials then need the full taxonomy to report the correct call."
        ]
      }
    ],
    links: [
      { label: "Assessing Penalties", href: `${SOURCE_ROOT}/05_officiating.html#officiating-assessing-penalties` }
    ]
  },
  "penalty-box-service": {
    title: "Penalty Box service details",
    level: "Advanced / official",
    body: [
      {
        heading: "The player habit",
        paragraphs: [
          "Most players should learn the simple chain first: leave, report, sit, serve, stand when required, and return legally. That habit prevents many avoidable follow-up problems."
        ]
      },
      {
        heading: "Where it gets deeper",
        list: [
          "Jammer penalties can shorten or change service timing when both Jammers are penalized.",
          "Blocker seats can fill, creating queue situations.",
          "Penalty timing depends on jam time and can pause between jams.",
          "Gear problems, substitutions, and inability to serve create administrative cases."
        ]
      },
      {
        heading: "Player takeaway",
        paragraphs: [
          "Do the boring part correctly. The deeper Box logic is easier to learn once your first response to a penalty is automatic and calm."
        ]
      }
    ],
    links: [
      { label: "Enforcing Penalties", href: `${SOURCE_ROOT}/04_penalties.html#penalties-enforcing-penalties` }
    ]
  },
  "advanced-edge-cases": {
    title: "Why edge cases live at the deep end",
    level: "Advanced / official",
    body: [
      {
        heading: "Why not teach these first?",
        paragraphs: [
          "Official reviews, expulsions, substitutions, and rare penalty-service cases matter. They are also poor first material because they depend on core ideas the learner has not stabilized yet."
        ]
      },
      {
        heading: "What belongs here",
        list: [
          "Official reviews and timing limits.",
          "Fouling out and expulsions.",
          "Substitute serving and unable-to-serve situations.",
          "Rare Star Pass and penalty-service edge cases."
        ]
      },
      {
        heading: "Learning order",
        paragraphs: [
          "Beginners should first understand normal jam flow, Pack, scoring, legal contact, and re-entry. Once those are stable, edge cases become interesting instead of disorienting."
        ]
      }
    ],
    links: [
      { label: "Fouling Out & Expulsions", href: `${SOURCE_ROOT}/04_penalties.html#fouling-out-expulsions` },
      { label: "Official Reviews", href: `${SOURCE_ROOT}/01_params.html#official-reviews` }
    ]
  }
};

const STORAGE = {
  stats: "wftdaAssessmentStats.v1",
  bookmarks: "wftdaAssessmentBookmarks.v1",
  tests: "wftdaAssessmentTests.v1",
  edits: "wftdaQuestionEdits.v1",
  originals: "wftdaQuestionOriginals.v1",
  remoteBank: "rollerDerbyRulesGymQuestionBank.v1"
};

const SESSION = {
  bankFetched: "rollerDerbyRulesGymQuestionBankFetched.v1"
};

function createQuestionBank(source = window.OFFICIAL_CASES || []) {
  return source.map((item) => {
    const correct = item.correct || item.outcome || "";
    const teachingNote = item.teachingNote || defaultTeachingNote(item);
    const distractors = item.distractors?.length
      ? item.distractors.map(capitalizeFirstAlpha)
      : derivedDistractors({ ...item, outcome: correct });
    return {
      id: item.id,
      seedId: item.id,
      section: item.section,
      category: item.category,
      studyTheme: item.studyTheme || studyThemeForCategory(item.category),
      caseId: item.caseId,
      caseAnchor: item.caseAnchor,
      caseUrl: normalizeWftdaCaseUrl(item.caseUrl, item.caseId, item.caseAnchor, item.rule),
      rule: item.rule,
      ruleAnchor: item.ruleAnchor,
      ruleUrl: normalizeWftdaRuleUrl(item.ruleUrl, item.ruleAnchor, item.rule),
      tags: item.tags || [],
      kind: item.outcomeLabel || "Outcome",
      scenario: item.scenario,
      context: item.context || defaultContextNote(item),
      prompt: item.prompt || defaultQuestionPrompt(item),
      correct,
      teachingNote: teachingNote || "The official answer follows from the cited rulebook section.",
      comment: item.comment || "",
      hasEdit: false,
      distractors,
      common: item.common ?? isCommonScenario(item)
    };
  });
}

function studyThemeForCategory(category) {
  const module = LEARNING_PATH.find((item) => item.categories.includes(category));
  if (module) return module.title;
  if (category === "Casebook") return LEARNING_PATH[0].title;
  if (category === "Penalty enforcement") return LEARNING_PATH[4].title;
  return LEARNING_PATH[5].title;
}

function defaultQuestionPrompt(item) {
  const answerType = (item.outcomeLabel || "Outcome").toLowerCase();
  return `What is the correct official ${answerType}?`;
}

function defaultContextNote(item) {
  const categoryLens = {
    "Jammer identity": "Track who is wearing the Star at the start, then separate role identity from starting-position penalties.",
    "Lead Jammer": "Check Star visibility, legal passes, and whether the Jammer has lost eligibility for Lead.",
    "Star Pass": "Watch when the Star is released, who controls it, and whether the Pivot legally receives it.",
    "Starting positions": "Compare each Skater's position at the Jam-Starting Whistle with the role they are actually performing.",
    "Pack definition": "Identify the largest group of in-bounds Blockers from both teams before deciding Pack or No Pack consequences.",
    "Passing": "Focus on whether the pass was legal, earned, and completed by hips, not just who appears ahead.",
    "Earning points": "Separate position gained from points earned, especially across trips and unavailable opponents.",
    "Trips": "Establish which scoring trip the Jammer is on before counting passes or not-on-the-track points.",
    "Scoring avoidance": "Look for deliberate actions that prevent a Jammer from earning a normal scoring opportunity.",
    "Penalized Jammers": "Track Jammer status through the penalty and whether points are earned before, during, or after service.",
    "Illegal target zone": "Find the initiating contact, the target zone, and the impact on the opponent's position or play.",
    "Illegal blocking zone": "Find the body part used to initiate the block and whether it created meaningful impact.",
    "Other illegal contact": "Judge the contact by initiation, legality, and impact rather than by the amount of movement alone.",
    "Multi-Player Blocks": "Check whether linked teammates created an impenetrable wall or materially impeded an opponent.",
    "Position and Pack": "Resolve Pack status and engagement-zone legality before judging the block or required return.",
    "Gaining position": "Compare superior position before going out with the re-entry position and any exceptions.",
    "Game structure": "Anchor the decision to jam timing, whistles, and whether play is live or between jams.",
    "Blocker penalties": "Identify which Blocker action caused the illegal advantage or impact.",
    "Jammer penalties": "Separate Jammer privileges from illegal contact, illegal position, or scoring consequences.",
    "Assessing penalties": "Focus on who committed the penalizable action and whether any additional penalty is required."
  };
  return categoryLens[item.category] || `Focus on ${item.rule}: identify the controlling fact in the scenario, then compare it to the official outcome.`;
}

function defaultTeachingNote(item) {
  return [item.rationale, item.keepInMind ? `Keep in Mind: ${item.keepInMind}` : ""]
    .filter(Boolean)
    .join("\n\n");
}

function isCommonScenario(item) {
  const combinedText = `${item.category} ${item.scenario} ${item.outcome} ${item.rationale}`;
  return COMMON_CATEGORIES.has(item.category) && !OBSCURE_PATTERNS.some((pattern) => pattern.test(combinedText));
}

function derivedDistractors(item) {
  const correct = item.outcome.trim();
  const options = [];
  const pointMatch = correct.match(/\b(zero|one|two|three|four|five|six|\d+)\s+points?\b/i);
  const isNoPenalty = /\bno penalty\b|not issued a penalty|not penalized/i.test(correct);
  const bothPenalized = correct.match(/^(.+?) and (.+?) are both penalized\.?$/i);
  const isStarPass = /Star Pass/i.test(correct);
  const isExpulsion = /expel|expulsion/i.test(correct);

  if (pointMatch) {
    const numberWords = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
    const value = Number.isNaN(Number(pointMatch[1])) ? numberWords[pointMatch[1].toLowerCase()] : Number(pointMatch[1]);
    [Math.max(0, value - 1), value + 1, value === 4 ? 0 : 4].forEach((points) => {
      const label = ["zero", "one", "two", "three", "four", "five", "six"][points] || String(points);
      options.push(correct.replace(pointMatch[0], `${label} ${points === 1 ? "point" : "points"}`));
    });
  }

  if (bothPenalized) {
    options.push(`${bothPenalized[1]} is penalized; ${bothPenalized[2]} is not penalized.`);
    options.push(`${bothPenalized[2]} is penalized; ${bothPenalized[1]} is not penalized.`);
    options.push("No penalty is issued.");
  } else if (/warning|Yield/i.test(correct)) {
    options.push("The Skater is penalized immediately instead of being allowed to Yield.");
    options.push("The Skater keeps the warning and must continue to Yield until passed by nearby opponents.");
    options.push("No warning is issued, and the Skater may continue to play normally.");
  } else if (isNoPenalty) {
    options.push("Assess a penalty to the involved Skater.");
    options.push("Issue a formal warning as the complete official outcome.");
    options.push("Assess a penalty even though the action was immediately corrected.");
  } else if (/penal/i.test(correct)) {
    options.push("No penalty is issued.");
    options.push("Issue a warning, but do not assess a penalty.");
    options.push(correct.replace(/penalized|receives a penalty|is issued a penalty/gi, "warned"));
  }

  if (isStarPass) {
    if (/unsuccessful/i.test(correct)) {
      options.push("The Star Pass is successful, and the Pivot becomes the Jammer.");
      options.push("The Star Pass is unsuccessful, but the receiving Skater becomes the Jammer after dropping the Star.");
    } else {
      options.push("The Star Pass is unsuccessful, and both Skaters retain their existing Roles.");
      options.push("The Jammer keeps the role until the next Jam starts.");
    }
  }

  if (isExpulsion) {
    options.push("Issue a penalty, but do not expel the Skater.");
    options.push("No penalty and no expulsion are warranted.");
  }

  options.push("No penalty is issued.");
  options.push("Issue a warning only.");
  options.push("No penalty is issued because the action is treated as corrected.");

  return uniqueByText(options)
    .filter((option) => option.trim().toLowerCase() !== correct.trim().toLowerCase())
    .map(capitalizeFirstAlpha)
    .filter((option, index, list) => list.findIndex((item) => item.trim().toLowerCase() === option.trim().toLowerCase()) === index)
    .slice(0, 8);
}

let view = "dashboard";
let currentTest = null;
let currentIndex = 0;
let lastSummary = null;
let stats = readJson(STORAGE.stats, {});
let bookmarks = new Set(readJson(STORAGE.bookmarks, []));
let testHistory = readJson(STORAGE.tests, []);
let questionEdits = readJson(STORAGE.edits, {});
let originalSnapshots = ensureOriginalSnapshots();
let QUESTION_BANK = createQuestionBank();
let bankSync = {
  status: "idle",
  message: "",
  fetchedAt: 0,
  promise: null
};
let scrollAnimationFrame = 0;

const els = {
  headerMetric: document.querySelector("#headerMetric"),
  headerStatus: document.querySelector("#headerStatus"),
  dashboardTab: document.querySelector("#dashboardTab"),
  studyTab: document.querySelector("#studyTab"),
  learnTab: document.querySelector("#learnTab"),
  setupTab: document.querySelector("#setupTab"),
  allThemesTestBtn: document.querySelector("#allThemesTestBtn"),
  bookmarksTab: document.querySelector("#bookmarksTab"),
  showTab: document.querySelector("#showTab"),
  showTabIcon: document.querySelector("#showTabIcon"),
  dashboardView: document.querySelector("#dashboardView"),
  studyView: document.querySelector("#studyView"),
  learnView: document.querySelector("#learnView"),
  setupView: document.querySelector("#setupView"),
  testView: document.querySelector("#testView"),
  summaryView: document.querySelector("#summaryView"),
  bookmarksView: document.querySelector("#bookmarksView"),
  showView: document.querySelector("#showView"),
  dashboardStats: document.querySelector("#dashboardStats"),
  dashboardSuccessRate: document.querySelector("#dashboardSuccessRate"),
  dashboardGraph: document.querySelector("#dashboardGraph"),
  dashboardGraphNote: document.querySelector("#dashboardGraphNote"),
  learnRoot: document.querySelector("#learnRoot"),
  studyPracticeRoot: document.querySelector("#studyPracticeRoot"),
  studyDepthDialog: document.querySelector("#studyDepthDialog"),
  studyDepthLevel: document.querySelector("#studyDepthLevel"),
  studyDepthTitle: document.querySelector("#studyDepthTitle"),
  studyDepthBody: document.querySelector("#studyDepthBody"),
  studyDepthLinks: document.querySelector("#studyDepthLinks"),
  closeStudyDepthBtn: document.querySelector("#closeStudyDepthBtn"),
  resetShownBtn: document.querySelector("#resetShownBtn"),
  resetShownDialog: document.querySelector("#resetShownDialog"),
  cancelResetShownBtn: document.querySelector("#cancelResetShownBtn"),
  confirmResetShownBtn: document.querySelector("#confirmResetShownBtn"),
  bookmarkTestBtn: document.querySelector("#bookmarkTestBtn"),
  clearBookmarksBtn: document.querySelector("#clearBookmarksBtn"),
  clearBookmarksDialog: document.querySelector("#clearBookmarksDialog"),
  cancelClearBookmarksBtn: document.querySelector("#cancelClearBookmarksBtn"),
  confirmClearBookmarksBtn: document.querySelector("#confirmClearBookmarksBtn"),
  focusOldToggle: document.querySelector("#focusOldToggle"),
  startTestBtn: document.querySelector("#startTestBtn"),
  clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
  setupBankStatus: document.querySelector("#setupBankStatus"),
  bankStats: document.querySelector("#bankStats"),
  questionCount: document.querySelector("#questionCount"),
  progressFill: document.querySelector("#progressFill"),
  sectionBadge: document.querySelector("#sectionBadge"),
  caseBadge: document.querySelector("#caseBadge"),
  bookmarkCurrentBtn: document.querySelector("#bookmarkCurrentBtn"),
  scenarioText: document.querySelector("#scenarioText"),
  questionText: document.querySelector("#questionText"),
  choices: document.querySelector("#choices"),
  caseLink: document.querySelector("#caseLink"),
  ruleLink: document.querySelector("#ruleLink"),
  cancelTestBtn: document.querySelector("#cancelTestBtn"),
  differentQuestionBtn: document.querySelector("#differentQuestionBtn"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  summaryRoot: document.querySelector("#summaryRoot"),
  bookmarksRoot: document.querySelector("#bookmarksRoot"),
  bookmarkCount: document.querySelector("#bookmarkCount"),
  sheetLink: document.querySelector("#showView .sheet-link"),
  refreshBankBtn: document.querySelector("#refreshBankBtn"),
  bankSyncStatus: document.querySelector("#bankSyncStatus")
};

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readCachedQuestionBank() {
  const cached = readJson(STORAGE.remoteBank, null);
  if (!cached || !Array.isArray(cached.questions) || cached.questions.length === 0) return null;
  return cached;
}

function hydrateCachedQuestionBank() {
  const cached = readCachedQuestionBank();
  if (!cached) return false;
  const questions = cached.questions.map(normalizeQuestion);
  try {
    validateQuestionBank(questions);
  } catch (error) {
    console.warn(error);
    localStorage.removeItem(STORAGE.remoteBank);
    return false;
  }
  QUESTION_BANK = questions;
  bankSync.fetchedAt = cached.fetchedAt || 0;
  bankSync.status = "ready";
  bankSync.message = `Using saved question bank from ${formatDateTime(cached.fetchedAt)}.`;
  return true;
}

function isMobileDataContext() {
  return window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
}

function shouldAutoFetchQuestionBank() {
  if (sessionStorage.getItem(SESSION.bankFetched) === "true") return false;
  if (!isMobileDataContext()) return true;
  const cached = readCachedQuestionBank();
  return !cached?.fetchedAt || Date.now() - cached.fetchedAt > SIX_MONTHS_MS;
}

function refreshQuestionBank({ force = false } = {}) {
  if (bankSync.promise) return bankSync.promise;
  if (!force && !shouldAutoFetchQuestionBank()) {
    bankSync.status = "ready";
    bankSync.message = "Question bank already up to date.";
    render();
    return Promise.resolve(false);
  }

  sessionStorage.setItem(SESSION.bankFetched, "true");
  bankSync = {
    ...bankSync,
    status: "loading",
    message: "Refreshing question bank from Google Sheets...",
    promise: null
  };
  render();

  const sheetUrl = `${SHEET_CSV_URL}&v=${Date.now()}`;
  bankSync.promise = fetch(sheetUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`Sheet fetch failed (${response.status})`);
      return response.text();
    })
    .then((csv) => {
      const rows = csvToObjects(csv);
      const source = rows.map(sheetRowToSource).filter(Boolean);
      const questions = createQuestionBank(source);
      validateQuestionBank(questions);
      const fetchedAt = Date.now();
      QUESTION_BANK = questions;
      writeJson(STORAGE.remoteBank, { fetchedAt, questions });
      bankSync.status = "ready";
      bankSync.fetchedAt = fetchedAt;
      bankSync.message = `Question bank refreshed: ${questions.length} questions.`;
      render();
      return true;
    })
    .catch((error) => {
      bankSync.status = "error";
      bankSync.message = `Could not refresh from Google Sheets. Using saved or built-in questions.`;
      console.warn(error);
      render();
      return false;
    })
    .finally(() => {
      bankSync.promise = null;
      render();
    });

  return bankSync.promise;
}

function csvToObjects(csv) {
  const rows = parseCsv(csv);
  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() || ""])));
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function sheetRowToSource(row) {
  const id = row.id;
  const scenario = row.official_scenario;
  const correct = row.correct_answer;
  const wrongs = [row.wrong_answer_1, row.wrong_answer_2, row.wrong_answer_3].filter(Boolean);
  if (!id || !scenario || !correct || wrongs.length < 1) return null;
  return {
    id,
    section: row.section || "Rules",
    category: row.category || "Rules",
    studyTheme: row.study_theme || studyThemeForCategory(row.category),
    caseId: row.case_id || id,
    caseUrl: normalizeWftdaCaseUrl(row.casebook_url, row.case_id || id, row.casebook_url, row.rule),
    rule: row.rule || "Rulebook",
    ruleUrl: normalizeWftdaRuleUrl(row.rulebook_url, null, row.rule),
    tags: splitTags(row.tags),
    outcomeLabel: row.outcome_label || "Outcome",
    scenario,
    context: row.learning_context,
    prompt: row.question_prompt,
    correct,
    outcome: correct,
    teachingNote: row.correct_rationale,
    rationale: row.correct_rationale,
    keepInMind: row.keep_in_mind,
    distractors: wrongs.map(capitalizeFirstAlpha),
    common: /^yes$/i.test(row.common_scenario || "")
  };
}

function normalizeWftdaCaseUrl(url, caseId, caseAnchor, rule) {
  const candidates = [url, caseAnchor].filter(Boolean);
  for (const candidate of candidates) {
    const text = String(candidate).trim();
    if (/(?:^|\/)document-rules\/|\/0[2-5]_[a-z]+\.html(?:#|$)/i.test(text)) {
      return normalizeWftdaRuleUrl(text, null, rule);
    }

    const current = text.match(/(?:^|\/)casebook\/(0[2-5]_c_[a-z_]+\.html)#(scenario-\d+)$/i);
    if (current) return `${CASEBOOK_ROOT}/${current[1]}#${current[2]}`;

    const compact = text.match(/^(0[2-5]_c_[a-z_]+\.html)#(scenario-\d+)$/i);
    if (compact) return `${CASEBOOK_ROOT}/${compact[1]}#${compact[2]}`;

    const legacy = text.match(/(?:^|\/)document-casebook\/(0[2-5]_c_[a-z_]+)-scenario-(\d+)$/i);
    if (legacy) return `${CASEBOOK_ROOT}/${legacy[1]}.html#scenario-${legacy[2]}`;
  }

  const page = casebookPageForCase(caseId);
  const scenario = candidates.join(" ").match(/scenario-(\d+)/i);
  if (page && scenario) return `${CASEBOOK_ROOT}/${page}#scenario-${scenario[1]}`;
  if (page) return `${CASEBOOK_ROOT}/${page}`;
  return `${CASEBOOK_ROOT}/index.html`;
}

function casebookPageForCase(caseId) {
  const chapter = String(caseId || "").match(/\b(C[2-5])\./i)?.[1]?.toUpperCase();
  return CASEBOOK_PAGE_BY_CHAPTER[chapter] || "";
}

function normalizeWftdaRuleUrl(url, ruleAnchor, rule) {
  const anchor = normalizeRuleAnchor(ruleAnchor) || normalizeRuleAnchor(url) || ruleAnchorForRule(rule);
  const page = rulePageForAnchor(anchor) || rulePageForRule(rule);
  if (page && anchor) return `${SOURCE_ROOT}/${page}#${anchor}`;
  if (page) return `${SOURCE_ROOT}/${page}`;
  return `${SOURCE_ROOT}/index.html`;
}

function normalizeRuleAnchor(value) {
  if (!value) return "";
  const text = String(value).trim();
  const hash = text.match(/#([^#]+)$/)?.[1];
  const raw = hash || text
    .replace(/^https?:\/\/rules\.wftda\.com\//i, "")
    .replace(/^\//, "")
    .replace(/\.html$/i, "");
  if (!raw || raw.includes("/")) return "";
  return RULE_ANCHOR_ALIASES[raw] || raw;
}

function rulePageForAnchor(anchor) {
  if (!anchor) return "";
  if (/^(gameplay-|skater-starting-locations)/.test(anchor)) return "02_gameplay.html";
  if (/^scoring-/.test(anchor)) return "03_scoring.html";
  if (/^(penalties-|protective-gear-in-the-penalty-box|skaters-unable-to-serve-penalties|fouling-out-expulsions)/.test(anchor)) {
    return "04_penalties.html";
  }
  if (/^officiating-/.test(anchor)) return "05_officiating.html";
  return "";
}

function rulePageForRule(rule) {
  const section = String(rule || "").match(/Section\s+([2-5])\./i)?.[1];
  return {
    2: "02_gameplay.html",
    3: "03_scoring.html",
    4: "04_penalties.html",
    5: "05_officiating.html"
  }[section] || "";
}

function ruleAnchorForRule(rule) {
  const section = String(rule || "").match(/Section\s+(\d+(?:\.\d+)*)/i)?.[1];
  const anchors = {
    "2.1": "gameplay-the-track",
    "2.2": "gameplay-positions",
    "2.2.1": "gameplay-positions-jammers",
    "2.2.2": "gameplay-positions-lead-jammer",
    "2.2.4": "gameplay-positions-passing-the-star",
    "2.2.6": "skater-starting-locations",
    "2.3": "gameplay-engagement-zone-and-pack",
    "2.5": "gameplay-passing",
    "3.1": "scoring-earning-points",
    "3.2": "scoring-trips",
    "3.3": "scoring-avoidance",
    "3.4": "scoring-penalized-jammers",
    "4.1.1": "penalties-impact-to-illegal-zone",
    "4.1.2": "penalties-impact-with-illegal-zone",
    "4.1.3": "penalties-other-illegal-contact",
    "4.1.4": "penalties-multiplayer-blocks",
    "4.1.5": "penalties-unsporting-contact",
    "4.2.1": "penalties-structure-illegal-positioning",
    "4.2.2": "penalties-structure-gaining-position",
    "4.2.4": "penalties-structure-other-illegal-procedures",
    "4.3": "penalties-unsporting-conduct",
    "4.4": "penalties-enforcement",
    "4.4.1": "penalties-enforcement-blockers",
    "4.4.2": "penalties-enforcement-jammers",
    "4.4.3": "skaters-unable-to-serve-penalties",
    "4.4.4": "protective-gear-in-the-penalty-box",
    "4.5": "penalties-foul-out-expulsion",
    "5.4": "officiating-assessing-penalties"
  };
  return anchors[section] || "";
}

function validateQuestionBank(questions) {
  const issues = [];
  const ids = new Set();
  if (questions.length < REQUIRED_BANK_QUESTION_COUNT) {
    issues.push(`expected ${REQUIRED_BANK_QUESTION_COUNT} questions, found ${questions.length}`);
  }

  questions.forEach((question, index) => {
    const label = question.caseId || question.id || `question ${index + 1}`;
    const options = [question.correct, ...(question.distractors || [])].filter(Boolean);
    const uniqueOptions = uniqueByText(options);
    if (!question.id) issues.push(`${label}: missing id`);
    if (ids.has(question.id)) issues.push(`${label}: duplicate id`);
    ids.add(question.id);
    if (!question.scenario || /^outcome$/i.test(question.scenario.trim())) issues.push(`${label}: missing official scenario`);
    if (!question.correct) issues.push(`${label}: missing correct answer`);
    if (!String(question.teachingNote || "").trim()) issues.push(`${label}: missing rationale`);
    if (uniqueOptions.length !== options.length) issues.push(`${label}: duplicate answer option`);

    if (isTrueFalsePrompt(question.prompt) || isBinaryOptionSet(question.correct, question.distractors)) {
      if (!isBinaryOptionSet(question.correct, question.distractors)) {
        issues.push(`${label}: binary question must have exactly True/False or Yes/No options`);
      }
    } else if (uniqueOptions.length < 4) {
      issues.push(`${label}: needs four unique multiple-choice options`);
    }

    if (!isOfficialSourceUrl(question.caseUrl)) issues.push(`${label}: invalid primary source link`);
    if (!isOfficialRuleUrl(question.ruleUrl)) issues.push(`${label}: invalid rulebook source link`);
  });

  if (issues.length) {
    throw new Error(`Question bank validation failed: ${issues.slice(0, 8).join("; ")}${issues.length > 8 ? `; and ${issues.length - 8} more` : ""}`);
  }
}

function isTrueFalsePrompt(prompt) {
  return /^true\s+or\s+false\b/i.test(String(prompt || "").trim());
}

function isBinaryOptionSet(correct, distractors = []) {
  return isTrueFalseOptionSet(correct, distractors) || isYesNoOptionSet(correct, distractors);
}

function isTrueFalseOptionSet(correct, distractors = []) {
  const labels = uniqueByText([correct, ...distractors].filter(Boolean))
    .map((item) => item.trim().toLowerCase());
  return labels.length === 2 && labels.includes("true") && labels.includes("false");
}

function isYesNoOptionSet(correct, distractors = []) {
  const labels = uniqueByText([correct, ...distractors].filter(Boolean))
    .map((item) => item.trim().toLowerCase());
  return labels.length === 2 && labels.includes("yes") && labels.includes("no");
}

function isOfficialCasebookUrl(url) {
  return /^https:\/\/rules\.wftda\.com\/casebook\/0[2-5]_c_[a-z_]+\.html#scenario-\d+$/i.test(String(url || ""));
}

function isOfficialRuleUrl(url) {
  return /^https:\/\/rules\.wftda\.com\/0[2-5]_[a-z]+\.html#[a-z0-9-]+$/i.test(String(url || ""));
}

function isOfficialSourceUrl(url) {
  return isOfficialCasebookUrl(url) || isOfficialRuleUrl(url);
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeQuestion(question) {
  return {
    ...question,
    caseUrl: normalizeWftdaCaseUrl(question.caseUrl, question.caseId, question.caseAnchor, question.rule),
    ruleUrl: normalizeWftdaRuleUrl(question.ruleUrl, question.ruleAnchor, question.rule),
    distractors: (question.distractors || []).map(capitalizeFirstAlpha)
  };
}

function capitalizeFirstAlpha(value) {
  return String(value || "").replace(/[A-Za-z]/, (letter) => letter.toUpperCase());
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(items, count) {
  return shuffle(items).slice(0, count);
}

function overlapCount(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
}

function uniqueByText(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function adjacentDistractors(question) {
  if (isBinaryQuestion(question)) return question.distractors.slice(0, 1);
  if (question.distractors.length >= 3) return question.distractors.slice(0, 3);

  const scored = QUESTION_BANK
    .filter((candidate) => candidate.id !== question.id && candidate.correct !== question.correct)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === question.category) score += 12;
      if (candidate.section === question.section) score += 6;
      if (candidate.rule === question.rule) score += 4;
      score += overlapCount(candidate.tags, question.tags) * 3;
      score += Math.random();
      return { text: candidate.correct, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.text);

  const fallback = question.distractors.filter((item) => item !== question.correct);
  const interleaved = [];
  const max = Math.max(fallback.length, scored.length);
  for (let index = 0; index < max; index += 1) {
    if (fallback[index]) interleaved.push(fallback[index]);
    if (scored[index]) interleaved.push(scored[index]);
  }
  return uniqueByText(interleaved).slice(0, 3);
}

function choicesFor(question) {
  return shuffle(uniqueByText([question.correct, ...adjacentDistractors(question)]));
}

function isTrueFalseQuestion(question) {
  return isTrueFalseOptionSet(question.correct, question.distractors);
}

function isBinaryQuestion(question) {
  return isBinaryOptionSet(question.correct, question.distractors);
}

function getQuestion(id) {
  return QUESTION_BANK.find((question) => question.id === id);
}

function selectedLength() {
  return Number(document.querySelector("input[name='testLength']:checked").value);
}

function selectQuestions(count, focusOld) {
  const commonNeeded = minimumCommonCount(count);
  const commonQuestions = QUESTION_BANK.filter((question) => question.common);
  const selectedCommon = pickQuestions(commonQuestions, Math.min(commonNeeded, commonQuestions.length), focusOld);
  const selectedIds = new Set(selectedCommon.map((question) => question.id));
  const filler = QUESTION_BANK.filter((question) => !selectedIds.has(question.id));
  const selectedFiller = pickQuestions(filler, count - selectedCommon.length, focusOld);
  return shuffle([...selectedCommon, ...selectedFiller]);
}

function minimumCommonCount(total) {
  return Math.ceil(total * COMMON_TEST_SHARE);
}

function pickQuestions(questions, count, focusOld) {
  if (count <= 0) return [];
  if (!focusOld) return sample(questions, count);
  return shuffle(rankQuestions(questions).slice(0, count).map((item) => item.question));
}

function rankQuestions(questions, now = Date.now()) {
  return questions
    .map((question) => {
      const item = stats[question.id] || {};
      const last = item.lastAnswered || item.lastShown || 0;
      const unseenBoost = item.shown ? 0 : 10 ** 15;
      const randomJitter = Math.random() * 100000;
      return { question, score: unseenBoost + (now - last) + randomJitter };
    })
    .sort((a, b) => b.score - a.score);
}

function startTest() {
  if (bankSync.status === "loading") return;
  const count = selectedLength();
  const selected = selectQuestions(count, els.focusOldToggle.checked);
  beginTest(selected);
}

function openNewTestSetup() {
  setView("setup");
}

function startBookmarkedTest() {
  const saved = [...bookmarks].map(getQuestion).filter(Boolean);
  if (saved.length === 0) return;
  beginTest(sample(saved, Math.min(selectedLength(), saved.length)));
}

function beginTest(selected, returnTarget = null) {
  if (selected.length === 0) return;
  selected.forEach(markShown);
  const now = Date.now();
  currentTest = {
    id: `test-${now}`,
    startedAt: now,
    returnTarget,
    questionIds: selected.map((question) => question.id),
    answers: {},
    choiceOrders: Object.fromEntries(selected.map((question) => [question.id, choicesFor(question)]))
  };
  lastSummary = null;
  currentIndex = 0;
  setView("test");
  focusCurrentAnswer();
}

function startFocusedTest(moduleIndex) {
  const module = LEARNING_PATH[moduleIndex];
  if (!module) return;
  const pool = questionsForCategories(module.categories);
  beginTest(pickQuestions(pool, Math.min(10, pool.length), true), {
    view: "learn",
    anchor: `theme-${moduleIndex + 1}`
  });
}

function startStudyPractice(groupKey) {
  const pool = questionsForStudyPractice(groupKey);
  beginTest(pickQuestions(pool, Math.min(10, pool.length), true), {
    view: "study",
    anchor: STUDY_PRACTICE_SECTIONS[groupKey]
  });
}

function answerCurrent(answer) {
  if (!currentTest) return;
  const question = currentQuestion();
  currentTest.answers[question.id] = answer;
  render();
  if (!els.nextBtn.disabled) els.nextBtn.focus({ preventScroll: true });
}

function focusCurrentAnswer() {
  const selected = els.choices.querySelector(".choice-btn.selected");
  const first = els.choices.querySelector(".choice-btn");
  (selected || first)?.focus({ preventScroll: true });
}

function currentQuestion() {
  return getQuestion(currentTest.questionIds[currentIndex]);
}

function markShown(question) {
  const now = Date.now();
  stats[question.id] = {
    ...stats[question.id],
    shown: (stats[question.id]?.shown || 0) + 1,
    lastShown: now
  };
  writeJson(STORAGE.stats, stats);
}

function askDifferentQuestion() {
  if (!currentTest) return;
  const currentId = currentTest.questionIds[currentIndex];
  const candidates = replacementCandidates(currentId);
  if (candidates.length === 0) return;

  const nextQuestion = els.focusOldToggle.checked
    ? rankQuestions(candidates)[0].question
    : sample(candidates, 1)[0];

  const questionIds = [...currentTest.questionIds];
  const answers = { ...currentTest.answers };
  const choiceOrders = { ...currentTest.choiceOrders };

  delete answers[currentId];
  delete choiceOrders[currentId];
  questionIds[currentIndex] = nextQuestion.id;
  choiceOrders[nextQuestion.id] = choicesFor(nextQuestion);
  currentTest = {
    ...currentTest,
    questionIds,
    answers,
    choiceOrders
  };

  markShown(nextQuestion);
  render();
  focusCurrentAnswer();
}

function replacementCandidates(currentId) {
  const total = currentTest.questionIds.length;
  const commonNeeded = minimumCommonCount(total);
  const currentCommonCount = currentTest.questionIds
    .filter((id) => id !== currentId)
    .map(getQuestion)
    .filter((question) => question?.common)
    .length;
  const usedIds = new Set(currentTest.questionIds);
  const candidates = QUESTION_BANK.filter((question) => !usedIds.has(question.id));
  const mustChooseCommon = currentCommonCount < commonNeeded;
  return mustChooseCommon ? candidates.filter((question) => question.common) : candidates;
}

function cancelTest() {
  if (!currentTest) return;
  const returnTarget = currentTest.returnTarget;
  currentTest = null;
  currentIndex = 0;
  if (returnTarget?.view) {
    setView(returnTarget.view, { anchor: returnTarget.anchor });
    return;
  }
  setView("dashboard");
}

function finishTest() {
  if (!currentTest || answeredCount() !== currentTest.questionIds.length) return;
  const now = Date.now();
  const items = currentTest.questionIds.map((id, index) => {
    const question = getQuestion(id);
    const userAnswer = currentTest.answers[id];
    const correct = userAnswer === question.correct;
    stats[id] = {
      ...stats[id],
      answered: (stats[id]?.answered || 0) + 1,
      correct: (stats[id]?.correct || 0) + (correct ? 1 : 0),
      lastAnswered: now
    };
    return { index: index + 1, question, userAnswer, correct };
  });
  writeJson(STORAGE.stats, stats);
  const correctCount = items.filter((item) => item.correct).length;
  const percent = Math.round((correctCount / items.length) * 100);
  lastSummary = {
    id: currentTest.id,
    completedAt: now,
    items,
    correctCount,
    percent,
    passed: percent >= PASS_RATE
  };
  testHistory = [
    ...testHistory,
    {
      id: currentTest.id,
      completedAt: now,
      percent,
      correctCount,
      total: items.length
    }
  ].slice(-24);
  writeJson(STORAGE.tests, testHistory);
  currentTest = null;
  currentIndex = 0;
  setView("summary");
}

function answeredCount() {
  return currentTest ? Object.keys(currentTest.answers).length : 0;
}

function toggleBookmark(id) {
  if (bookmarks.has(id)) bookmarks.delete(id);
  else bookmarks.add(id);
  writeJson(STORAGE.bookmarks, [...bookmarks]);
  render();
}

function clearHistory() {
  stats = {};
  testHistory = [];
  writeJson(STORAGE.stats, stats);
  writeJson(STORAGE.tests, testHistory);
  render();
}

function openResetShownDialog() {
  if (typeof els.resetShownDialog.showModal === "function") {
    els.resetShownDialog.showModal();
    return;
  }
  if (window.confirm("Reset progress? This clears shown history, answered scores, category progress, and the success-rate graph. Bookmarks stay saved.")) {
    resetShownHistory();
  }
}

function closeResetShownDialog() {
  if (els.resetShownDialog.open) els.resetShownDialog.close();
}

function resetShownHistory() {
  stats = {};
  testHistory = [];
  lastSummary = null;
  writeJson(STORAGE.stats, stats);
  writeJson(STORAGE.tests, testHistory);
  closeResetShownDialog();
  render();
}

function openClearBookmarksDialog() {
  if (bookmarks.size === 0) return;
  if (typeof els.clearBookmarksDialog.showModal === "function") {
    els.clearBookmarksDialog.showModal();
    return;
  }
  if (window.confirm("Clear all bookmarks? This removes every saved bookmark without changing progress or scores.")) {
    clearAllBookmarks();
  }
}

function closeClearBookmarksDialog() {
  if (els.clearBookmarksDialog.open) els.clearBookmarksDialog.close();
}

function clearAllBookmarks() {
  bookmarks = new Set();
  writeJson(STORAGE.bookmarks, []);
  closeClearBookmarksDialog();
  render();
}

function setView(next, options = {}) {
  view = next;
  render();
  if (options.anchor) {
    scrollToAnchor(options.anchor);
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToAnchor(anchor, options = {}) {
  const scrollToTarget = () => {
    const target = document.getElementById(anchor);
    if (!target) return;
    const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const targetTop = window.scrollY + target.getBoundingClientRect().top - scrollMarginTop;
    animateWindowScroll(targetTop, () => {
      if (options.updateHash && window.history?.pushState) {
        window.history.pushState(null, "", `#${anchor}`);
      }
    });
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(scrollToTarget);
    return;
  }
  scrollToTarget();
}

function animateWindowScroll(targetTop, onComplete) {
  const clampedTop = Math.max(0, Math.round(targetTop));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof requestAnimationFrame !== "function") {
    window.scrollTo(0, clampedTop);
    onComplete?.();
    return;
  }

  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);

  const startTop = window.scrollY;
  const distance = clampedTop - startTop;
  const duration = Math.min(760, Math.max(360, Math.abs(distance) / 18));
  let startedAt = 0;

  const step = (timestamp) => {
    if (!startedAt) startedAt = timestamp;
    const progress = Math.min((timestamp - startedAt) / duration, 1);
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, startTop + distance * eased);
    if (progress < 1) {
      scrollAnimationFrame = requestAnimationFrame(step);
      return;
    }
    scrollAnimationFrame = 0;
    onComplete?.();
  };

  scrollAnimationFrame = requestAnimationFrame(step);
}

function handleStudyAnchorClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  const control = target?.closest("[data-study-anchor]");
  if (!control) return;
  const anchor = control.dataset.studyAnchor;
  if (!anchor || !document.getElementById(anchor)) return;
  event.preventDefault();
  scrollToAnchor(anchor, { updateHash: true });
}

function render() {
  renderTabs();
  renderHeader();
  if (view === "dashboard") renderDashboard();
  if (view === "study") renderStudy();
  if (view === "learn") renderLearn();
  if (view === "setup") renderSetup();
  if (view === "test") renderTest();
  if (view === "summary") renderSummary();
  if (view === "bookmarks") renderBookmarks();
  if (view === "show") renderShow();
}

function renderTabs() {
  document.body.dataset.view = view;
  const panels = ["dashboard", "study", "learn", "setup", "test", "summary", "bookmarks", "show"];
  panels.forEach((name) => {
    els[`${name}View`].hidden = view !== name;
  });
  els.dashboardTab.classList.toggle("active", view === "dashboard");
  els.studyTab.classList.toggle("active", view === "study");
  els.learnTab.classList.toggle("active", view === "learn");
  els.setupTab.classList.toggle("active", view === "setup");
  els.bookmarksTab.classList.toggle("active", view === "bookmarks");
  els.showTab.classList.toggle("active", view === "show");
  renderQuestionsTabIcon();
}

function renderQuestionsTabIcon() {
  els.showTabIcon.innerHTML = `<path d="M5 4h14v16H5V4Zm2 2v3h10V6H7Zm0 5v3h4v-3H7Zm6 0v3h4v-3h-4Zm-6 5v2h4v-2H7Zm6 0v2h4v-2h-4Z"></path>`;
  els.showTab.setAttribute("aria-label", "Questions");
}

function renderHeader() {
  if (view === "test" && currentTest) {
    els.headerMetric.textContent = `${answeredCount()} / ${currentTest.questionIds.length}`;
    els.headerStatus.textContent = "in progress";
  } else if (view === "summary" && lastSummary) {
    els.headerMetric.textContent = `${lastSummary.percent}%`;
    els.headerStatus.textContent = lastSummary.passed ? "passed" : "not passed";
  } else if (view === "bookmarks") {
    els.headerMetric.textContent = `${bookmarks.size} saved`;
    els.headerStatus.textContent = "bookmarks";
  } else if (view === "study") {
    els.headerMetric.textContent = "Start here";
    els.headerStatus.textContent = "study";
  } else if (view === "learn") {
    els.headerMetric.textContent = `${LEARNING_PATH.length} themes`;
    els.headerStatus.textContent = "themes";
  } else if (view === "show") {
    els.headerMetric.textContent = `${QUESTION_BANK.length} questions`;
    els.headerStatus.textContent = "sheet";
  } else {
    els.headerMetric.textContent = `${QUESTION_BANK.length} questions`;
    els.headerStatus.textContent = `${PASS_RATE}% pass`;
  }
}

function renderSetup() {
  const loading = bankSync.status === "loading";
  els.startTestBtn.disabled = loading;
  els.startTestBtn.textContent = loading ? "Refreshing bank..." : "Start test";
  els.setupBankStatus.hidden = !loading;
  els.setupBankStatus.textContent = loading ? bankSync.message : "";
  renderStats(els.bankStats);
}

function renderDashboard() {
  renderStats(els.dashboardStats, true);
  renderSuccessGraph();
}

function renderStudy() {
  renderStudyLayers();
  renderStudyPracticeMap();
  els.studyView.querySelectorAll("[data-study-practice]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    onActivate(button, () => startStudyPractice(button.dataset.studyPractice));
  });
  els.studyPracticeRoot.querySelectorAll("[data-study-card]").forEach((button) => {
    onActivate(button, () => startStudyPractice(button.dataset.studyCard));
  });
  els.studyView.querySelectorAll("[data-study-depth]").forEach((button) => {
    onActivate(button, () => openStudyDepth(button.dataset.studyDepth));
  });
}

function renderLearn() {
  els.learnRoot.innerHTML = LEARNING_PATH.map(learningCard).join("");
  els.learnRoot.querySelectorAll("[data-practice-module]").forEach((button) => {
    onActivate(button, () => startFocusedTest(Number(button.dataset.practiceModule)));
  });
}

function learningCard(module, index) {
  const questions = questionsForCategories(module.categories);
  const commonCount = questions.filter((question) => question.common).length;
  const answered = questions.filter((question) => stats[question.id]?.answered).length;
  return `
    <article id="theme-${index + 1}" class="learning-card">
      <div class="learning-card-main">
        <div class="mini-pack" aria-hidden="true">${miniPack(index + 1)}</div>
        <div>
          <p class="module-level">${escapeHtml(module.level)}</p>
          <h3>${escapeHtml(module.title)}</h3>
          <p>${escapeHtml(module.description)}</p>
          <div class="tag-row">${module.focus.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
        </div>
      </div>
      <div class="learning-card-side">
        <strong>${answered}/${questions.length}</strong>
        <span>answered</span>
        <small>${commonCount} common scenarios</small>
        <button class="ghost-btn" type="button" data-practice-module="${index}">Practice 10</button>
      </div>
    </article>
  `;
}

function renderStudyPracticeMap() {
  els.studyPracticeRoot.innerHTML = STUDY_PRACTICE_CARDS.map(studyPracticeCard).join("");
}

function renderStudyLayers() {
  els.studyView.querySelectorAll("[data-study-layers]").forEach((root) => {
    const layers = STUDY_LAYER_CONTENT[root.dataset.studyLayers] || [];
    root.innerHTML = layers.map(studyLayer).join("");
  });
}

function studyLayer(layer, index) {
  const isOpen = index === 0 ? " open" : "";
  return `
    <details class="study-layer"${isOpen}>
      <summary>
        <span>${escapeHtml(layer.title)}</span>
        <small>${escapeHtml(layer.level)}</small>
      </summary>
      <ul class="study-cascade-list">
        ${layer.items.map(studyLayerItem).join("")}
      </ul>
    </details>
  `;
}

function studyLayerItem(item) {
  const itemClass = item.type ? ` class="study-cascade-item ${escapeHtml(item.type)}"` : "";
  return `
    <li${itemClass}>
      <span>${studyTextWithTerms(item)}</span>
      ${item.popup ? studyDepthButton(item.popup) : ""}
      ${item.children?.length ? `<ul>${item.children.map(studyLayerItem).join("")}</ul>` : ""}
    </li>
  `;
}

function studyTextWithTerms(item) {
  if (!item.terms?.length) return escapeHtml(item.text);

  let remaining = item.text;
  let html = "";

  item.terms.forEach((term) => {
    const index = remaining.indexOf(term.text);
    if (index === -1) return;
    html += escapeHtml(remaining.slice(0, index));
    html += studyInlineDepthButton(term);
    remaining = remaining.slice(index + term.text.length);
  });

  return html + escapeHtml(remaining);
}

function studyInlineDepthButton(term) {
  const detail = STUDY_DEEP_DIVES[term.popup];
  const label = term.label || term.text;
  const title = detail?.title || label;
  return `<button class="study-inline-depth" type="button" data-study-depth="${escapeHtml(term.popup)}" aria-label="${escapeHtml(`Define ${title}`)}">${escapeHtml(label)}</button>`;
}

function studyDepthButton(id) {
  const detail = STUDY_DEEP_DIVES[id];
  const title = detail?.title || "deep dive";
  const isOfficial = detail?.level?.toLowerCase().includes("official");
  const label = !isOfficial && title.length <= 30 ? title : isOfficial ? "Official lens" : "Deep dive";
  const ariaLabel = label === title ? title : `${label}: ${title}`;
  return `<button class="study-depth-link" type="button" data-study-depth="${escapeHtml(id)}" aria-label="${escapeHtml(ariaLabel)}">${escapeHtml(label)}</button>`;
}

function openStudyDepth(id) {
  const detail = STUDY_DEEP_DIVES[id];
  if (!detail) return;
  els.studyDepthLevel.textContent = detail.level;
  els.studyDepthTitle.textContent = detail.title;
  els.studyDepthBody.innerHTML = detail.body.map(studyDepthSection).join("");
  els.studyDepthLinks.innerHTML = (detail.links || [])
    .map((link) => `<a class="external-link" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${link.label}, opens external site`)}">${escapeHtml(link.label)}</a>`)
    .join("");
  if (typeof els.studyDepthDialog.showModal === "function") {
    els.studyDepthDialog.showModal();
    return;
  }
  els.studyDepthDialog.setAttribute("open", "");
}

function studyDepthSection(section) {
  if (typeof section === "string") {
    return `<p>${escapeHtml(section)}</p>`;
  }

  const paragraphs = section.paragraphs || (section.text ? [section.text] : []);
  const heading = section.heading ? `<h3>${escapeHtml(section.heading)}</h3>` : "";
  const body = paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const list = section.list?.length
    ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  const note = section.note ? `<p class="study-depth-note">${escapeHtml(section.note)}</p>` : "";

  return `<section class="study-depth-section">${heading}${body}${list}${note}</section>`;
}

function closeStudyDepth() {
  if (typeof els.studyDepthDialog.close === "function") {
    els.studyDepthDialog.close();
    return;
  }
  els.studyDepthDialog.removeAttribute("open");
}

function closeStudyDepthFromBackdrop(event) {
  if (event.target !== els.studyDepthDialog) return;
  closeStudyDepth();
}

function studyPracticeCard(card) {
  const pool = questionsForStudyPractice(card.key);
  const answered = pool.filter((question) => stats[question.id]?.answered).length;
  const percent = pool.length ? Math.round((answered / pool.length) * 100) : 0;
  return `
    <article class="study-card">
      <div>
        <span class="study-card-count">${answered}/${pool.length}</span>
        <h4>${escapeHtml(card.title)}</h4>
        <p>${escapeHtml(card.description)}</p>
      </div>
      <div class="study-progress" aria-label="${escapeHtml(card.title)} progress">
        <span style="width: ${percent}%"></span>
      </div>
      <button class="ghost-btn compact-btn" type="button" data-study-card="${escapeHtml(card.key)}" aria-label="${escapeHtml(`Start 10-question ${card.title} practice set`)}">Start 10-question set</button>
    </article>
  `;
}

function miniPack(count) {
  const spacing = 13;
  const start = 60 - ((count - 1) * spacing) / 2;
  return `
    <svg viewBox="0 0 120 56" role="img">
      <path class="mini-track" d="M28 10h64a18 18 0 0 1 0 36H28a18 18 0 0 1 0-36Z"></path>
      <path class="mini-line" d="M31 28h58"></path>
      ${Array.from({ length: count }, (_, index) => `<circle class="team-dot white" cx="${start + index * spacing}" cy="28" r="5"></circle>`).join("")}
    </svg>
  `;
}

function questionsForStudyPractice(groupKey) {
  const categories = STUDY_PRACTICE_GROUPS[groupKey];
  if (!categories) return [];
  return groupKey === "common"
    ? QUESTION_BANK.filter((question) => question.common)
    : questionsForCategories(categories);
}

function questionsForCategories(categories) {
  const moduleTitle = LEARNING_PATH.find((module) => module.categories === categories)?.title;
  return QUESTION_BANK.filter((question) => (
    categories.includes(question.category) || question.studyTheme === moduleTitle
  ));
}

function renderStats(root, compact = false) {
  const shown = QUESTION_BANK.filter((question) => stats[question.id]?.shown).length;
  const answered = QUESTION_BANK.filter((question) => stats[question.id]?.answered).length;
  const labels = compact
    ? ["Bank", "Shown", "Answered", "Bookmarked"]
    : ["questions in bank", "shown at least once", "answered at least once", "bookmarked"];
  root.innerHTML = [
    statTile(QUESTION_BANK.length, labels[0]),
    statTile(shown, labels[1]),
    statTile(answered, labels[2]),
    statTile(bookmarks.size, labels[3])
  ].join("");
}

function statTile(value, label) {
  return `<div class="stat-tile"><strong>${value}</strong><span>${label}</span></div>`;
}

function answerTotals() {
  return Object.values(stats).reduce((totals, item) => {
    totals.answered += item.answered || 0;
    totals.correct += item.correct || 0;
    return totals;
  }, { answered: 0, correct: 0 });
}

function renderSuccessGraph() {
  const totals = answerTotals();
  const overall = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : null;
  const series = testHistory.length > 0
    ? testHistory.map((item) => ({ value: item.percent, label: formatAttemptLabel(item.completedAt) }))
    : overall !== null
      ? [{ value: overall, label: "All" }]
      : [];

  els.dashboardSuccessRate.textContent = overall === null ? "--" : `${overall}%`;

  if (series.length === 0) {
    els.dashboardGraph.innerHTML = `
      <div class="graph-empty">
        <span class="graph-zero">0%</span>
        <span class="graph-pass">80% pass line</span>
      </div>
    `;
    els.dashboardGraphNote.textContent = "Complete a test to start tracking results.";
    return;
  }

  const width = Math.max(720, series.length * 112);
  const height = 190;
  const pad = 24;
  const usableWidth = width - pad * 2;
  const usableHeight = height - pad * 2;
  const points = series.map((item, index) => {
    const x = pad + (series.length === 1 ? usableWidth / 2 : (usableWidth / (series.length - 1)) * index);
    const y = pad + ((100 - item.value) / 100) * usableHeight;
    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const areaPath = points.length > 1
    ? `${linePath} L ${points.at(-1).x.toFixed(1)} ${height - pad} L ${points[0].x.toFixed(1)} ${height - pad} Z`
    : "";
  const passY = pad + ((100 - PASS_RATE) / 100) * usableHeight;

  els.dashboardGraph.innerHTML = `
    <div class="graph-frame line-frame" style="--graph-width:${width}px">
      <svg class="line-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Questionnaire success rate">
        <line class="pass-line-svg" x1="${pad}" x2="${width - pad}" y1="${passY.toFixed(1)}" y2="${passY.toFixed(1)}"></line>
        <text class="pass-label-svg" x="${width - pad}" y="${Math.max(12, passY - 6).toFixed(1)}" text-anchor="end">${PASS_RATE}%</text>
        ${areaPath ? `<path class="success-area" d="${areaPath}"></path>` : ""}
        <path class="success-line" d="${linePath}"></path>
        ${points.map((point) => `<circle class="success-point" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.2"><title>${escapeHtml(point.label)}: ${point.value}%</title></circle>`).join("")}
      </svg>
      <div class="graph-labels">
        ${points.map((point) => `<span>${escapeHtml(point.label)}</span>`).join("")}
      </div>
    </div>
  `;
  els.dashboardGraphNote.textContent = testHistory.length > 0
    ? `Showing ${testHistory.length} completed ${testHistory.length === 1 ? "test" : "tests"}.`
    : `${totals.correct} of ${totals.answered} answered questions correct.`;
}

function formatAttemptLabel(timestamp) {
  if (!timestamp) return "Attempt";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function formatDateTime(timestamp) {
  if (!timestamp) return "never";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(timestamp));
}

function questionCaseHref(question) {
  return question.caseUrl || `${CASE_ROOT}${question.caseAnchor}`;
}

function questionRuleHref(question) {
  return question.ruleUrl || `${RULE_ROOT}${question.ruleAnchor}`;
}

function renderTest() {
  if (!currentTest) return;
  const question = currentQuestion();
  const answer = currentTest.answers[question.id];
  const total = currentTest.questionIds.length;
  els.questionCount.textContent = `Question ${currentIndex + 1} of ${total}`;
  els.progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
  els.sectionBadge.textContent = question.section;
  els.caseBadge.textContent = `${question.caseId} / ${question.kind}`;
  els.scenarioText.textContent = question.scenario;
  els.questionText.textContent = question.prompt;
  els.caseLink.href = questionCaseHref(question);
  els.caseLink.textContent = question.caseId;
  els.caseLink.setAttribute("aria-label", `${question.caseId}, opens external site`);
  els.ruleLink.href = questionRuleHref(question);
  els.ruleLink.textContent = question.rule;
  els.ruleLink.setAttribute("aria-label", `${question.rule}, opens external site`);
  const currentBookmarked = bookmarks.has(question.id);
  els.bookmarkCurrentBtn.innerHTML = bookmarkIcon(currentBookmarked);
  els.bookmarkCurrentBtn.setAttribute("aria-label", currentBookmarked ? "Remove bookmark" : "Bookmark question");
  els.bookmarkCurrentBtn.title = currentBookmarked ? "Remove bookmark" : "Bookmark question";
  els.bookmarkCurrentBtn.classList.toggle("active", currentBookmarked);
  els.choices.innerHTML = "";
  currentTest.choiceOrders[question.id].forEach((choice) => {
    const option = document.createElement("article");
    option.className = "answer-option";
    option.classList.toggle("selected", answer === choice);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = choice;
    button.classList.toggle("selected", answer === choice);
    button.setAttribute("aria-pressed", answer === choice ? "true" : "false");
    button.addEventListener("click", () => answerCurrent(choice));
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      answerCurrent(choice);
    });
    option.append(button);

    els.choices.append(option);
  });
  els.prevBtn.disabled = currentIndex === 0;
  els.differentQuestionBtn.disabled = replacementCandidates(question.id).length === 0;
  const isLastQuestion = currentIndex === total - 1;
  const canMoveNext = Boolean(answer);
  els.nextBtn.classList.toggle("icon-btn", !isLastQuestion);
  els.nextBtn.classList.toggle("submit-btn", isLastQuestion);
  els.nextBtn.classList.toggle("ready", canMoveNext);
  els.nextBtn.textContent = isLastQuestion ? "Submit test" : "›";
  els.nextBtn.setAttribute("aria-label", isLastQuestion ? "Submit test" : "Next question");
  els.nextBtn.title = isLastQuestion ? "Submit test" : "Next question";
  els.nextBtn.disabled = isLastQuestion ? answeredCount() !== total : !canMoveNext;
}

function categoryStats(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item.question.category;
    const current = map.get(key) || { category: key, correct: 0, total: 0 };
    current.total += 1;
    current.correct += item.correct ? 1 : 0;
    map.set(key, current);
  });
  return [...map.values()].sort((a, b) => a.category.localeCompare(b.category));
}

function renderSummary() {
  if (!lastSummary) {
    els.summaryRoot.innerHTML = `<p class="empty-state">Take a test to see a full summary here.</p>`;
    return;
  }
  const resultClass = lastSummary.passed ? "pass" : "fail";
  const categoryHtml = categoryStats(lastSummary.items).map((stat) => {
    const pct = Math.round((stat.correct / stat.total) * 100);
    return `<div class="category-stat"><strong>${stat.category}</strong><span>${stat.correct}/${stat.total} correct (${pct}%)</span></div>`;
  }).join("");
  els.summaryRoot.innerHTML = `
    <div class="summary-hero">
      <div class="result-card ${resultClass}">
        <h2>${lastSummary.passed ? "Passed" : "Not passed"}: ${lastSummary.percent}%</h2>
        <p>${lastSummary.correctCount} of ${lastSummary.items.length} correct. Passing requires ${PASS_RATE}%.</p>
      </div>
      <div class="category-grid">${categoryHtml}</div>
    </div>
    <div class="summary-actions">
      <button class="primary-btn" type="button" data-action="new-test">New test</button>
      <button class="ghost-btn" type="button" data-action="bookmarks">Bookmarks</button>
    </div>
    <div class="question-list">${lastSummary.items.map(summaryCard).join("")}</div>
  `;
  onActivate(els.summaryRoot.querySelector("[data-action='new-test']"), () => setView("setup"));
  onActivate(els.summaryRoot.querySelector("[data-action='bookmarks']"), () => setView("bookmarks"));
  els.summaryRoot.querySelectorAll("[data-bookmark]").forEach((button) => {
    onActivate(button, () => toggleBookmark(button.dataset.bookmark));
  });
}

function summaryCard(item) {
  const { question } = item;
  const result = item.correct ? "correct" : "incorrect";
  return `
    <article class="question-card ${result}">
      <div class="question-card-head">
        <h3>${item.index}. ${escapeHtml(question.prompt)}</h3>
        ${bookmarkButton(question.id)}
      </div>
      ${questionScenarioBlock(question)}
      ${tagRow(question)}
      <div class="answer-line user ${item.correct ? "good" : "bad"}"><strong>Your answer</strong><span>${escapeHtml(item.userAnswer)}</span></div>
      <div class="answer-line"><strong>Correct</strong><span>${escapeHtml(question.correct)}</span></div>
      <details class="summary-rationale">
        <summary>Rationale</summary>
        <p>${escapeHtml(question.teachingNote)}</p>
      </details>
      <div class="source-row compact">${questionSourceLinks(question)}</div>
    </article>
  `;
}

function renderBookmarks() {
  const saved = [...bookmarks].map(getQuestion).filter(Boolean);
  els.bookmarkCount.textContent = `${saved.length} saved`;
  els.clearBookmarksBtn.disabled = saved.length === 0;
  els.bookmarkTestBtn.disabled = saved.length === 0;
  if (saved.length === 0) {
    els.bookmarksRoot.innerHTML = `
      <div class="empty-state bookmark-empty">
        <span class="empty-bookmark-icon">${bookmarkIcon(false)}</span>
        <p>No bookmarked questions yet. Use the bookmark icon during a test or from the summary page.</p>
      </div>
    `;
    return;
  }
  els.bookmarksRoot.innerHTML = `<div class="question-list">${saved.map(bookmarkCard).join("")}</div>`;
  els.bookmarksRoot.querySelectorAll("[data-bookmark]").forEach((button) => {
    onActivate(button, () => toggleBookmark(button.dataset.bookmark));
  });
}

function bookmarkCard(question) {
  return `
    <article class="question-card">
      <div class="question-card-head">
        <h3>${escapeHtml(question.prompt)}</h3>
        ${bookmarkButton(question.id)}
      </div>
      ${questionScenarioBlock(question)}
      ${tagRow(question)}
      <details class="summary-rationale bookmark-answer">
        <summary>Answer and rationale</summary>
        <div class="answer-line"><strong>Correct</strong><span>${escapeHtml(question.correct)}</span></div>
        <p>${escapeHtml(question.teachingNote)}</p>
      </details>
      <div class="source-row compact">${questionSourceLinks(question)}</div>
    </article>
  `;
}

function officialCase(id) {
  return (window.OFFICIAL_CASES || []).find((item) => item.id === id);
}

function renderShow() {
  if (!els.showView || view !== "show") return;
  const loading = bankSync.status === "loading";
  els.refreshBankBtn.disabled = loading;
  els.refreshBankBtn.querySelector("span").textContent = loading ? "Refreshing..." : "Refresh question bank";
  els.bankSyncStatus.textContent = bankSync.message || "The site checks the published Sheet at most once per browser session. Mobile browsers only auto-check when the saved bank is older than 6 months.";
  els.bankSyncStatus.classList.toggle("is-error", bankSync.status === "error");
}

function ensureOriginalSnapshots() {
  const stored = readJson(STORAGE.originals, {});
  let changed = false;
  (window.OFFICIAL_CASES || []).forEach((item) => {
    if (stored[item.id]) return;
    stored[item.id] = originalFromOfficial(item);
    changed = true;
  });
  if (changed) writeJson(STORAGE.originals, stored);
  return stored;
}

function originalFromOfficial(item) {
  return {
    scenario: item.scenario,
    context: defaultContextNote(item),
    prompt: defaultQuestionPrompt(item),
    correct: item.outcome,
    teachingNote: defaultTeachingNote(item)
  };
}

function originalSnapshot(id) {
  const official = officialCase(id);
  if (official && (!originalSnapshots[id] || !originalSnapshots[id].scenario || !originalSnapshots[id].context)) {
    originalSnapshots[id] = originalFromOfficial(official);
    writeJson(STORAGE.originals, originalSnapshots);
  }
  return originalSnapshots[id] || {
    scenario: "",
    context: "",
    prompt: "",
    correct: "",
    teachingNote: "The original version is unavailable."
  };
}


function bookmarkButton(id) {
  const active = bookmarks.has(id);
  return `<button class="bookmark-btn ${active ? "active" : ""}" type="button" data-bookmark="${id}" aria-label="${active ? "Remove bookmark" : "Bookmark question"}" title="${active ? "Remove bookmark" : "Bookmark question"}">${bookmarkIcon(active)}</button>`;
}

function questionScenarioBlock(question) {
  return `
    <div class="card-scenario">
      <strong>Scenario</strong>
      <p>${escapeHtml(question.scenario)}</p>
      ${question.context ? `<small>${escapeHtml(question.context)}</small>` : ""}
    </div>
  `;
}

function questionSourceLinks(question) {
  return [
    externalSourceLink(questionCaseHref(question), question.caseId),
    externalSourceLink(questionRuleHref(question), question.rule)
  ].join("");
}

function externalSourceLink(href, label) {
  return `<a class="external-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${label}, opens external site`)}">${escapeHtml(label)}</a>`;
}

function bookmarkIcon(active) {
  return `
    <svg class="bookmark-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5h10v15l-5-3.3-5 3.3v-15Z"></path>
      ${active ? "" : `<path class="bookmark-cut" d="M9 6.8h6v8.2l-3-1.9-3 1.9V6.8Z"></path>`}
    </svg>
  `;
}

function tagRow(question) {
  const tags = [question.category, ...question.tags];
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function onActivate(element, handler) {
  element.addEventListener("click", handler);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handler(event);
  });
}

onActivate(els.dashboardTab, () => setView("dashboard"));
onActivate(els.bookmarksTab, () => setView("bookmarks"));
onActivate(els.studyTab, () => setView("study"));
onActivate(els.learnTab, () => setView("learn"));
onActivate(els.setupTab, () => setView("setup"));
onActivate(els.allThemesTestBtn, openNewTestSetup);
onActivate(els.showTab, () => setView("show"));
onActivate(els.resetShownBtn, openResetShownDialog);
onActivate(els.cancelResetShownBtn, closeResetShownDialog);
onActivate(els.confirmResetShownBtn, resetShownHistory);
onActivate(els.bookmarkTestBtn, startBookmarkedTest);
onActivate(els.clearBookmarksBtn, openClearBookmarksDialog);
onActivate(els.cancelClearBookmarksBtn, closeClearBookmarksDialog);
onActivate(els.confirmClearBookmarksBtn, clearAllBookmarks);
onActivate(els.closeStudyDepthBtn, closeStudyDepth);
els.studyDepthDialog.addEventListener("click", closeStudyDepthFromBackdrop);
els.studyView.addEventListener("click", handleStudyAnchorClick, { capture: true });
onActivate(els.refreshBankBtn, () => refreshQuestionBank({ force: true }));
onActivate(els.startTestBtn, startTest);
onActivate(els.clearHistoryBtn, clearHistory);
onActivate(els.bookmarkCurrentBtn, () => currentTest && toggleBookmark(currentQuestion().id));
onActivate(els.cancelTestBtn, cancelTest);
onActivate(els.differentQuestionBtn, askDifferentQuestion);
onActivate(els.prevBtn, () => {
  currentIndex = Math.max(0, currentIndex - 1);
  render();
  focusCurrentAnswer();
});
onActivate(els.nextBtn, () => {
  if (els.nextBtn.disabled) return;
  if (currentIndex === currentTest.questionIds.length - 1) {
    finishTest();
    return;
  }
  currentIndex += 1;
  render();
  focusCurrentAnswer();
});

if (QUESTION_BANK.length !== 150) {
  console.warn(`Expected 150 questions, found ${QUESTION_BANK.length}`);
}

hydrateCachedQuestionBank();
render();
refreshQuestionBank();
