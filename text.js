/*
 * ============================================================================
 *  HOPE STARTS SMALL — ALL OF THE GAME'S WRITING, IN ONE FILE
 * ============================================================================
 *
 *  Every line of dialogue, narration, commentary, trial text, chapter card,
 *  register page and tasting note in the game lives HERE, not in the code.
 *  The game (game.js) looks each line up by its key when it needs it.
 *
 *  HOW TO EDIT
 *  -----------
 *  1. Find the line you want to change. Lines are grouped by place and
 *     chapter, in story order. The comment above each entry says where in
 *     the story it appears.
 *  2. Change the words between the double quotes. That is the whole edit.
 *  3. Commit and push this file. The live game picks your words up on a
 *     normal page refresh (GitHub Pages caches files for a few minutes) —
 *     no code change, no new build, nothing else to touch.
 *
 *  WHAT NOT TO BREAK
 *  -----------------
 *  - Do not rename or delete a KEY (the word before the colon, like
 *    `theBarnDoor`). The game asks for lines by key; a missing key means a
 *    missing line.
 *  - Keep the double quotes around each line. If your line needs a double
 *    quote inside it, write it as \" so the file stays valid.
 *  - Keep commas and brackets where they are. A list in [ ... ] is several
 *    lines shown one after another — keep one quoted line per row.
 *  - Some lines contain {placeholders} like {name} or {rn}. The game fills
 *    those in with live values (a plant's name, a row number). Keep the
 *    braces and the word inside them exactly as they are; write around them.
 *  - A few entries are also stored inside saved games (the wine verdicts —
 *    TART, LOVELY and friends — and the causes of death). Editing those is
 *    safe for new games; very old saves may describe a past wine with the
 *    old word, which is only fair.
 *  - Speaker tags: a line that begins FRANK: / CONSTANCE: / PASTOR: puts the
 *    name in a tag on the dialogue box. The tag is part of the line here —
 *    keep the prefix if you keep the speaker.
 *
 *  If the game ever loads with a blank screen after an edit here, a quote or
 *  comma above is the likely culprit — undo the last edit and try again.
 * ============================================================================
 */

const TEXT = {

  // ======================================================================
  // AREA NAMES — shown at the top of the screen when you walk in
  // ======================================================================
  areas: {
    // game.js line 3757
    deerbrook: "DEERBROOK",
    // game.js line 3758
    theHouse: "THE HOUSE",
    // game.js line 3759
    berryhill: "BERRYHILL",
    // game.js line 3760
    theBarnUpstairs: "THE BARN — UPSTAIRS",
    // game.js line 3761
    theDownstairs: "THE DOWNSTAIRS",
    // game.js line 3762
    theGreenhouse: "THE GREENHOUSE",
  },

  // ======================================================================
  // MORNINGS IN DEERBROOK — the first line of a new day, chapter 1
  // ======================================================================
  dawn: {
    // game.js line 6020
    aNewDayThe: [
      "A NEW DAY. THE POTS ARE RIGHT WHERE YOU LEFT THEM. THAT IS THE DEAL.",
      "FRANK WAS UP BEFORE THE SUN. THE POTS HAVE ALREADY HEARD THE SPEECH.",
      "THE YARD IS QUIET. SOMEWHERE, A SEED IS MAKING UP ITS MIND.",
      "ALVIN DID HIS ROUNDS BEFORE YOU WERE EVEN AWAKE.",
    ],
    // game.js line 6026
    alvinStaredAtThe: [
      "ALVIN STARED AT THE FENCE A LONG TIME THIS MORNING.",
      "TRACKS BY THE FENCE AGAIN. THE NEIGHBORHOOD DEER FEAR NOTHING AND NO ONE.",
      "ALVIN STARED AT THE FENCE A LONG TIME THIS MORNING.",
    ],
    // game.js line 6387
    springTheYearTurns: [
      "SPRING. THE YEAR TURNS ITS FACE BACK TO THE SUN.",
      "SUMMER. EVERYTHING GROWS LIKE IT MEANS IT.",
      "FALL. THE LIGHT GOES GOLD AND HONEST.",
      "WINTER. THE GARDEN SLEEPS UNDER ITS BREATH.",
    ],
    // game.js line 6433 · dawn
    inTheNightQuietly: "IN THE NIGHT, QUIETLY: {joinVal}. THE REGISTER TURNS A PAGE.",
    // game.js line 6434 · dawn
    vIsFailingWater: "{v} IS FAILING. WATER, OR GOOD DIRT — TODAY.",
    // game.js line 6436 · dawn
    rainInTheNight: "RAIN IN THE NIGHT. EVERYTHING OUTDOORS DRANK ITS FILL.",
    // game.js line 6440 · dawn
    somethingSproutedButAlvin: "SOMETHING SPROUTED! BUT ALVIN IS BARKING AT THE FENCE... A DEER IS IN THE YARD!",
    // game.js line 6441 · dawn
    twoSmallLeavesIn: "TWO SMALL LEAVES IN THE NIGHT! COME AND SEE!",
    // game.js line 6442 · dawn
    aSproutBecameA: "A SPROUT BECAME A SEEDLING OVERNIGHT. LEAVES AND EVERYTHING.",
    // REVISION (Nov 27, 2026) — dawn lines for collective losses: counted,
    // not named, and never silent.
    companyLost: "IN THE NIGHT, QUIETLY, THE COMPANY LOST {n}. THEY ARE COUNTED, IF NOT NAMED — AND THEY COUNT.",
    rowFailing: "ROW {rn} IS FAILING — WATER, OR IT PAYS IN BUSHES.",
    companyFailing: "THE COMPANY IS FAILING — WATER, AND TIME, AND SOON.",
    nurseryFailing: "THE NURSERY IS FAILING — WATER, AND SOON.",
    companySlipped: "THE COMPANY SLIPPED IN THE HEAT.",
    nurseryShorn: "AND IN THE NURSERY, ONE OF THE STOCK IS SHORN CLEAN TO A STUB. NO NAME. A NUMBER, GONE.",
    stockLost: "IN THE NIGHT, QUIETLY, THE NURSERY LOST {n}. COUNTED, IF NOT NAMED — AND THEY COUNT.",
    shornAgainNursery: "SHORN AGAIN — THE NURSERY STOCK, THIS TIME. IT WILL COME AGAIN.",
    rowLostBush: "ROW {rn} LOST A BUSH TO {cause}. IT IS WRITTEN IN THE ROW'S OWN PAGE.",
    gardenGoneLine: "{name} IS GONE. IT IS WRITTEN ON THE GARDEN PAGE, PLAINLY, THE WAY GARDENS KEEP THEIR NEWS.",
    aDrySpell: "A DRY SPELL",
    theWeeds: "THE WEEDS",
    theLateFrostRow: "THE LATE FROST",
  },

  // ======================================================================
  // TALKING TO PEOPLE — Constance, the neighbours, everyone with a voice
  // ======================================================================
  talk: {
    // game.js line 3917 · npcTalk
    constanceTheHouseIs: [
      "CONSTANCE: THE HOUSE IS MOSTLY BOXES AND OPINIONS NOW. THE PLANTS HAVE THE BEST ROOM. THIS SEEMS FAIR.",
      "CONSTANCE: WATER THE SHELF, FRANK. THE SMALL ONES CANNOT ASK, SO I AM ASKING FOR THEM.",
      "CONSTANCE: LAND FIRST. HOUSE SECOND. GOATS — WE WILL DISCUSS THE GOATS NEVER.",
    ],
    // game.js line 3937 · npcTalk
    jeremiahIHelpWith: [
      "JEREMIAH: I HELP WITH THE PLANTS. I DO NOT EAT THE PLANTS. THESE ARE SEPARATE DEPARTMENTS.",
      "JEREMIAH: WHEN THERE IS A FIELD, I WILL HELP DIG. DIGGING IS JUST CARRYING, DOWNWARD.",
      "JEREMIAH: THE SPROUTS HAVE NAMES. THE CAR DOES NOT. PRIORITIES.",
    ],
    // game.js line 3945 · npcTalk
    zoeyIHaveRanked: [
      "ZOEY: I HAVE RANKED THE SPROUTS BY LIKELIHOOD OF GREATNESS. THE RANKINGS ARE CONFIDENTIAL.",
      "ZOEY: IF THE NEW HOUSE DOES NOT HAVE A GOOD WINDOW, WE RIOT. POLITELY. WITH SIGNS.",
      "ZOEY: I WATERED THE ONES ON THE END. THEY LOOKED THIRSTY AND ALSO BRAVE.",
    ],
    // game.js line 3953 · npcTalk
    lilySupervisesFromThe: [
      "LILY SUPERVISES FROM THE STROLLER. HER STANDARDS ARE HIGH AND HER NAP IS NON-NEGOTIABLE.",
      "LILY HAS BEEN GIVEN A LEAF TO HOLD. SHE HOLDS IT LIKE A SCEPTRE.",
    ],
    // game.js line 3967 · npcTalk
    aVolunteerTomatoAll: [
      "A VOLUNTEER TOMATO, ALL LEGS AND HOPE.",
      "A WEED WITH A FLOWER IT HAS NOT EARNED.",
      "A STRAWBERRY RUNNER, FAR FROM HOME.",
      "A WEED PRETENDING, POORLY, TO BE A HERB.",
      "A GOOD CLUMP OF SOMETHING USEFUL.",
      "A WEED WITH SEEDS LIKE SMALL PLANS.",
      "A YOUNG IRIS, LOST AND UNBOTHERED.",
      "A WEED THAT SMELLS LIKE A LIE.",
      "A BERRY CANE, ESCAPED AND PROUD.",
    ],
    // game.js line 4006 · npcTalk
    omaYourOpaKept: [
      "OMA: YOUR OPA KEPT A GARDEN THE SIZE OF A RUG AND FED A STREET FROM IT. DO NOT ASK ME HOW. HE WOULD NOT SAY, AND NOW IT IS A FAMILY SECRET I AM KEEPING FROM MYSELF.",
      "OMA: HE TALKED TO HIS TOMATOES. I TALKED TO HIM. THE HOUSE WAS FULL OF CONVERSATION AND MOST OF IT WAS ONE-WAY.",
    ],
    // game.js line 4007 · npcTalk
    omaWhenTheAdmiral: [
      "OMA: WHEN THE ADMIRAL SPROUTED, I DREAMED OF YOUR OPA. HE WAS YOUNG AND ANNOYED AT A FENCE. SOME THINGS ABOUT A MAN NEVER CHANGE, EVEN IN DREAMS. ESPECIALLY IN DREAMS.",
      "OMA: HE WOULD HAVE LIKED YOUR FIELD, FRANK. HE WOULD HAVE SAID SO ONCE, AND THEN FIXED THINGS ON IT FOR A DECADE TO PROVE IT.",
    ],
    // game.js line 4008 · npcTalk
    omaAskMeAbout: [
      "OMA: ASK ME ABOUT THE SIX. GO ON. — THE ADMIRAL, THE CAPTAIN, THE GENERAL. HOPE. PATIENCE. THE PROFESSOR.",
      "OMA: I KNOW ALL THEIR NAMES. AN OLD WOMAN MEMORIZES WHAT THE HOUSE LOVES. IT IS THE WHOLE JOB, AND I AM GOOD AT IT.",
    ],
    // game.js line 6031
    constanceSixPotsAnd: [
      "CONSTANCE: SIX POTS AND NO FIELD. WE HAVE DONE MORE WITH LESS, LOVE.",
      "CONSTANCE: THE FRIDGE SEEDS ARE NAPPING. FRANK TUCKED THEM IN. TUCKED. THEM. IN.",
      "CONSTANCE: HE TALKS TO THE POTS EVERY MORNING. THE POTS, TO THEIR CREDIT, LISTEN BEAUTIFULLY.",
      "CONSTANCE: THERE ARE WHOLE BOOKS ON GROWING THESE, FRANK. HE PREFERS TO LEARN WITH HIS HANDS.",
      "CONSTANCE: A GARDEN IS A GLORIOUS THING, AND IT IS WORK. I KEEP TELLING HIM. HE KEEPS SMILING.",
    ],
    // game.js line 3915 · npcTalk
    constanceAPastorA: [
      "CONSTANCE: A PASTOR, A TABLE, AND YOUR WINE, FRANK. NO PRESSURE AT ALL.",
      "CONSTANCE: POUR IT LIKE YOU MEAN IT. YOU DO EVERYTHING ELSE THAT WAY.",
    ],
    // game.js line 3927 · npcTalk
    jeremiahICanCarry: [
      "JEREMIAH: I CAN CARRY THE PEAT PELLETS. I AM BASICALLY A FORKLIFT.",
      "HE CARRIES THEM LIKE THEY ARE MADE OF GLASS AND DYNAMITE. NOTHING BREAKS.",
      "JEREMIAH: FOR THE RECORD — I STILL DO NOT LIKE BLUEBERRIES.",
      "FRANK: NOTED IN THE REGISTER. UNDER \"HONEST MEN\".",
    ],
    // game.js line 3932 · npcTalk
    jeremiahIsAroundAsk: "JEREMIAH IS AROUND. ASK HIM TO WATER SOMETHING?",
    // game.js line 3934 · npcTalk
    askHim: [
      "ASK HIM",
      "NOT NOW",
    ],
    // game.js line 3933 · npcTalk
    jeremiahWatersNameCarefully: "JEREMIAH WATERS {name}. CAREFULLY. LIKE IT OWES HIM NOTHING AND HE INTENDS TO KEEP IT THAT WAY.",
    // game.js line 3964 · npcTalk
    theTenthPlantShe: [
      "THE TENTH PLANT. SHE LOOKS AT IT A LONG TIME — A THISTLE, PROUD AS A FLAG, BY THE FENCE.",
      "MOM: THAT ONE STAYS. EVERY GARDEN KEEPS ONE THING IT DID NOT PLANT, TO REMIND IT WHO WAS HERE FIRST. YOU WILL KNOW WHEN IT IS TIME. THEY ALWAYS TELL YOU.",
      "SHE LEAVES BEFORE LUNCH, WITH BERRIES, AND THE DRIVEWAY IS A BETTER PLACE THAN SHE FOUND IT. IT USUALLY IS, WHERE SHE HAS BEEN.",
      "FRANK, WATCHING THE THISTLE STAND: THE SORTING IS NOT MY JOB, MOM. SOME THINGS JUST GROW SIDE BY SIDE UNTIL THE LORD'S HARVEST COMES, AND I WILL NOT BE THE ONE RUNNING THAT. I AM LEARNING TO LEAVE THAT ONE ALONE.",
    ],
    // game.js line 3968 · npcTalk
    plantNOf10: "PLANT {n} OF 10: {v} — MOM: KEEP OR PULL, FRANK? (SHE WILL FORGIVE EITHER ANSWER. THE PLANTS ARE A LESSON; THE LESSON IS THE POINT.)",
    // game.js line 3970 · npcTalk
    keepIt: [
      "KEEP IT",
      "PULL IT",
    ],
    // game.js line 3969 · npcTalk
    momKeptGoodHalf: "MOM: KEPT. GOOD. HALF OF GARDENING IS DECIDING WHAT GETS TO STAY, AND SAYING IT LIKE YOU MEAN IT.",
    // game.js line 3969 · npcTalk
    momPulledGoodThe: "MOM: PULLED. GOOD. THE OTHER HALF IS PULLING WITHOUT APOLOGIZING TO THE WEED.",
    // game.js line 3972 · npcTalk
    momTheFieldLooks: [
      "MOM: THE FIELD LOOKS LIKE A FIELD, FRANK. YOUR FATHER WOULD HAVE SAID IT IS TOO TIDY AND THEN QUIETLY FIXED THREE THINGS.",
      "MOM: EAT SOMETHING. THAT IS THE WHOLE SERMON. EAT SOMETHING.",
    ],
    // game.js line 3975 · npcTalk
    omaIBroughtMy: [
      "OMA: I BROUGHT MY OWN TEA. YOURS IS FINE. MINE IS BETTER. THIS IS NOT A COMPETITION, BUT IF IT WERE —",
      "OMA: SHOW ME THE SPROUTS AGAIN. SLOWLY. I AM MEMORIZING THEM.",
    ],
    // game.js line 3977 · npcTalk
    omaFrankSitNo: [
      "OMA: FRANK. SIT. NO — STAND THERE, THE LIGHT IS BETTER AND I WANT TO SEE YOUR FACE FOR THIS.",
      "OMA: I AM AN OLD WOMAN, AND I HAVE DECIDED SOMETHING, AND DECIDING IS A YOUNG PERSON'S GAME SO I AM DOING IT QUICKLY.",
      "OMA: I WILL STAY. HERE, IN MY ROOM WITH ITS OWN DOOR, UNTIL I TASTE THE FIRST WINE MADE FROM THIS FIELD'S FRUIT. THAT IS MY PROMISE. WRITE IT IN YOUR BOOK.",
      "FRANK WRITES IT IN THE REGISTER, IN HIS BEST HAND: OMA'S PROMISE. THE JAR, FOR NOW, IS EMPTY.",
      "OMA: NOW GO AND GROW ME A FIELD. I WILL BE HERE. I HAVE DECIDED.",
      "OMA: AND HEAR ME — I AM NOT PRESUMING, FRANK. HOW MANY YEARS I GET IS THE LORD'S BUSINESS, NOT MINE. I AM ONLY SAYING WHERE I WOULD LIKE TO SPEND THEM.",
    ],
    // game.js line 3981 · npcTalk
    omaTheForsythiaFrank: [
      "OMA: THE FORSYTHIA, FRANK. IT HAS SAT IN ITS POT BY MY DOOR LONG ENOUGH, PATIENT AS A RELATIVE AT A WEDDING.",
      "OMA: CARRY IT PAST MY WINDOW — SLOWLY, I WANT THE FULL PROCESSION — AND PLANT IT WHERE I SHOW YOU. I HAVE NAMED IT ALREADY. YOU WILL FIND OUT WHEN IT IS IN THE GROUND. SOME THINGS A WOMAN KEEPS UNTIL THE HOLE IS DUG.",
    ],
    // game.js line 3985 · npcTalk
    omaTheButterflyBush: [
      "OMA: THE BUTTERFLY BUSH FROM THE OLD YARD, FRANK. IT SURVIVED THE SALE, THE MOVE, AND A WINTER IN A POT BY MY DOOR, OUT OF SPITE AND GOOD ROOTS.",
      "OMA: PLANT IT BY MY PATIO. TODAY. I WILL DIRECT FROM THE DOOR, AND I WILL BE RIGHT ABOUT THE SPOT, AND YOU WILL PRETEND TO DECIDE AND THEN CHOOSE IT.",
      "SHE DOES NOT SAY WHY TODAY. THE REGISTER KNOWS: IT IS THE ANNIVERSARY. SOME DATES A HOUSE KEEPS QUIETLY, IN ITS BONES.",
    ],
    // game.js line 3995 · npcTalk
    omaYouWateredName: "OMA: YOU WATERED {name}. I SAW. AN OLD WOMAN NOTICES WHO TENDS AND WHO TALKS.",
    // game.js line 3995 · npcTalk
    omaHereFromYour: "OMA: HERE — FROM YOUR OPA'S STASH. GOOD DIRT. HE ALWAYS SAID A GARDEN RUNS ON IT AND ON BEING LOOKED AT. (+1 GOOD DIRT)",
    // game.js line 4002 · npcTalk
    omaNameIsThirsty: "OMA: {name} IS THIRSTY, FRANK. I CAN TELL FROM HERE. I CAN ALWAYS TELL FROM HERE.",
    // game.js line 4002 · npcTalk
    omaWaterItAnd: "OMA: WATER IT, AND COME BACK AND TELL ME. AN OLD WOMAN LIKES TO BE OBEYED IN SMALL THINGS. IT KEEPS THE WORLD LEVEL.",
    // game.js line 4013 · npcTalk
    pastorIHaveHeard: [
      "PASTOR: I HAVE HEARD ABOUT THIS WINE AT SOME LENGTH, FRANK. A MAN IN MY POSITION LEARNS TO POUR SLOWLY, AND JUDGE SLOWER.",
      "PASTOR: WHENEVER YOU ARE READY — THE TABLE, I THINK. SOME VERDICTS A MAN SHOULD BE SITTING DOWN FOR.",
    ],
    // game.js line 4015 · npcTalk
    line: "...",
  },

  // ======================================================================
  // THE YARD IN DEERBROOK — pots, weeds, the deer, the door
  // ======================================================================
  yard: {
    // game.js line 6247 · interact
    constanceHeCursesThe: "CONSTANCE: HE CURSES THE WEEDS ON MONDAY AND FEEDS THEM TO THE POTS ON FRIDAY. THE GARDEN KEEPS ITS OWN BOOKS.",
    // game.js line 6249 · interact
    theCompostCornerCompost: "THE COMPOST CORNER. COMPOST: {compost}.",
    // game.js line 6249 · interact
    makeGoodDirtFor: "MAKE GOOD DIRT FOR A POT? IT TAKES 3.",
    // game.js line 6210 · interact
    theBenchIsEmpty: "THE BENCH IS EMPTY HERE NOW. THE POTS LIVE ON — CHECK THE REGISTER.",
    // game.js line 6213 · interact
    theDoorTheTruck: "THE DOOR. THE TRUCK IS IN THE DRIVE, HUNGRY FOR BOXES.",
    // game.js line 6219 · interact
    rest: [
      "REST",
      "LOAD THE TRUCK",
      "GO INSIDE",
      "NOT YET",
    ],
    // game.js line 6216 · interact
    whatRidesFirst: "WHAT RIDES FIRST?",
    // game.js line 6216 · interact
    furnitureFirst: [
      "FURNITURE FIRST",
      "PLANTS FIRST",
    ],
    // game.js line 6222 · interact
    theDoorInsideSmells: "THE DOOR. INSIDE SMELLS OF TEA AND CARDBOARD.",
    // game.js line 6227 · interact
    restUntilMorning: "REST UNTIL MORNING?",
    // game.js line 6227 · interact
    rest_2: [
      "REST",
      "NOT YET",
    ],
    // game.js line 6238 · interact
    alvinIsReadyTo: "ALVIN IS READY TO DEFEND THE GARDEN. BUT THERE IS NO SPROUT TO DEFEND. YET.",
    // game.js line 6239 · interact
    wildDeerAppeared: "WILD DEER APPEARED!",
    // game.js line 6257 · interact
    makeIt: [
      "MAKE IT",
      "NOT NOW",
    ],
    // game.js line 6255 · interact
    goodDirtRichAnd: "GOOD DIRT, RICH AND DARK. (+1 GOOD DIRT, NOW {goodDirt}) FEED IT TO A WATERED POT AT THE BENCH.",
    // game.js line 6260 · interact
    youBrewAQuick: "YOU BREW A QUICK COMPOST TEA. (+1 TEA, NOW {tea})",
    // game.js line 6261 · interact
    compostCompost3Makes: "COMPOST: {compost} — 3 MAKES GOOD DIRT FOR A POT. PULL WEEDS TO GATHER MORE.",
    // game.js line 6267 · interact
    theRoadToBerryhill: "THE ROAD TO BERRYHILL. IT IS NOT FAR. IT IS ONLY EVERYTHING.",
    // game.js line 6267 · interact
    goToBerryhill: [
      "GO TO BERRYHILL",
      "NOT YET",
    ],
    // game.js line 6268 · interact
    theGateSticksBeyond: "THE GATE STICKS. BEYOND IT: MOWED LAWNS AND ORDINARY LIFE.",
    // game.js line 6270 · interact
    tooMuchShadeHere: "TOO MUCH SHADE HERE. A FIELD NEEDS OPEN SKY, AND TIME.",
    // game.js line 6315 · projUse
    enoughTheDayHas: "ENOUGH. THE DAY HAS A BOTTOM, AND FRANK HAS FOUND IT. REST, AND LET TOMORROW CARRY THE REST.",
    // game.js line 6317 · projUse
    oneMoreThingThen: "ONE MORE THING, THEN. FRANK'S HANDS ARE SORE AND HIS LIST IS LONGER THAN THE DAY. AFTER THIS: REST.",
    // game.js line 6774 · pullWeed
    frankAhAWeed: "FRANK: AH, A WEED! THE GARDEN'S LITTLE TAX. INTO THE COMPOST WITH YOU — NOTHING IN THIS YARD IS WASTED.",
  },

  // ======================================================================
  // INSIDE THE HOUSES — the shelf, the fridge, the packing, the sale
  // ======================================================================
  house: {
    // game.js line 5143 · potUp
    echo: "ECHO",
    // game.js line 5143 · potUp
    chandler: "CHANDLER",
    // game.js line 5145 · potUp
    n6Length: "6{length}",
    // game.js line 5071 · houseInteract
    oneTripADay: "ONE TRIP A DAY. THE VAN, AND FRANK, BOTH HAVE LIMITS.",
    // game.js line 5072 · houseInteract
    boxesBooksJarsAnd: "BOXES: BOOKS, JARS, AND ONE LABELED \"MISC — DO NOT SHAKE (SEEDS?)\".",
    // game.js line 5072 · houseInteract
    loadTheVan: [
      "LOAD THE VAN",
      "NOT YET",
    ],
    // game.js line 5077 · houseInteract
    theSecondPacketBlueberry: "THE SECOND PACKET. BLUEBERRY SEEDS NEED A WINTER BEFORE THEY NEED A SPRING.",
    // game.js line 5077 · houseInteract
    putTheSeedsIn: [
      "PUT THE SEEDS IN",
      "NOT YET",
    ],
    // game.js line 5079 · houseInteract
    theTraySleepsIn: "THE TRAY SLEEPS IN THE COLD AND DARK. WINTER DAYS BANKED: {stratDays} OF 10.",
    // game.js line 5080 · houseInteract
    theFridgeIsJust: "THE FRIDGE IS JUST A FRIDGE AGAIN. ITS TENANTS MOVED TO THE SHELF.",
    // game.js line 5081 · houseInteract
    theFridgeHumsInside: "THE FRIDGE HUMS. INSIDE: LEFTOVERS, AND PLANS.",
    // game.js line 5086 · houseInteract
    theTrayNSprouts: "THE TRAY: {n} SPROUTS, ALL UPRIGHT, ALL UNNAMED — FOR NOW. NAMES FOLLOW KNOWLEDGE.",
    // game.js line 5089 · houseInteract
    potUpASprout: [
      "POT UP A SPROUT",
      "WATER THE SHELF",
      "NOT NOW",
    ],
    // game.js line 5091 · houseInteract
    theTrayIsEmpty: "THE TRAY IS EMPTY. THE SHELF IS NOT.",
    // game.js line 5092 · houseInteract
    anEmptyTrayWaiting: "AN EMPTY TRAY, WAITING FOR ITS TENANTS TO WAKE.",
    // game.js line 5093 · houseInteract
    aTrayOfPeat: "A TRAY OF PEAT PELLETS, PATIENT AS JANUARY.",
    // game.js line 5098 · houseInteract
    anEmptySpotOn: "AN EMPTY SPOT ON THE SHELF. THE LIGHT HUMS OVER IT, HOPEFUL.",
    // game.js line 5102 · houseInteract
    theOldWoolBlanket: "THE OLD WOOL BLANKET, FOLDED AND READY. TONIGHT WILL BE COLD ENOUGH TO ARGUE ABOUT.",
    // game.js line 5104 · houseInteract
    tuckTheBlanketIn: [
      "TUCK THE BLANKET IN",
      "NOT NOW",
    ],
    // game.js line 5103 · houseInteract
    tuckedInTheShelf: "TUCKED IN. THE SHELF CROWD SLEEPS UNDER WOOL AND GOOD WISHES.",
    // game.js line 5106 · houseInteract
    theGrowLightHums: "THE GROW LIGHT HUMS ITS ONE NOTE, ALL DAY, LIKE IT IS PRACTICING.",
    // game.js line 5110 · houseInteract
    theSalePapersEverything: "THE SALE PAPERS. EVERYTHING THE HOUSE IS, IN A STACK THE SIZE OF A SANDWICH.",
    // game.js line 5110 · houseInteract
    signThePapers: [
      "SIGN THE PAPERS",
      "NOT YET",
    ],
    // game.js line 5112 · houseInteract
    omaAtTheTable: [
      "OMA, AT THE TABLE, WITH TEA SHE MADE HERSELF AT HOME AND BROUGHT ANYWAY:",
      "OMA: YOU SELL THE HOUSE FOR DIRT, FRANK. YOUR OPA WOULD HAVE DONE THE SAME, AND DENIED IT AT SUPPER.",
      "OMA: WHEN THE LAND COMES, I COME WITH IT. THERE IS A ROOM WITH MY NAME ON IT SOMEWHERE. THAT IS THE ARRANGEMENT.",
    ],
    // game.js line 5113 · houseInteract
    theTableWhereSeeds: "THE TABLE WHERE SEEDS WERE COUNTED AND PLANS WERE MADE. IT HAS HEARD EVERYTHING TWICE.",
    // game.js line 5115 · houseInteract
    theFireplaceFrankReads: "THE FIREPLACE. FRANK READS SEED CATALOGUES BY IT AND PRETENDS THEY ARE NOVELS.",
    // game.js line 5116 · houseInteract
    theCounterAKettle: "THE COUNTER. A KETTLE, TWO MUGS, AND A NOTE IN CONSTANCE'S HAND: \"WE ARE NOT BUYING A GOAT.\"",
    // game.js line 5117 · houseInteract
    upstairsBedroomsBoxesAnd: "UPSTAIRS: BEDROOMS, BOXES, AND THE GOOD QUIET.",
    // game.js line 5118 · houseInteract
    theHouseHoldingIts: "THE HOUSE, HOLDING ITS BREATH BETWEEN ONE LIFE AND THE NEXT.",
    // game.js line 5124 · waterShelf
    theWholeShelfEnd: "THE WHOLE SHELF, END TO END. {n} DRINKS POURED. THE LIGHT APPROVES.",
    // game.js line 5124 · waterShelf
    everyoneOnTheShelf: "EVERYONE ON THE SHELF IS ALREADY WATERED.",
    // game.js line 5129 · fridgeSeeds
    intoTheFridgeThey: [
      "INTO THE FRIDGE THEY GO — NINETY-SIX SEEDS IN A DAMP PAPER TOWEL, IN THE DARK, LIKE WINTER IN A BOX.",
      "FRANK: SLEEP WELL, SMALL ONES. DREAM OF APRIL.",
      "CONSTANCE: THEY ARE SEEDS, FRANK.",
      "FRANK: AND APRIL IS COMING ANYWAY.",
      "FRANK: A SEED SLEEPS IN THE DARK AND COMES UP IN ITS SEASON. THERE ARE WORSE PLANS FOR A WINTER. THERE ARE WORSE PLANS FOR ANYTHING.",
    ],
    // game.js line 5136 · storageTrip
    theLastLoadGoes: [
      "THE LAST LOAD GOES INTO STORAGE. THE HOUSE ECHOES NOW.",
      "CONSTANCE TRIES THE ECHO WITH SOMETHING APPROVING. IT COMES BACK APPROVING.",
      "NOW: A RENTAL, A WINTER, AND A FRIDGE FULL OF PROMISES.",
    ],
    // game.js line 5138 · storageTrip
    loadTripsOf3: "LOAD {trips} OF 3: THE VAN SWALLOWS BOXES AND ASKS FOR MORE.",
    // game.js line 5138 · storageTrip
    theHouseGetsEmptier: "THE HOUSE GETS EMPTIER AND THE PLAN GETS REALER.",
    // game.js line 5152 · potUp
    pottingUpOneSprout: "POTTING UP: ONE SPROUT, ONE POT, ONE NAME. FRANK DOES THE HONOURS IN A WHISPER, LIKE A CHRISTENING ON A TRAIN.",
    // game.js line 5152 · potUp
    meetNameOfThe: "MEET {name}, OF THE {variety} LINE. THE SHELF MAKES ROOM.",
    // game.js line 5152 · potUp
    thereAreNMore: "THERE ARE {n} MORE IN THE TRAY. THE AFTERNOON IS YOUNG.",
    // game.js line 5155 · potUp
    pottedUpNameVariety: "POTTED UP: {name} ({variety}) · {n} TO GO",
    // game.js line 5162 · finishPotting
    theLastOneIs: "THE LAST ONE IS POTTED. THE BENCH COMES IN FROM THE COLD TOO — THE SIX TAKE THE WINDOW IN ORDER, LIKE A ROLL CALL.",
    // game.js line 5162 · finishPotting
    theRegisterRecordsThe: "THE REGISTER RECORDS THE GERMINATION: 96 SOWN, {pottedTotal} POTTED UP — THE COMPANY, ALL TOLD, AND THE SIX BY NAME.",
    // game.js line 5162 · finishPotting
    constanceNowTheHouse: "CONSTANCE: NOW THE HOUSE, FRANK. THE PAPERS ARE ON THE TABLE. THE LAND IS WAITING SOMEWHERE.",
    // game.js line 5166 · signSale
    thePapersAreSigned: [
      "THE PAPERS ARE SIGNED AT THE TABLE WHERE THE SEEDS WERE COUNTED.",
      "THE HOUSE IS SOLD. THE RENTAL IS SMALL AND WARM AND COMES WITH AN AGENT'S PROMISE: \"SUITABLE HOUSING\" FOR EVERYONE, BY SPRING.",
      "FRANK: SUITABLE HOUSING. FOR FORTY-ODD BLUEBERRY PLANTS.",
      "CONSTANCE: THEY WILL FIND US LAND, FRANK. HOUSES FOLLOW LAND. THEY ALWAYS HAVE.",
    ],
    // game.js line 6278 · potInteract
    noSeedsLeftIn: "NO SEEDS LEFT IN THE PACKET.",
    // game.js line 6282 · potInteract
    plantedSixLittlePromises: [
      "PLANTED! SIX LITTLE PROMISES IN PEAT.",
      "FRANK: A FIELD NEEDS A ROLL, AND EVERY PROMISE NEEDS A NAME. I HAVE GIVEN THIS SOME THOUGHT.",
      "FRANK: ADMIRAL! CAPTAIN! GENERAL! HOPE! PATIENCE! PROFESSOR! ROLL CALL COMPLETE.",
      "CONSTANCE: HE NAMED THE SEEDS, ALVIN. ALPHABETICALLY. THERE WAS A ROSTER.",
      "NOW, A DRINK FOR EACH NEW FRIEND. PRESS A AT A POT TO WATER.",
      "FRANK: I CAN PUT A SEED IN THE GROUND. THAT MUCH I CAN DO. WHETHER IT LIVES IS NOT UP TO ME — THE LORD GROWS THEM, CONSTANCE. I JUST PLANT.",
      "CONSTANCE: THEN WE WATER WHAT IS OURS TO WATER, LOVE. THAT PART, AT LEAST, IS IN OUR DEPARTMENT.",
    ],
    // game.js line 6290 · potInteract
    anotherSeedTuckedInto: "ANOTHER SEED TUCKED INTO PEAT. SMALL AS A SECRET.",
    // game.js line 6296 · potInteract
    constanceNowWeWait: [
      "CONSTANCE: NOW WE WAIT. FRANK HAS ALREADY NAMED ALL SIX. IT IS DAY ONE.",
      "REST AT THE HOUSE DOOR TO PASS THE DAY. WATER AGAIN TOMORROW.",
    ],
    // game.js line 6298 · potInteract
    youWaterTheSeed: "YOU WATER THE SEED. GROW WELL, LITTLE ONE. NO RUSH.",
    // game.js line 6298 · potInteract
    youWaterTheV: "YOU WATER THE {v}. STEADY DOES IT.",
    // game.js line 6301 · potInteract
    nameIsWateredAnd: "{name} IS WATERED AND WAITING.",
    // game.js line 6301 · potInteract
    feedNameTheGood: "FEED {name} THE GOOD DIRT? (YOU HOLD {goodDirt})",
    // game.js line 6306 · potInteract
    feedIt: [
      "FEED IT",
      "NOT NOW",
    ],
    // game.js line 6304 · potInteract
    goodDirtForName: "GOOD DIRT FOR {name}. +8 VIGOR, AND THE NEXT STAGE COMES A DAY SOONER.",
    // game.js line 6308 · potInteract
    alreadyWateredTodayWaiting: "ALREADY WATERED TODAY. WAITING IS MOST OF THE WORK.",
    // REVISION (Nov 27, 2026) — potting-up makes the Company, not a census.
    // The naming scene: names follow knowledge.
    companyFirst: "POTTING UP: ONE SPROUT, ONE POT. FRANK OPENS HIS MOUTH TO NAME IT — GRANDLY, THE WAY HE BEGINS EVERYTHING —",
    companyFirst2: "CONSTANCE: YOU DO NOT KNOW THAT ONE YET, FRANK.",
    companyFirst3: "FRANK LOOKS AT THE SHELF, WHERE THE SIX HE DOES KNOW ARE SITTING. FRANK: ...NO. I KNOW SIX. THE REST — THE FIELD WILL TEACH ME WHO THEY ARE. ONE AT A TIME, AS THINGS HAPPEN TO THEM.",
    companyFirst4: "THE SPROUT GOES INTO THE POT UNNAMED, IN GOOD COMPANY. THERE ARE {n} MORE IN THE TRAY.",
    companyToast: "POTTED UP · THE COMPANY GROWS · {n} TO GO",
    companyLast: "THE LAST ONE IS POTTED. THE COMPANY STANDS ON THE SHELF — FORTY STRONG, AND UNNAMED, AND IN NO HURRY TO BE OTHERWISE. THE BENCH COMES IN FROM THE COLD TOO: THE SIX TAKE THE WINDOW IN ORDER, LIKE A ROLL CALL.",
  },

  // ======================================================================
  // THE BARN — outside: the door, the greenhouse build, the stairs build
  // ======================================================================
  barn: {
    // game.js line 4101 · barnInteract
    theFrame: [
      "THE FRAME",
      "THE SHELL",
      "THE HEATER",
    ],
    // game.js line 4038 · barnInteract
    theBarnDoorInside: "THE BARN DOOR. INSIDE: BED. OUTSIDE: EVERYTHING ELSE.",
    // game.js line 4045 · barnInteract
    rest: [
      "REST",
      "GO INSIDE",
      "NOT YET",
    ],
    // game.js line 4039 · barnInteract
    whereDoesAlvinWatch: "WHERE DOES ALVIN WATCH TONIGHT?",
    // game.js line 4043 · barnInteract
    theNursery: [
      "THE NURSERY",
      "ROW 1",
      "THE FIELD ROWS",
      "NO WATCH",
    ],
    // game.js line 4042 · barnInteract
    noWatchTonightThe: "NO WATCH TONIGHT. THE FIELD KEEPS ITS OWN COUNSEL.",
    // game.js line 4042 · barnInteract
    nursery: [
      "NURSERY",
      "ROW 1",
      "FIELD ROWS",
    ],
    // game.js line 4042 · barnInteract
    alvinTakesTheWatch: "ALVIN TAKES THE {watch} WATCH. HIS EARS ARE UP BEFORE FRANK IS DOWN.",
    // game.js line 4047 · barnInteract
    theBarnDoorHome: "THE BARN DOOR. HOME, AS OF VERY RECENTLY.",
    // game.js line 4053 · barnInteract
    theDownstairsDoorIt: "THE DOWNSTAIRS DOOR. IT OPENS TO THE YARD, ON ITS OWN — AN APARTMENT WITH ITS OWN FRONT DOOR.",
    // game.js line 4053 · barnInteract
    goIn: [
      "GO IN",
      "NOT YET",
    ],
    // game.js line 4058 · barnInteract
    theFenceProblemAs: [
      "THE FENCE PROBLEM, AS FRANK WRITES IT IN THE REGISTER:",
      "EIGHT HUNDRED FEET OF BOUNDARY. POSTS, WIRE, A PARALLEL RUN FOUR FEET INSIDE — DEER JUMP ONE FENCE. THEY DO NOT JUMP A PUZZLE.",
      "PRICE: EVERYTHING. EFFORT: ALSO EVERYTHING. TIME: BEFORE THE PLANTS GO IN, OR THE DEER WILL DO THE HARVESTING.",
      "CONSTANCE: ONE SEGMENT AT A TIME, FRANK. LIKE EVERYTHING ELSE YOU HAVE EVER FINISHED.",
    ],
    // game.js line 4062 · barnInteract
    aLetterFromThe: [
      "A LETTER FROM THE TOWN, IN A HAND THAT HAS NEVER HELD A SPADE:",
      "THE LOT IS FOUR ACRES SHORT FOR GOATS, AND CHICKENS ARE A HARD NO IN INK THAT MEANS IT.",
      "FRANK: FOUR ACRES. FOUR. THE FIELD IS RIGHT THERE —",
      "CONSTANCE: THE FIELD IS FOR BLUEBERRIES, FRANK. THE CLERK HAS DONE YOU A FAVOUR AND YOU WILL THANK HIM IN ABOUT A YEAR.",
      "(THE GOATS GO IN THE REGISTER UNDER \"SOMEDAY\". SOMEDAY IS A REAL PAGE. FRANK CHECKS IT OFTEN.)",
    ],
    // game.js line 4064 · barnInteract
    theGoodShedSound: "THE GOOD SHED. SOUND ROOF, TRUE WALLS. INSIDE: TWINE, STAKES, A TAPE MEASURE, AND A SPADE THAT HAS SEEN THINGS.",
    // game.js line 4069 · barnInteract
    thePlantingGateThe: "THE PLANTING GATE. THE FIELD, THE REGISTER, AND FRANK ALL CHECK THE SAME LIST.",
    // game.js line 4069 · barnInteract
    plantingDay: [
      "PLANTING DAY",
      "READ THE LIST",
      "NOT YET",
    ],
    // game.js line 4069 · barnInteract
    theListAsThe: "THE LIST, AS THE FIELD KEEPS IT:",
    // game.js line 4069 · barnInteract
    nothingItIsTime: [
      "— NOTHING. IT IS TIME.",
    ],
    // game.js line 4072 · barnInteract
    watchRowRn: "WATCH ROW {rn}",
    // game.js line 4073 · barnInteract
    rowWatchtonight: "ROW {watchTonight}",
    // game.js line 4073 · barnInteract
    theFrostWatchOne: "THE FROST WATCH. ONE ROW A NIGHT GETS ALVIN. THE REST GET PRAYED OVER, AND THE LORD KEEPS WHAT HE KEEPS. TONIGHT'S WATCH: {v}.",
    // game.js line 4075 · barnInteract
    leaveItUnset: "LEAVE IT UNSET",
    // game.js line 4074 · barnInteract
    rowWhichTonightAlvin: "ROW {which} TONIGHT. ALVIN HAS BEEN TOLD. HE HAS OPINIONS ABOUT THE OTHER ROWS, AND IS KEEPING THEM PROFESSIONALLY TO HIMSELF.",
    // game.js line 4077 · barnInteract
    backToTheYard: "BACK TO THE YARD?",
    // game.js line 4077 · barnInteract
    climbBack: [
      "CLIMB BACK",
      "STAY",
    ],
    // game.js line 4079 · barnInteract
    theFieldGateIt: "THE FIELD GATE. IT SWINGS BOTH WAYS NOW, LIKE A DECISION THAT HAS BEEN MADE.",
    // game.js line 4079 · barnInteract
    enterTheField: [
      "ENTER THE FIELD",
      "NOT YET",
    ],
    // game.js line 4081 · barnInteract
    theFieldGateFirst: "THE FIELD GATE. FIRST, A HOUSE TO LIVE IN AND A GLASS HOUSE FOR THE PLANTS. THEN — EVERYTHING.",
    // game.js line 4090 · barnInteract
    theProudWeedS: "THE PROUD WEED'S SHOOT, UP AGAIN BY THE FENCE — ONE GREEN WHISKER, EVERY SPRING, FROM ROOTS THAT OUTLASTED FIRE.",
    // game.js line 4093 · barnInteract
    pullIt: [
      "PULL IT",
      "LET IT STAND",
    ],
    // game.js line 4092 · barnInteract
    pulledWithANod: "PULLED, WITH A NOD. THE REGISTER NOTES IT, WRYLY: PULLED AGAIN. SEE YOU NEXT YEAR.",
    // game.js line 4092 · barnInteract
    letStandThenThe: "LET STAND, THEN. THE REGISTER NOTES IT, WRYLY: SOME THINGS A FIELD KEEPS ON PURPOSE.",
    // game.js line 4100 · barnInteract
    enoughBuildingForOne: "ENOUGH BUILDING FOR ONE DAY. GLASS KEEPS. SO DOES FRANK, BARELY.",
    // game.js line 4102 · barnInteract
    theGreenhouseSiteStaked: "THE GREENHOUSE SITE, STAKED WITH STRING. NEXT: {stage}.",
    // game.js line 4102 · barnInteract
    buildStage: "BUILD: {stage}",
    // game.js line 4104 · barnInteract
    theGreenhouseGlassAnd: "THE GREENHOUSE. GLASS AND PATIENCE. (STEP ONTO ITS DOORSTEP TO GO IN.)",
    // game.js line 4105 · barnInteract
    aLevelPatchOf: "A LEVEL PATCH OF GROUND, STAKED WITH STRING. SOMETHING IS PLANNED HERE.",
    // game.js line 4107 · barnInteract
    thePineLineThe: "THE PINE LINE. THE WIND COMES THROUGH IT LIKE IT IS READING ALOUD.",
    // game.js line 4108 · barnInteract
    aBirdbathInheritedWith: "A BIRDBATH, INHERITED WITH THE PROPERTY. THE BIRDS HAVE ALREADY SIGNED THE LEASE.",
    // game.js line 4109 · barnInteract
    berryhillTheNameIs: "BERRYHILL. THE NAME IS ON THE MAILBOX AND, FRANK INSISTS, ON HIS HEART.",
    // game.js line 4116 · buildGreenhouse
    dayOneTheFrame: [
      "DAY ONE: THE FRAME. POSTS, BEAMS, AND A LEVEL THAT FRANK CONSULTS LIKE SCRIPTURE.",
      "IT STANDS. IT IS SQUARE. CONSTANCE CHECKS THE LEVEL HERSELF AND NODS ONCE, WHICH IS APPLAUSE.",
    ],
    // game.js line 4117 · buildGreenhouse
    dayTwoTheShell: [
      "DAY TWO: THE SHELL. THE WIND PICKS TODAY, OF ALL DAYS, TO HAVE OPINIONS.",
      "FRANK HOLDS A PANEL. THE PANEL HOLDS FRANK. CONSTANCE HOLDS THE LADDER, THE SCREWS, AND THE SITUATION.",
      "IT IS ON. IT IS SEALED. IT GLEAMS.",
    ],
    // game.js line 4119 · buildGreenhouse
    dayThreeTheHeater: [
      "DAY THREE: THE HEATER, A LITTLE STOVE WITH A SERIOUS FACE.",
      "THE GLASS HOUSE IS A HOUSE NOW. TOMORROW THE PLANTS MOVE IN — CARRIED, A LOAD AT A TIME, FROM THE OFFICE SHELF.",
    ],
    // game.js line 4091 · barnInteract
    pulled: "PULLED",
    // game.js line 4091 · barnInteract
    letStand: "LET STAND",
  },

  // ======================================================================
  // INSIDE THE BARN — kitchen, office, cellar stairs
  // ======================================================================
  barnIn: {
    // game.js line 4127 · barnInInteract
    theOfficeShelfFull: "THE OFFICE SHELF, FULL OF PLANTS PRACTICING THEIR INDOOR VOICES.",
    // game.js line 4130 · barnInInteract
    carryALoadTo: [
      "CARRY A LOAD TO THE GREENHOUSE",
      "WATER THEM HERE",
      "NOT NOW",
    ],
    // game.js line 4132 · barnInInteract
    theOfficeShelfThe: "THE OFFICE SHELF. THE JOURNAL KEEPS THE DESK BY THE SOUTH WALL, WHEN A NAME NEEDS FINDING.",
    // game.js line 4132 · barnInInteract
    waterTheShelf: [
      "WATER THE SHELF",
      "NOT NOW",
    ],
    // game.js line 4137 · barnInInteract
    anEmptySpotOn: "AN EMPTY SPOT ON THE OFFICE SHELF. IT WILL NOT STAY EMPTY. IT NEVER DOES.",
    // game.js line 4142 · barnInInteract
    theStairsAreDone: "THE STAIRS ARE DONE — AND HOLD. FRANK TESTS THEM WITH A JUMP THAT CONSTANCE PRETENDS NOT TO SEE.",
    // game.js line 4143 · barnInInteract
    theStairsAreHalf: "THE STAIRS ARE HALF-BUILT AND WHOLLY IN THE WAY. TOMORROW THEY ARE STAIRS.",
    // game.js line 4144 · barnInInteract
    theStairProjectA: "THE STAIR PROJECT: A DAY OF WORK TO JOIN THE HOUSE TO ITSELF.",
    // game.js line 4144 · barnInInteract
    buildTheStairs: [
      "BUILD THE STAIRS",
      "NOT YET",
    ],
    // game.js line 4144 · barnInInteract
    workBeginsSawdustLevels: "WORK BEGINS. SAWDUST, LEVELS, AND A PENCIL BEHIND EVERY EAR IN THE HOUSE.",
    // game.js line 4146 · barnInInteract
    theStairsUpAnd: "THE STAIRS. UP AND DOWN, LIKE A FAMILY.",
    // game.js line 4149 · barnInInteract
    theBarnKitchenIn: "THE BARN KITCHEN, IN WINE SEASON. THE YEAR'S FRUIT IS IN: {toFixedVal} LBS. SET THE HONEY FOR BATCH {length}1.",
    // game.js line 4151 · barnInInteract
    aSpoon030: [
      "A SPOON — 0.30",
      "A MEASURE — 0.55",
      "THE LESSON — 0.65",
      "A FULL MEASURE — 0.80",
      "A GENEROUS CUP — 1.00",
    ],
    // game.js line 4154 · barnInInteract
    theBarnKitchenA: "THE BARN KITCHEN. A CLEAN JAR, BOUGHT FRUIT, AND A REHEARSAL TO RUN.",
    // game.js line 4154 · barnInInteract
    startBatchOne: [
      "START BATCH ONE",
      "NOT YET",
    ],
    // game.js line 4158 · barnInInteract
    batchTwoTheField: "BATCH TWO. THE FIELD'S OWN FRUIT: {pts} PINTS OF IT. THE JOURNAL HOLDS THE LESSON: A DASH (0.10) WAS TART. THE OLD BOOKS SAY HALF TO FOUR-FIFTHS. SET THE HONEY, FRANK.",
    // game.js line 4161 · barnInInteract
    aDash010: [
      "A DASH — 0.10",
      "A SPOON — 0.30",
      "A MEASURE — 0.55",
      "THE LESSON — 0.65",
      "A FULL MEASURE — 0.80",
      "A GENEROUS CUP — 1.00",
      "A FLOOD — 1.35",
    ],
    // game.js line 4165 · barnInInteract
    batchBatchDoneAnd: "BATCH {batch}, DONE AND WAITING: THE REGISTER'S FORMULA CALLS IT {verdict}.",
    // game.js line 4165 · barnInInteract
    bottleIt: [
      "BOTTLE IT",
      "NOT YET",
    ],
    // game.js line 4166 · barnInInteract
    theJarOpenAnd: "THE JAR, OPEN AND BREATHING. DAY {days}1 OF 3. SWISHED TODAY: {v} OF 3.",
    // game.js line 4166 · barnInInteract
    swishIt: [
      "SWISH IT",
      "LEAVE IT",
    ],
    // game.js line 4167 · barnInInteract
    vDaySAgo: "{v} DAY(S) AGO",
    // game.js line 4167 · barnInInteract
    theJarSealedDay: "THE JAR, SEALED. DAY {days}1 OF {v}. THE SEAL-WATER WAS LAST TOPPED {v2}.",
    // game.js line 4167 · barnInInteract
    topUpTheSeal: [
      "TOP UP THE SEAL",
      "LEAVE IT",
    ],
    // game.js line 4170 · barnInInteract
    amongTheBarnS: "AMONG THE BARN'S PLUMBING: A VALVE, GREEN WITH AGE, THAT FRANK TURNS WITH BOTH HANDS AND A PRAYER.",
    // game.js line 4170 · barnInInteract
    turnIt: [
      "TURN IT",
      "NOT YET",
    ],
    // game.js line 4173 · barnInInteract
    theTableTheYear: "THE TABLE. THE YEAR'S SURPLUS COULD GO DOWN THE ROAD — THE FARM STAND BY THE GATE HAS A SIGN NOW, AND THE SIGN HAS A BORDER.",
    // game.js line 4173 · barnInInteract
    shareTheSurplus: [
      "SHARE THE SURPLUS",
      "NOT TODAY",
    ],
    // game.js line 4174 · barnInInteract
    theTableItMade: "THE TABLE. IT MADE THE TRIP. EVERYTHING IMPORTANT IN THIS FAMILY HAS BEEN DECIDED AT THIS TABLE, INCLUDING BREAKFAST.",
    // game.js line 4175 · barnInInteract
    theCounterTheKettle: "THE COUNTER. THE KETTLE HAS FOUND ITS NEW HOME AND APPROVES OF THE VIEW.",
    // game.js line 4176 · barnInInteract
    theBedMovingHouse: "THE BED. MOVING HOUSE IS A CONTACT SPORT AND EVERYONE IS BRUISED IN PLACES THEY DID NOT KNOW THEY HAD.",
    // game.js line 4177 · barnInInteract
    upstairsInTheBarn: "UPSTAIRS IN THE BARN. IT SMELLS OF WOOD AND BEGINNINGS.",
  },

  // ======================================================================
  // THE GREENHOUSE
  // ======================================================================
  greenhouse: {
    // game.js line 4202 · greenInteract
    theGlassAndA: "THE GLASS, AND A ROLL OF CHICKEN WIRE FRANK HAS BEEN MEANING TO TRY AROUND THE VENTS.",
    // game.js line 4202 · greenInteract
    fitTheWire: [
      "FIT THE WIRE",
      "NOT YET",
    ],
    // game.js line 4202 · greenInteract
    theWirePrototypeA: [
      "THE WIRE PROTOTYPE: A LITTLE SKIRT OF MESH AROUND THE GLASS HOUSE, TO TELL CLIMBERS AND CRAWLERS THE NEWS.",
      "IT WILL NOT STOP A DEER. IT IS NOT FOR DEER. IT IS A FIRST DRAFT OF AN IDEA, AND THE FENCE WILL BE THE SECOND.",
    ],
    // game.js line 4206 · greenInteract
    open: "OPEN.",
    // game.js line 4206 · greenInteract
    shut: "SHUT.",
    // game.js line 4206 · greenInteract
    theStoveAndAbove: "THE STOVE, AND ABOVE IT THE VENT — A LITTLE ROOF WINDOW ON A ROPE. THE VENT IS {v}",
    // game.js line 4209 · greenInteract
    stoveLit: "STOVE (LIT)",
    // game.js line 4209 · greenInteract
    lightTheStove: "LIGHT THE STOVE",
    // game.js line 4209 · greenInteract
    closeTheVent: "CLOSE THE VENT",
    // game.js line 4209 · greenInteract
    openTheVent: "OPEN THE VENT",
    // game.js line 4209 · greenInteract
    leaveIt: "LEAVE IT",
    // game.js line 4207 · greenInteract
    litTheStoveSettles: "LIT. THE STOVE SETTLES INTO ITS WORK WITH A TICK AND A SIGH.",
    // game.js line 4207 · greenInteract
    theStoveTicksWith: "THE STOVE TICKS WITH HEAT. ALL IS WELL.",
    // game.js line 4208 · greenInteract
    theVentCreaksOpen: "THE VENT CREAKS OPEN. HOT AIR LEAVES LIKE IT WAS CALLED BY NAME.",
    // game.js line 4208 · greenInteract
    theVentComesDown: "THE VENT COMES DOWN. THE GLASS HOUSE HOLDS ITS BREATH AGAIN.",
    // game.js line 4211 · greenInteract
    theStoveTicksWith_2: "THE STOVE TICKS WITH HEAT. THE GLASS FOGS, JUST A LITTLE, AT THE EDGES. ALL IS WELL.",
    // game.js line 4212 · greenInteract
    theLittleStoveCold: "THE LITTLE STOVE, COLD. THE NIGHT WILL BE WHAT IT WILL BE.",
    // game.js line 4212 · greenInteract
    lightTheStove_2: [
      "LIGHT THE STOVE",
      "LEAVE IT",
    ],
    // game.js line 4216 · greenInteract
    theTrayStratifiedThrough: "THE TRAY, STRATIFIED THROUGH THE WINTER AND READY: {n} SEEDS, WIDE AWAKE.",
    // game.js line 4216 · greenInteract
    potThemUp: [
      "POT THEM UP",
      "NOT YET",
    ],
    // game.js line 4220 · greenInteract
    theBenchesEveryLeaf: "THE BENCHES. EVERY LEAF IN THE GLASS HOUSE IS A QUESTION.",
    // game.js line 4228 · greenInteract
    waterThemAll: [
      "WATER THEM ALL",
      "FEED THE WEAKEST",
      "JUST LOOK",
    ],
    // REVISION (Nov 27, 2026) · greenInteract — the Company's dirt option
    feedTheCompany: "FEED THE COMPANY",
    goodDirtForTheCompany: "GOOD DIRT FOR THE COMPANY — WORKED THROUGH THE BENCHES, A LITTLE FOR EVERYONE. THE BAND BREATHES EASIER.",
    // game.js line 4224 · greenInteract
    noOneHereTo: "NO ONE HERE TO FEED.",
    // game.js line 4225 · greenInteract
    nameIsTheWeakest: "{name} IS THE WEAKEST, AND THERE IS NO GOOD DIRT LEFT. THE YARD LOOP STILL PAYS: WEEDS, COMPOST, DIRT.",
    // game.js line 4226 · greenInteract
    goodDirtForName: "GOOD DIRT FOR {name}, THE WEAKEST FIRST. IT IS NOT FAVOURITISM. IT IS TRIAGE, AND TRIAGE IS LOVE WITH A LIST.",
    // game.js line 4230 · greenInteract
    theBenchesEveryPlant: "THE BENCHES. EVERY PLANT IN ITS PLACE, EVERY PLACE WITH A PLANT.",
    // game.js line 4230 · greenInteract
    waterTheBenches: [
      "WATER THE BENCHES",
      "NOT NOW",
    ],
    // game.js line 4232 · greenInteract
    theGreenhouseItSmells: "THE GREENHOUSE. IT SMELLS OF WARM EARTH AND POSSIBILITY.",
  },

  // ======================================================================
  // OMA'S PLACE
  // ======================================================================
  oma: {
    // game.js line 4237 · omaInteract
    alvinDownstairsOccupyingThe: [
      "ALVIN, DOWNSTAIRS, OCCUPYING THE WARM SPOT BY OMA'S BED LIKE A SMALL FURNACE WITH OPINIONS.",
      "HE RISES, STRETCHES, AND FALLS IN BEHIND FRANK. THE DEFECTION WAS NEVER PERSONAL. THE FEET WERE WARM.",
    ],
    // game.js line 4239 · omaInteract
    thePhotographOnOma: [
      "THE PHOTOGRAPH ON OMA'S SHELF: A YOUNGER OMA, AND OPA, SQUINTING INTO A SUN THAT HAS LONG SINCE SET.",
      "HE IS NOT HERE. HE IS NOT NOWHERE, EITHER. OMA SAYS HE IS WITH THE LORD, AND OMA DOES NOT SAY THINGS JUST TO MAKE HERSELF FEEL BETTER. THE ROOM KEEPS HIM THE WAY THE REGISTER KEEPS A NAME.",
    ],
    // game.js line 4240 · omaInteract
    omaSShelfEverything: "OMA'S SHELF. EVERYTHING ON IT IS EXACTLY WHERE IT BELONGS, INCLUDING THE THINGS THAT LOOK RANDOM.",
    // game.js line 4241 · omaInteract
    theBedMadeWith: "THE BED, MADE WITH HOSPITAL CORNERS AND OPINIONS.",
    // game.js line 4242 · omaInteract
    aSmallTableFor: "A SMALL TABLE FOR ONE, SET — ON PRINCIPLE — FOR TWO.",
    // game.js line 4243 · omaInteract
    theDownstairsItsOwn: "THE DOWNSTAIRS. ITS OWN DOOR, ITS OWN HOURS, ITS OWN EVERYTHING. READY WHEN SHE IS.",
  },

  // ======================================================================
  // THE IRISES BY THE BARN
  // ======================================================================
  iris: {
    // game.js line 4274 · irisInteract
    irisesInheritedWithThe: "IRISES, INHERITED WITH THE PLACE — PURPLE, WHITE, AND A YELLOW LIKE A SMALL SUN.",
    // game.js line 4274 · irisInteract
    frankNamesThemOn: "FRANK NAMES THEM ON SIGHT, ONE PER COLOUR, THE WAY YOU GREET NEIGHBOURS YOU INTEND TO KEEP: {joinVal}.",
    // game.js line 4274 · irisInteract
    theyGoInThe: "THEY GO IN THE REGISTER UNDER GARDEN. THEY WERE HERE FIRST. IT IS THEIR NAME ON THE LAND, REALLY. HIS IS THE NEW ONE.",
    // game.js line 4277 · irisInteract
    theIrisesADrink: "THE IRISES. A DRINK WOULD NOT GO AMISS.",
    // game.js line 4277 · irisInteract
    waterThem: [
      "WATER THEM",
      "NOT NOW",
    ],
    // game.js line 4277 · irisInteract
    wateredTheIrisesStand: "WATERED. THE IRISES STAND A LITTLE STRAIGHTER, LIKE SOMEONE SAID THEIR NAMES.",
    // game.js line 4278 · irisInteract
    theIrisesWateredAnd: "THE IRISES, WATERED AND HOLDING COURT BY THE BARN WALL.",
  },

  // ======================================================================
  // THE PATCH BEHIND THE GOOD SHED
  // ======================================================================
  patch: {
    // game.js line 4284 · patchInteract
    behindTheGoodShed: [
      "BEHIND THE GOOD SHED: A BLACKBERRY PATCH GONE ENTIRELY TO THORN. SOMEWHERE IN THERE ARE BERRIES WORTH RESCUING.",
      "THEN WE PULL. EIGHT BIG WEEDS STAND BETWEEN THE WORLD AND THE BERRIES. GLOVES ON.",
    ],
    // game.js line 4288 · patchInteract
    theLastWeedComes: [
      "THE LAST WEED COMES UP WITH A SOUND LIKE A CORK. UNDERNEATH: CANES. OLD, THORNLESS, PLANTED BY SOMEONE WHO KNEW — AND WORTH SAVING.",
      "NOW A LITTLE NETTING, TO TELL THE BIRDS THE NEWS.",
    ],
    // game.js line 4289 · patchInteract
    weedPatchpullsOf8: "WEED {patchPulls} OF 8. THE PATCH CONCEDES GROUND THE WAY WINTER DOES: SLOWLY, THEN ALL AT ONCE.",
    // game.js line 4293 · patchInteract
    theNettingPrototypeA: [
      "THE NETTING PROTOTYPE: A FRAME, A NET, AND FRANK'S FULL CONFIDENCE.",
      "NETTED. THE CANES STAND IN THEIR LITTLE FORTRESS, BLINKING IN THE SUN.",
      "AND NOW THEY ARE PLANTED IN EARNEST — IN REAL GROUND, WITH NAMES.",
    ],
    // game.js line 4302 · patchInteract
    oneMoreCaneWaits: " ONE MORE CANE WAITS.",
    // game.js line 4302 · patchInteract
    plantedInRealGround: "PLANTED, IN REAL GROUND: {name}, THORNLESS BLACKBERRY. THE FIRST THING IN THIS FIELD WITH ROOTS AND A NAME.{v}",
    // game.js line 4304 · patchInteract
    theBlackberriesNettedNamed: "THE BLACKBERRIES. NETTED, NAMED, AND HOLDING THEIR CORNER BEHIND THE SHED.",
  },

  // ======================================================================
  // THE FENCE
  // ======================================================================
  fence: {
    // game.js line 4345 · fenceInteract
    theFenceLineAnd: "THE FENCE LINE, AND THE VALVE POST FRANK PAINTED BLUE SO HE WOULD STOP LOSING IT.",
    // game.js line 4348 · fenceInteract
    openTheValveAll: [
      "OPEN THE VALVE (ALL ROWS)",
      "THE FENCE ITSELF",
      "LEAVE IT",
    ],
    // game.js line 4346 · fenceInteract
    theValveTurnsSomewhere: "THE VALVE TURNS. SOMEWHERE UNDER THE FIELD, WATER REMEMBERS ITS ROAD. EVERY ROW DRINKS.",
    // game.js line 4355 · fenceSegDialogue
    segmentSeg1Stands: "SEGMENT {seg}1 STANDS. THE IRRIGATION LINE COULD RUN ALONG IT, IF A CERTAIN PIPE EVER GETS FOUND.",
    // game.js line 4355 · fenceSegDialogue
    runTheLine: [
      "RUN THE LINE",
      "NOT YET",
    ],
    // game.js line 4355 · fenceSegDialogue
    lineRunTheFence: "LINE RUN. THE FENCE NOW CARRIES WATER LIKE A SECRET IT IS PROUD OF.",
    // game.js line 4356 · fenceSegDialogue
    segmentSeg1Of: "SEGMENT {seg}1 OF THE DOUBLE FENCE STANDS. POSTS TRUE, WIRE TIGHT, A PUZZLE A DEER MUST SOLVE TWICE.",
    // game.js line 4359 · fenceSegDialogue
    theTwoPrototypesNet: "THE TWO PROTOTYPES — NET AND WIRE — HAVE ALREADY TAUGHT FRANK'S HANDS THIS WORK. THIS ONE GOES UP LIKE IT WAS REHEARSED.",
    // game.js line 4359 · fenceSegDialogue
    postsWireAndA: "POSTS, WIRE, AND A PARALLEL RUN FOUR FEET INSIDE.",
    // game.js line 4359 · fenceSegDialogue
    fenceSegmentSeg1: "FENCE SEGMENT {seg}1 OF 4. {v}",
    // game.js line 4359 · fenceSegDialogue
    buildIt: [
      "BUILD IT",
      "NOT YET",
    ],
    // game.js line 4368 · buildFenceSeg
    segmentSeg1Stands_2: "SEGMENT {seg}1 STANDS. {fence} OF 4. THE FIELD IS BEGINNING TO HAVE AN INSIDE AND AN OUTSIDE, WHICH IS ALL A FENCE EVER REALLY SAYS.",
  },

  // ======================================================================
  // THE OLD IRRIGATION PIPE
  // ======================================================================
  pipe: {
    // game.js line 4374 · digPipe
    fourFeetDownA: [
      "FOUR FEET DOWN: A PIPE. AN OLD IRRIGATION LINE, LAID BY WHOEVER FARMED HERE BEFORE, CAPPED AND PATIENT.",
      "JEREMIAH, HOLDING THE VALVE LIKE A TROPHY: IT STILL TURNS. EVERYTHING STILL TURNS IF YOU ARE POLITE AND USE BOTH HANDS.",
      "HE KEEPS THE VALVE. THIS IS NON-NEGOTIABLE AND ALSO CORRECT — NOW THE HOUSE END NEEDS ITS VALVE FOUND, SOMEWHERE IN THE BARN'S PLUMBING.",
    ],
    // game.js line 4379 · turnValve
    somewhereATapSings: "SOMEWHERE, A TAP SINGS OPERA. THE GREENHOUSE STOVE GURGLES A WARNING. WRONG VALVE — THE HOUSE END IS STILL HIDING.",
    // game.js line 4381 · turnValve
    constanceArrivingWithA: [
      "CONSTANCE, ARRIVING WITH A WRENCH AND THE AIR OF A WOMAN WHO HAS READ THE MANUAL: THAT ONE IS THE HOUSE. THIS ONE — THIS ONE IS THE FIELD.",
      "THE VALVE TURNS. UNDER THE BARN, UNDER THE YARD, A PIPE FULL OF YEARS CLEARS ITS THROAT — AND WATER RUNS TO THE FIELD LIKE IT REMEMBERS THE WAY. THE PIPE IS IN.",
    ],
  },

  // ======================================================================
  // TARPS AND MULCH
  // ======================================================================
  tarp: {
    // game.js line 4386 · orderMulch
    orderedItWillArrive: "ORDERED. IT WILL ARRIVE BY MORNING, THE WAY MULCH DOES: QUIETLY, AND ALL AT ONCE.",
    // game.js line 4392 · layTarp
    theTarpTearsOn: "THE TARP TEARS ON A HIDDEN STONE — OF COURSE IT DOES, ON THE LAST STRETCH. IT WILL NEED A PATCH BEFORE IT COOKS.",
    // game.js line 4393 · layTarp
    tarpDownTheDark: "TARP DOWN. THE DARK BEGINS ITS SLOW ARGUMENT.",
    // game.js line 4400 · patchTarp
    patchedTheDarkResumes: "PATCHED. THE DARK RESUMES.",
    // game.js line 4406 · moveTarp
    tarpMovedAndFolded: "TARP MOVED AND FOLDED. SECTION {bi}1 IS CLEAR GROUND, READY FOR ROOTS. ({length} OF 5)",
  },

  // ======================================================================
  // THE FIELD — rows, harvest, visits, small ceremonies
  // ======================================================================
  field: {
    // game.js line 4260 · stakeField
    stakingDayTwelveRows: [
      "STAKING DAY. TWELVE ROWS, SIX FEET APART, IN A SQUARE SEVENTY-FIVE FEET BY — JEREMIAH, HOW MANY PACES?",
      "JEREMIAH: FORTY-ONE. OR NINETY. THE PACES WERE ALL DIFFERENT SIZES. SOME OF THEM WERE SKIPS.",
      "ZOEY: IT IS EXACTLY ONE HUNDRED OF MY FEET. I COUNTED TWICE AND GOT TWO NUMBERS, BUT THEY WERE BOTH CONFIDENT.",
      "THE STAKES GO IN ANYWAY. THE SQUARE HOLDS. SOME DREAMS HAVE CORNERS, AND THE CORNERS ARE NOW MARKED WITH STRING.",
    ],
    // game.js line 4410 · fieldInteract
    theFieldWaitingOn: "THE FIELD, WAITING ON THE GLASS HOUSE. FIRST THE PLANTS LIVE. THEN THE FIELD.",
    // game.js line 4412 · fieldInteract
    theOldBuriedLine: "THE OLD BURIED LINE RUNS FROM HERE, QUIET AND FULL OF ITSELF.",
    // game.js line 4414 · fieldInteract
    theBadShedS: "THE BAD SHED'S CORNER, WHERE THE GROUND DIPS LIKE IT IS KEEPING SOMETHING.",
    // game.js line 4414 · fieldInteract
    dig: [
      "DIG",
      "NOT YET",
    ],
    // game.js line 4416 · fieldInteract
    thePipeIsFound: "THE PIPE IS FOUND. THE HOUSE END STILL HIDES ITS VALVE — SOMEWHERE IN THE BARN, AMONG ITS PLUMBING.",
    // game.js line 4419 · fieldInteract
    theMulchPileIs: "THE MULCH PILE IS A MEMORY. A DELIVERY CAN BE ARRANGED — MULCH FINDS ITS WAY TO FIELDS LIKE NEWS TO A SMALL TOWN.",
    // game.js line 4419 · fieldInteract
    arrangeADelivery: [
      "ARRANGE A DELIVERY",
      "NOT YET",
    ],
    // game.js line 4420 · fieldInteract
    theMulchPileMulch: "THE MULCH PILE: {mulch} CARTLOADS OF TOMORROW'S INSURANCE, SMELLING OF RAIN AND WOOD.",
    // game.js line 4430 · fieldInteract
    harvestTheRow: "HARVEST THE ROW",
    // game.js line 4431 · fieldInteract
    pruneTheRow: "PRUNE THE ROW",
    // game.js line 4432 · fieldInteract
    pullTheWeedsLevel: "PULL THE WEEDS (LEVEL {lv})",
    // game.js line 4433 · fieldInteract
    waterTheRow: "WATER THE ROW",
    // game.js line 4434 · fieldInteract
    mulchIt3Carts: "MULCH IT (3 CARTS)",
    // game.js line 4435 · fieldInteract
    feedTheRow9: "FEED THE ROW (9 COMPOST)",
    // game.js line 4437 · fieldInteract
    weedsAtLevelLv: "WEEDS AT LEVEL {lv} IN THIS SECTION. ",
    // game.js line 4437 · fieldInteract
    theSectionIsClean: "THE SECTION IS CLEAN. ",
    // game.js line 4437 · fieldInteract
    line: "…",
    // game.js line 4437 · fieldInteract
    rowRnLengthBushes: "ROW {rn}: {length} BUSHES. {v}{v2}{joinVal}{v3}",
    // game.js line 4442 · fieldInteract
    rowRnWateredBush: "ROW {rn} WATERED, BUSH BY BUSH, NAME BY NAME.",
    // game.js line 4448 · fieldInteract
    tarpSectionBi1: "TARP SECTION {bi}1 OF 5. BLACK PLASTIC OVER LIVING GROUND: FOUR DAYS OF DARK, AND THE WEEDS UNDER IT GIVE UP THEIR NAMES.",
    // game.js line 4448 · fieldInteract
    layTheTarp: [
      "LAY THE TARP",
      "NOT YET",
    ],
    // game.js line 4449 · fieldInteract
    theTornSectionA: "THE TORN SECTION. A PATCH, A PRAYER, AND IT COOKS LIKE THE REST.",
    // game.js line 4449 · fieldInteract
    patchIt: [
      "PATCH IT",
      "NOT YET",
    ],
    // game.js line 4450 · fieldInteract
    theTarpCooksDay: "THE TARP COOKS. DAY {minVal} OF 4. UNDERNEATH, A SMALL DARK SUMMER IS ENDING THINGS.",
    // game.js line 4451 · fieldInteract
    cookedThroughWhatLives: "COOKED THROUGH. WHAT LIVES UNDER THERE NOW IS SOIL AND SILENCE.",
    // game.js line 4451 · fieldInteract
    moveTheTarp: [
      "MOVE THE TARP",
      "NOT YET",
    ],
    // game.js line 4453 · fieldInteract
    emptyGroundRowRn: "EMPTY GROUND, ROW {rn}, AND THE WEEDS ARE MOVING IN AT LEVEL {lv}.",
    // game.js line 4453 · fieldInteract
    pullTheWeeds: [
      "PULL THE WEEDS",
      "NOT YET",
    ],
    // game.js line 4456 · fieldInteract
    emptyGroundRowRn_2: "EMPTY GROUND, ROW {rn}, AND THE NURSERY SHELF HOLDS {length} BUSHES READY FOR REAL GROUND.",
    // game.js line 4456 · fieldInteract
    plantTheNurseryStock: [
      "PLANT THE NURSERY STOCK",
      "NOT YET",
    ],
    // game.js line 4458 · fieldInteract
    clearGroundRowRn: "CLEAR GROUND, ROW {rn}. IT WANTS MULCH BEFORE IT WANTS PLANTS.",
    // game.js line 4458 · fieldInteract
    mulchIt3Carts_2: [
      "MULCH IT (3 CARTS)",
      "NOT YET",
    ],
    // game.js line 4459 · fieldInteract
    rowRnReadyThe: "ROW {rn}, READY. THE PLANTING GATE AT THE FENCE KNOWS WHAT REMAINS.",
    // game.js line 4463 · mulchRow
    notEnoughMulchThe: "NOT ENOUGH MULCH. THE PILE AT THE FIELD'S CORNER KEEPS THE COUNT: {mulch} CARTS.",
    // game.js line 4467 · mulchRow
    rowRnMulchedThree: "ROW {rn} MULCHED — THREE CARTLOADS DEEP. DRY DAYS WILL HAVE TO GO AROUND.",
    // game.js line 4664 · pullWeeds
    thisSectionIsClean: "THIS SECTION IS CLEAN. THE WEEDS ARE ELSEWHERE, BEING SOMEONE ELSE'S PROBLEM. SPECIFICALLY: FRANK'S, IN ANOTHER SECTION.",
    // game.js line 4670 · pullWeeds
    constanceKneelingLikeA: "CONSTANCE, KNEELING LIKE A WOMAN BORN TO IT: NOT LIKE THAT. YOU ARE HARVESTING TOPS AND LEAVING ROOTS — THAT IS NOT WEEDING, THAT IS HAIRCUTS.",
    // game.js line 4670 · pullWeeds
    constanceDownLeverageThe: "CONSTANCE: DOWN. LEVERAGE. THE WHOLE ROOT, WITH ITS LITTLE WHITE BEARD. A WEED PULLED RIGHT IS A WEED RETIRED. (+{pay} COMPOST)",
    // game.js line 4672 · pullWeeds
    pulledRootsAndAll: "PULLED, ROOTS AND ALL. SECTION {sec}1 DROPS TO LEVEL {v}. (+{pay} COMPOST)",
    // game.js line 4676 · feedRow
    aRowFeedingTakes: "A ROW FEEDING TAKES 9 COMPOST. THE PILE SAYS {compost}.",
    // game.js line 4680 · feedRow
    rowRnFedNine: "ROW {rn} FED — NINE COMPOST WORKED IN AROUND THE ROOTS. THE BUSHES STAND LIKE THEY HAVE HEARD GOOD NEWS. (YIELD RATING {yieldRating} FOR THE SEASON)",
    // game.js line 4684 · proudWeedInteract
    theProudWeedLies: "THE PROUD WEED LIES IN THREE PIECES, STILL PROUD. THE BURN PILE BY THE DRIVE WAITS FOR DUSK WORK.",
    // game.js line 4689 · proudWeedInteract
    threeChopsAndThe: [
      "THREE CHOPS, AND THE PROUD WEED — EIGHT FEET OF POISONOUS CONFIDENCE, SPARED ONCE OUT OF RESPECT — COMES DOWN LIKE A TREE IN A SMALL FOREST.",
      "IT GOES TO THE BURN PILE BY THE DRIVE. ROOTS AND ALL, IT BURNS AT DUSK. SOME PLANTS YOU ADMIRE. SOME YOU ANSWER.",
    ],
    // game.js line 4691 · proudWeedInteract
    chopChopsOf3: "CHOP {chops} OF 3. THE PROUD WEED SHUDDERS AND STANDS. IT HAS BEEN SPARED BEFORE. IT EXPECTS IT AGAIN.",
    // game.js line 4697 · burnPileInteract
    theBurnPileAt: [
      "THE BURN PILE AT DUSK: THE PROUD WEED GOES IN WITH ITS ROOTS, AND THE FAMILY WATCHES THE WAY YOU WATCH WEATHER LEAVE.",
      "THE ROOTS' PLACE BY THE FENCE IS MARKED IN THE REGISTER. THINGS THAT ARE ANSWERED CAN STILL BE REMEMBERED.",
      "FRANK, INTO THE DUSK: THE GROUND GIVES THORNS AS WELL AS FRUIT. IT ALWAYS HAS. THE WORK IS STILL GOOD.",
      "CONSTANCE: STRAWBERRIES NEXT, FRANK. SOMETHING SWEET, AFTER ALL THAT.",
    ],
    // game.js line 4699 · burnPileInteract
    theBurnPileEvery: "THE BURN PILE. EVERY FIELD KEEPS ONE: A PLACE WHERE THE YEAR'S ARGUMENTS GO TO BECOME ASH AND, EVENTUALLY, SOIL.",
    // game.js line 4704 · strawberryInteract
    theStrawberryPatchFour: "THE STRAWBERRY PATCH: FOUR CLUMPS, SETTLED IN, ALREADY PLANNING THEIR RUNNERS.",
    // game.js line 4710 · strawberryInteract
    strawberryClumpLength1: "STRAWBERRY CLUMP {length}1 OF 4 GOES IN BY THE BARN, NAMED {name} ON THE SPOT. STRAWBERRIES DO NOT STAY WHERE YOU PUT THEM. THEY SEND RUNNERS, CLAIM GROUND, AND CALL IT HOME. FRANK RESPECTS THE STRATEGY.",
    // game.js line 4718 · butterflyPlant
    theButterflyBushGoes: [
      "THE BUTTERFLY BUSH GOES IN BY OMA'S PATIO, WHERE SHE DIRECTED, ON THE ANNIVERSARY OF THE DAY THE HOUSE LOST OPA AND KEPT EVERYTHING HE PLANTED.",
      "IT CARRIES THE NAME OPA GAVE IT IN THE OLD GARDEN: LAMPLIGHT. FRANK DOES NOT RENAME GIFTS. SOME NAMES ARE NOT HIS TO IMPROVE.",
      "OMA, FROM THE DOOR: HE WOULD HAVE PRETENDED NOT TO WATCH IT BLOOM. HE WOULD HAVE WATCHED IT EVERY DAY.",
    ],
    // game.js line 4787 · forsythiaPlant
    theForsythiaGoesIn: [
      "THE FORSYTHIA GOES IN WHERE OMA DIRECTED — IN SIGHT OF HER WINDOW, ON THE PATH SHE WALKS, WHERE SPRING WILL HAVE TO INTRODUCE ITSELF TO HER FIRST.",
      "SHE NAMED IT HERSELF, FROM THE DOOR, WITHOUT BEING ASKED TWICE: VESPER. BECAUSE IT WILL GLOW AT DUSK, SHE SAYS, LIKE A LAMP LIT FOR VESPERS.",
      "FRANK DIGS. THE NAMING, FOR ONCE, WAS NOT HIS TO DO, AND THE HOLE IS BETTER FOR IT.",
    ],
    // game.js line 4885 · pruneRow
    rowRnIsPruned: "ROW {rn} IS PRUNED FOR THIS WINTER. THE CANES STAND COUNTED: SEVEN TO TEN, THE CROSSING WOOD GONE.",
    // game.js line 4888 · pruneRow
    row1PrunedAll: "ROW 1 PRUNED, ALL SIX TOGETHER, THE WAY THEY DO EVERYTHING. KEEP SEVEN TO TEN CANES; THE CROSSING WOOD GOES FIRST. THE ROW WILL REMEMBER IT IN THE YIELD.",
    // game.js line 4888 · pruneRow
    rowRnPrunedKeep: "ROW {rn} PRUNED. KEEP SEVEN TO TEN CANES; THE CROSSING WOOD GOES FIRST. NEXT YEAR'S YIELD WILL TELL THE STORY.",
    // game.js line 4893 · plantNurseryRow
    theNurseryShelfHolds: "THE NURSERY SHELF HOLDS NO ONE READY FOR REAL GROUND.",
    // game.js line 4896 · plantNurseryRow
    lengthBushesGoInto: "{length} BUSHES GO INTO ROW {rn} FROM THE NURSERY STOCK. THE ROW FILLS THE WAY A FAMILY DOES: QUIETLY, AND THEN ALL AT ONCE.",
    // game.js line 4900 · sowTrayLT
    theTrayIsAlready: "THE TRAY IS ALREADY SOWN. WINTER WILL DO ITS SLOW WORK.",
    // game.js line 4901 · sowTrayLT
    theTrayIsSown: "THE TRAY IS SOWN IN WINTER. THE FRIDGE KEEPS THE SEEDS' CALENDAR, AND IT IS NOT WINTER.",
    // game.js line 4903 · sowTrayLT
    fortySeedsIntoThe: "FORTY SEEDS INTO THE TRAY, AND THE TRAY INTO THE FRIDGE, TO DREAM OF WINTER FROM INSIDE IT. THE PIPELINE RUNS FOREVER NOW. THAT IS THE POINT OF IT.",
    // game.js line 4917 · potUpLT
    madePottedUpAnd: "{made} POTTED UP AND SET ON THE BENCH — NURSERY STOCK, IN THE COMPANY'S WAY. THE SHELF FILLS AGAIN. IT ALWAYS FILLS AGAIN.",
    // game.js line 4921 · shareStand
    theStandHasShared: "THE STAND HAS SHARED THIS YEAR'S SURPLUS ALREADY. THE ROAD EATS WELL. THE SIGN BY THE GATE SAYS SO, IN FRANK'S BEST PAINT.",
    // game.js line 4923 · shareStand
    noSurplusYetThis: "NO SURPLUS YET THIS YEAR. THE STAND WAITS, SIGN PAINTED, BASKETS READY.",
    // game.js line 4925 · shareStand
    lbsLbsGoDown: "{lbs} LBS GO DOWN THE ROAD IN BASKETS — NEIGHBOURS, THE CHURCH TABLE, ANYONE WHO DRIVES SLOW PAST THE SIGN. THE CELLAR PAGE KEEPS THE COUNT: {shared} LBS SHARED, ALL TOLD.",
    // game.js line 6544 · harvestRow
    rowRnIsPicked: "ROW {rn} IS PICKED CLEAN FOR THIS YEAR. THE BUSHES REST, SMUG AND EMPTY.",
    // game.js line 6545 · harvestRow
    rowRnSFruit: "ROW {rn}'S FRUIT FELL AND WAS GATHERED BY THE GROUND. IT IS NOTED WITHOUT GUILT. THE BIRDS FILED A THANK-YOU.",
    // game.js line 6547 · harvestRow
    rowRnIsNot: "ROW {rn} IS NOT RIPE. THE BERRIES ARE STILL ARGUING ABOUT COLOUR.",
    // game.js line 6557 · harvestRow
    nameTofixedvalLbsInto: "{name}: {toFixedVal} LBS, INTO THE ROW 1 BOWL.",
    // game.js line 6564 · harvestRow
    theEmptyPlaceWhere: "THE EMPTY PLACE WHERE {name} STOOD: A QUIET LINE, A MARKER BRUSHED CLEAN, A BOWL WITH ROOM IN IT.",
    // game.js line 6565 · harvestRow
    lilyFeriesTheSmall: "LILY FERIES THE SMALL BOWL TO THE BARN WITH BOTH HANDS AND TOTAL SERIOUSNESS. NOT ONE BERRY IS LOST. THIS IS CHECKED. THIS IS PRAISED.",
    // game.js line 6567 · harvestRow
    rowRnHarvestedTofixedval: "ROW {rn} HARVESTED: {toFixedVal} LBS. THE BASKET COUNTER BY THE BARN DOOR READS {toFixedVal2} LBS FOR THE YEAR.",
    // game.js line 6570 · harvestRow
    frankAtTheFence: "FRANK, AT THE FENCE, DOING ARITHMETIC THE WAY OTHER MEN DO PRAYER: NINE HUNDRED POUNDS. THE BOOK SAYS A WINEMAKER WANTS NINE HUNDRED POUNDS.",
    // game.js line 6570 · harvestRow
    atThisManyBushes: "AT THIS MANY BUSHES, AT THIS WEIGHT APIECE — NOT THIS YEAR. NOT YET. THE FIELD IS YOUNG, THE ROWS ARE NOT ALL PLANTED, AND THE BUSHES ARE STILL BECOMING. BUT THE NUMBER IS WRITTEN DOWN NOW, WHERE NUMBERS BECOME PLANS.",
    // REVISION (Nov 27, 2026) — rows counted, and the event-Favorites
    // named out of them at their beats.
    rowCountHead: "ROW {rn}: {n} BUSHES.{v}{v2}",
    firstFruitNamed: "FRANK STOPS, MID-PICKING, WITH THE FIRST BERRY OF THE ROW IN HIS HAND — AND NAMES THE BUSH IT CAME FROM: {name}. IT FED THEM FIRST. HE EATS IT STANDING RIGHT THERE IN THE ROW, AND SAYS THANK YOU, LORD, WITH HIS MOUTH FULL. INTO THE BOWL, AND INTO THE BOOK.",
    frostSurvivorNamed: "AT THE RECKONING, FRANK WALKS ROW {rn} AND STOPS AT THE BUSH THAT WENT INTO THE FROST HURTING AND CAME OUT THE OTHER SIDE. HE NAMES IT ON THE SPOT: {name}. IT SUFFERED, AND IT LIVED.",
    alvinPlantNamed: "ALVIN HAS SAT BESIDE ONE BUSH IN ROW {rn} SO MANY MORNINGS THAT THE GRASS THERE IS FLAT. FRANK FINALLY NOTICES, AND NAMES THE BUSH HIS DOG CHOSE: {name}. THE DOG GETS THE LAST VOTE.",
    rowHarvestedCount: "ROW {rn}'S BUSHES GIVE {toFixedVal} LBS BETWEEN THEM.",
  },

  // ======================================================================
  // PLANTING DAY AND REPOTTING
  // ======================================================================
  planting: {
    // game.js line 4493 · doPlanting
    plantingDayTheAuger: [
      "PLANTING DAY. THE AUGER SINGS. JEREMIAH WORKS ALONGSIDE, QUIET IN THE WAY OF A BOY WHO KNOWS THIS MATTERS.",
      "ZOEY IS ALREADY IN THE HOUSE, HAVING GONE IN EARLY WITHOUT ANY DRAMA AT ALL, TAKING THE SMALL ONES WITH HER LIKE A PARADE.",
    ],
    // game.js line 4519 · repot
    theFriendAgainRolling: [
      "THE FRIEND AGAIN, ROLLING UP THE DRIVE WITH A TRUCK BED OF DIRT AND THE AIR OF A MAN DELIVERING WEATHER.",
      "THE GARDENING FRIEND: YOUR PLANTS ARE NOT DYING OF HEAT, FRANK. THEY ARE DYING OF HUNGER IN A PLASTIC WORLD. PLANTS NEED DIRT. REAL DIRT, ALL THE WAY DOWN.",
      "SO THEY REPOT. EVERY PLANT, OUT OF ITS LITTLE WORLD AND INTO A BIGGER ONE, WITH DIRT LIKE A COUNTRY. IT TAKES ALL DAY. IT TAKES ALL OF EVERYONE.",
    ],
    // game.js line 4471 · plantingGate
    recoveryVOf5: "RECOVERY: {v} OF 5 FED DAYS SINCE THE REPOTTING",
    // game.js line 4474 · plantingGate
    andVMoreAre: " AND {v} MORE ARE",
    // game.js line 4474 · plantingGate
    nameVStillDeclining: "{name}{v} STILL DECLINING — WATER AND DIRT, AND TIME",
    // game.js line 4475 · plantingGate
    tarpLengthOf4: "TARP: {length} OF 4 SECTIONS CLEARED",
    // game.js line 4476 · plantingGate
    fenceLengthOf4: "FENCE: {length} OF 4 SEGMENTS (3 WILL DO)",
    // game.js line 4478 · plantingGate
    mulchRowsJoinvalStill: "MULCH: ROWS {joinVal} STILL BARE",
    // game.js line 4484 · doPlanting
    notYetTheField: "NOT YET. THE FIELD KEEPS ITS OWN CHECKLIST:",
    // game.js line 4496 · doPlanting
    atTheHeadOf: "AT THE HEAD OF ROW 1, FRANK READS THE GENERAL'S LINE IN THE REGISTER ALOUD, EVERY WORD, AND SETS A FLAT STONE WHERE THE BOOKEND WOULD HAVE STOOD.",
    // game.js line 4496 · doPlanting
    constanceHeGuardsThe: "CONSTANCE: HE GUARDS THE ROW ANYWAY. FRANK: HE DOES. HE ALWAYS DID LIKE THE END WITH THE VIEW.",
    // game.js line 4500 · doPlanting
    theGeneralGoesIn: "THE GENERAL GOES IN FIRST, AT THE HEAD OF ROW 1 — THE BOOKEND, WHERE HE HAS ALWAYS STOOD IN EVERY LINE THIS FAMILY MAKES.",
    // game.js line 4512 · doPlanting
    theCompanyGoesInto: "THE COMPANY GOES INTO ROWS 2 THROUGH 7, BY VARIETY, IN THE ORDER OF THEIR STRENGTH. THEY GO IN AS COMPANIES, NOT AS NAMES — THE FIELD WILL TEACH FRANK WHO THEY ARE, ONE AT A TIME, AS THINGS HAPPEN TO THEM.",
    // game.js line 4513 · doPlanting
    andInTheHeat: "AND IN THE HEAT OF THE AFTERNOON FRANK NEARLY INSISTS JEREMIAH STAY AND FINISH — AND CATCHES HIMSELF, MID-SENTENCE, LIKE A MAN STEPPING BACK FROM A LEDGE HE BUILT.",
    // game.js line 4513 · doPlanting
    frankGoInWhen: "FRANK: GO IN WHEN YOU ARE READY, SON. THE ROW WILL KEEP. (JEREMIAH STAYS A WHILE ANYWAY — HIS OWN CHOICE, WHICH IS A DIFFERENT AND BETTER THING — AND THEN GOES IN, BLESSED AND UNHURRIED.)",
    // game.js line 4529 · repot
    nameWasFedIn: "{name} WAS FED IN TIME — PULLED BACK IN THE REPOTTING, SORE AND ALIVE.",
    // game.js line 4530 · repot
    constanceSHandsFind: "CONSTANCE'S HANDS FIND {name} IN THE FIRST HOUR AND DO NOT LET GO UNTIL IT IS IN DIRT AND DRINKING.",
    // game.js line 4534 · repot
    constanceQuietlyOverName: "CONSTANCE, QUIETLY, OVER {name}'S HUSK: HE HELD ON LONGER THAN ANY OF THEM. REMEMBER THAT PART TOO, FRANK. (IT IS WRITTEN IN THE REGISTER, IN THE BACK, WHERE THE MEMORIALS LIVE.)",
    // game.js line 4539 · repot
    andBeforeTheFriend: "AND BEFORE THE FRIEND LEAVES: A BUSH FROM HIS OWN FIELD, IN A BUCKET, WITH ITS NAME ALREADY ON IT — {name}. SOME GIFTS YOU DO NOT ARGUE WITH. YOU WATER THEM.",
    // game.js line 4540 · repot
    theGlassHouseBreathes: "THE GLASS HOUSE BREATHES DIFFERENTLY BY EVENING. NOW: FIVE DAYS OF FEEDING AND WATER, WHILE THE FIELD GETS ITS TARP, ITS PIPE, ITS MULCH, ITS FENCE. THEN — PLANTING.",
    // REVISION (Nov 27, 2026) — the crisis takes the Company by count.
    companyToll: "THE COMPANY PAYS THE HARD SPRING'S TOLL: {n} LOST, {left} LEFT. THEY ARE COUNTED IN THE BOOK, IF NOT NAMED — AND THEY COUNT.",
    companyTollRescued: "THE COMPANY WAS CARRIED THROUGH THE HARD SPRING: {n} LOST, {left} LEFT — AND THE ONES LEFT ARE HERE BY THE LORD'S MERCY, AND DIRT, AND WATER, AND CONSTANCE'S HANDS.",
    companyDeclining: "THE COMPANY IS STILL DECLINING — WATER, AND TIME",
    companyTooYoung: "THE COMPANY IS NOT SEEDLINGS YET — WATER AND TIME",
  },

  // ======================================================================
  // CARRYING PLANTS AND WATERING ROOMS
  // ======================================================================
  carry: {
    // game.js line 4184 · waterLocation
    wateredAllOfThem: "WATERED, ALL OF THEM. {n} DRINKS POURED.",
    // game.js line 4184 · waterLocation
    everyoneHereIsAlready: "EVERYONE HERE IS ALREADY WATERED.",
    // game.js line 4195 · carryPlants
    theLastLoadGoes: [
      "THE LAST LOAD GOES OVER. JEREMIAH CARRIES TWO AND SUPERVISES THE REST LIKE A SMALL FOREMAN.",
      "THE GREENHOUSE IS FULL OF QUIET GREEN. TONIGHT IS ITS FIRST NIGHT — AND THE RADIO SAYS COLD.",
      "LIGHT THE LITTLE STOVE BEFORE DARK, OR TRUST THE GLASS. (THE STOVE IS THE BETTER BET.)",
    ],
    // game.js line 4197 · carryPlants
    aLoadGoesOver: "A LOAD GOES OVER: {joinVal}. JEREMIAH WALKS THE PATH LIKE IT IS A PARADE ROUTE.",
    // game.js line 4197 · carryPlants
    leftStillWaitOn: "{left} STILL WAIT ON THE SHELF.",
    // game.js line 4251 · chooseLoadOrder
    thePlantsRideFirst: [
      "THE PLANTS RIDE FIRST — IN THE CAB, IN BOXES, IN FRANK'S LAP, IN DESCENDING ORDER OF FRAGILITY AND ASCENDING ORDER OF VOLUME.",
      "THE FURNITURE CAN WAIT A DAY. IT HAS WAITED THIS LONG. THE PLANTS MOVE INTO THE BARN OFFICE BY SUPPERTIME.",
    ],
    // game.js line 4254 · chooseLoadOrder
    theFurnitureRidesFirst: [
      "THE FURNITURE RIDES FIRST. THE PLANTS WILL SPEND ONE NIGHT IN THE EMPTY HOUSE.",
      "FRANK: ONE NIGHT. THEY WILL BE FINE. (HE WILL THINK ABOUT IT ALL NIGHT. HE IS THINKING ABOUT IT NOW.)",
    ],
  },

  // ======================================================================
  // CHAPTER OPENINGS — the first words of each chapter
  // ======================================================================
  openings: {
    // game.js line 4545 · ch6Opening
    thePromiseIsWritten: [
      "THE PROMISE IS WRITTEN. SPRING COMES TO BERRYHILL LIKE IT MEANS IT.",
      "AND IN THE GLASS HOUSE, UNDER A SUN THAT HAS SUDDENLY REMEMBERED ITS STRENGTH, THE PLANTS BEGIN TO WILT.",
    ],
    // game.js line 4611 · ch7Opening
    theFieldSettlesInto: [
      "THE FIELD SETTLES INTO ITS FIRST SUMMER LIKE IT HAS ALWAYS BEEN THERE.",
      "THE GREENHOUSE SHELF HOLDS THE LITTLE ONES NOW — THE NURSERY, FORMALLY, AS OF THIS WEEK. FRANK HAS MADE A SIGN. THE SIGN HAS A BORDER. THE BORDER HAS RULES.",
    ],
    // game.js line 4723 · ch8Opening
    theFieldIsPlanted: [
      "THE FIELD IS PLANTED, AND NOW THE FIELD IS CONTESTED. THE WEEDS HAVE READ THE SAME CALENDAR AS EVERYONE ELSE.",
      "SIX SECTIONS. LEVELS OF OCCUPATION. CONSTANCE CALLS IT THE LONG WAR, AND SHE DOES NOT SMILE WHEN SHE SAYS IT, WHICH IS HOW FRANK KNOWS TO TAKE IT SERIOUSLY.",
    ],
    // game.js line 4790 · ch9Opening
    yearThreePutsOn: [
      "YEAR THREE PUTS ON ITS COAT. THE FIELD HAS SURVIVED A WAR AND A WINTER, AND THE BUSHES ARE ROUND WITH BUDS LIKE HELD BREATH.",
      "OMA HAS A REQUEST, AND A SPOT PICKED OUT, AND A NAME READY. VISIT HER.",
    ],
    // game.js line 4930 · ltOpening
    theStoryIsDone: [
      "THE STORY IS DONE, AND THE FIELD IS NOT. THAT IS THE BEST KIND OF ENDING: THE KIND YOU GET TO KEEP LIVING IN.",
      "THE SEASONS WILL KEEP THEIR ROUNDS — BLOSSOM, FRUIT, WINE, PRUNING, SNOW — AND THE REGISTER KEEPS ITS BACK PAGE OPEN, WITH GOALS WRITTEN IN PENCIL AND STAMPS EARNED IN INK.",
      "TEND IT WELL. THERE IS NO LAST PAGE. THERE IS ONLY THE NEXT SEASON.",
    ],
    // game.js line 4997 · ch4Opening
    theGlassHouseIs: [
      "THE GLASS HOUSE IS SETTLED. THE FAMILY IS SETTLED. WHAT REMAINS IS THE FIELD ITSELF, AND A WINTER TO PLAN IN.",
      "STAKES. STRING. A TAPE MEASURE. AND A TOWN CLERK WITH A RULEBOOK — BUT FIRST, THE FIELD. THE GATE SWINGS BOTH WAYS NOW.",
    ],
    // game.js line 5017 · ch5Opening
    winterPlansBecomeSpring: [
      "WINTER PLANS BECOME SPRING WORK. THE DOWNSTAIRS IS FINISHED EXCEPT THE STAIRS — AN APARTMENT SHOULD BE REACHABLE FROM INSIDE ITS OWN HOUSE.",
      "THE STAIRS ARE UPSTAIRS, WHICH IS TO SAY: AT THE TOP OF THE STAIRS. FRANK WILL EXPLAIN THIS UNTIL IT IS TRUE.",
    ],
    // game.js line 5021 · ch3Opening
    theRentalIsSmall: [
      "THE RENTAL IS SMALL AND THE PLANTS HAVE THE WINDOW AND MOST OF THE TABLE.",
      "THE AGENT CALLS: HER FRIEND HAS HEARD OF A PLACE. A BARN, OUTSIDE A TOWN CALLED BERRYHILL. LAND WITH IT. A FIELD, EVEN.",
      "CONSTANCE: WE GO AND LOOK. QUIETLY. NO FALLING IN LOVE BEFORE THE ROOF IS INSPECTED.",
      "FRANK: AGREED. COMPLETELY. (HE IS ALREADY IN LOVE. THE GATE BY THE ROAD WILL TAKE YOU THERE.)",
    ],
    // game.js line 6587 · ch10Opening
    summerAndTheField: [
      "SUMMER, AND THE FIELD IS HEAVY WITH ITS FIRST REAL FRUITING — EVERY BUSH A SMALL ARGUMENT THAT THE WHOLE STORY WAS WORTH IT.",
      "FIRST, A REHEARSAL: A BATCH FROM BOUGHT FRUIT, AT THE BARN KITCHEN, TO LEARN ON BEFORE THE FIELD'S OWN BERRIES ARE ASKED TO PERFORM.",
    ],
    // game.js line 6638 · ch2Opening
    fallIsComingOn: [
      "FALL IS COMING ON. THE SIX ARE SEEDLINGS, AND THE SECOND PACKET HAD MORE TO SAY.",
      "FRANK: THE REST OF THE SEEDS NEED A WINTER FIRST. COLD, DARK, PATIENT. LIKE A FRIDGE, BUT WITH BEARS.",
      "CONSTANCE: THE FRIDGE WILL DO, FRANK. NO BEARS REQUIRED.",
      "AND THERE IS THE OTHER THING: THIS YARD IS LOVELY. IT IS ALSO SMALL.",
      "CONSTANCE: LAND, THEN. WE START LOOKING. QUIETLY. THE HOUSE, FRANK — INSIDE, WHERE THE FRIDGE IS.",
    ],
    // game.js line 6783 · startIntro
    constanceYourSeedsCame: [
      "CONSTANCE: YOUR SEEDS CAME, FRANK. SMALLER THAN I EXPECTED. SMALLER THAN SESAME SEEDS.",
      "FRANK: SMALLER THAN A SNEEZE, LOVE. ONE GOOD SNEEZE AND THE WHOLE FIELD IS GONE.",
      "FRANK: HALF OF THEM GO IN THE FRIDGE, TO SLEEP THROUGH A LITTLE WINTER AND WAKE UP READY.",
      "CONSTANCE: AND THE OTHER HALF?",
      "FRANK: PEAT POTS. TODAY. THE PACKET AND I HAVE OUR DIFFERENCES, SO WE HEDGE OUR BETS.",
      "CONSTANCE: SIX POTS, THEN. I WILL PRETEND THIS IS A NORMAL SIZE FOR A DREAM.",
      "FRANK: IT IS NOT THE SIZE OF THE START, LOVE. IT IS THAT WE START. THE FIELD WILL FIND US.",
      "ALVIN WAGS HIS WHOLE BACK HALF. HE HAS APPOINTED HIMSELF SUPERVISOR.",
      "WALK WITH THE ARROWS. PRESS A AT A PEAT POT TO PLANT A SEED.",
    ],
  },

  // ======================================================================
  // CHAPTER DAWN EVENTS — what the morning brings, chapter by chapter
  // ======================================================================
  dawns: {
    // game.js line 4559 · ch6Dawn
    waterThemTheBench: [
      "WATER THEM — THE BENCH IN THE GLASS HOUSE POURS FOR EVERYONE AT ONCE.",
      "THE VENT, OVER THE STOVE: OPEN IT AND LET THE HEAT OUT BY NAME.",
      "FEED THE WEAKEST GOOD DIRT. TRIAGE IS LOVE WITH A LIST.",
    ],
    // game.js line 4618 · ch7Dawn
    fallIsComingInto: [
      "FALL IS COMING INTO THE FIELD LIKE A RELATIVE WHO VISITS IN ORDER.",
    ],
    // game.js line 4826 · ch9Dawn
    theReckoningOfThe: [
      "THE RECKONING OF THE BLOSSOM.",
    ],
    // game.js line 4946 · ltDawn
    springAgainTrueAs: [
      "SPRING, AGAIN, TRUE AS A DOG. THE FORSYTHIA GOES FIRST, THE FIELD ANSWERS IN BLOSSOM, AND THE BEES FILE THEIR PAPERWORK.",
    ],
    // game.js line 4961 · ltDawn
    fallTheGiftBush: [
      "FALL. THE GIFT BUSH TURNS FIRST, DARK RED, THE WAY IT ALWAYS DOES NOW — SOME PLANTS BECOME THE CALENDAR.",
    ],
    // game.js line 4619 · ch7Dawn
    theGiftBushTurns: "THE GIFT BUSH TURNS FIRST — DARK RED, ALL AT ONCE, LIKE IT HEARD SOMETHING. THE REST OF THE FIELD TAKES NOTES.",
    // game.js line 4621 · ch7Dawn
    andInTheNursery: "AND IN THE NURSERY: {name}, THE SMALLEST, FOUND SHORN. CUT CLEAN, AT AN ANGLE, IN THE NIGHT. NO TRACKS. NO FUR. NO EXPLANATION.",
    // game.js line 4621 · ch7Dawn
    constanceWhateverItIs: "CONSTANCE: WHATEVER IT IS, IT IS SMALL, AND IT IS PRECISE, AND IT HAS STARTED WITH THE SMALLEST. SET A WATCH, FRANK.",
    // game.js line 4814 · ch9Dawn
    theMostTendedOf: "THE MOST-TENDED OF ALL OF THEM IS A NAME IN THE BACK PAGES NOW. THE MARKER GETS A MOMENT — ONE, GENTLE, BY NAME: {name}. THE FIELD REMEMBERS ITS OWN.",
    // game.js line 4815 · ch9Dawn
    andThenNameFound: "AND THEN: {name}, FOUND AT DAWN COVERED IN BLOSSOM — NOT A LEAF SHOWING, A BUSH MADE ENTIRELY OF FLOWER, LIKE IT WAS TRYING TO BE NOTICED BY HEAVEN.",
    // game.js line 4816 · ch9Dawn
    constanceQuietlyThatOne: "CONSTANCE, QUIETLY: THAT ONE NEARLY DIED IN A PLASTIC POT, FRANK. LOOK AT IT. JUST — LOOK AT IT.",
    // game.js line 4817 · ch9Dawn
    itIsWrittenIn: "IT IS WRITTEN IN THE REGISTER IN FRANK'S BEST HAND: COVERED IN BLOSSOM, SPRING YEAR 3.",
    // game.js line 4818 · ch9Dawn
    andOnTheWind: "AND ON THE WIND, FROM THE NORTH, A RUMOUR THE RADIO CONFIRMS BY NOON: A LATE FROST IS COMING. THREE NIGHTS OF IT. SET THE WATCH AT THE FIELD GATE — ONE ROW A NIGHT.",
    // game.js line 4828 · ch9Dawn
    firstTheLossesBy: "FIRST, THE LOSSES, BY NAME: {joinVal}. THEY ARE IN THE BACK PAGES NOW, WITH THE REST OF THE TRUTH.",
    // game.js line 4840 · ch9Dawn
    theFruitSetIs: "THE FRUIT-SET IS COUNTED AND WRITTEN DOWN, ROW BY ROW. WHAT THE BLOSSOM PROMISED, THE SUMMER WILL NOW BE ASKED TO KEEP.",
    // game.js line 4938 · ltDawn
    theTrayInThe: "THE TRAY IN THE FRIDGE HAS DONE ITS WINTER AND WANTS POTTING. THE GLASS HOUSE BENCH, WHEN YOU ARE READY.",
    // game.js line 4947 · ltDawn
    byTheFenceOne: "BY THE FENCE: ONE GREEN SHOOT, UP FROM THE PROUD WEED'S ROOTS. EVERY YEAR, ONE. THE FIELD KEEPS ITS APPOINTMENTS.",
    // game.js line 4948 · ltDawn
    aLetterComesFrom: "A LETTER COMES FROM THE TOWN, IN A KINDER HAND THAN LAST TIME: THE ORDINANCE HAS BEEN REVISITED. AN APPEAL MAY BE FILED. FRANK FILES IT BEFORE THE INK ON THE ENVELOPE IS DRY.",
    // game.js line 4949 · ltDawn
    theAppealIsHeard: "THE APPEAL IS HEARD. THERE ARE FORMS. THERE ARE ALWAYS FORMS. THE FORMS, THIS TIME, ARE LOSING.",
    // game.js line 4950 · ltDawn
    theAppealSucceedsTwo: "THE APPEAL SUCCEEDS. THE LORD SHUT THAT DOOR, AND NOW HE HAS OPENED IT AGAIN, IN HIS OWN TIME. TWO GOATS ARRIVE BY TRAILER, SURVEY THE PEN BY THE GOOD SHED LIKE SMALL LANDLORDS, AND APPROVE IT. THEY GET A PAGE IN THE REGISTER, UNDER GARDEN, WHERE THE JOY IS KEPT.",
    // game.js line 4962 · ltDawn
    theYearSWine: "THE YEAR'S WINE IS TASTED AT THE TABLE IN THE EVENING — THE PASTOR AND CONSTANCE AT THE TABLE, OMA'S GLASS SET OUT IN HER MEMORY, AND THE CELLAR PAGE'S VERDICT, KEPT.",
    // game.js line 6603 · ch10Dawn
    rowRnSFruit: "ROW {rn}'S FRUIT, UNHARVESTED, LET GO IN THE NIGHT AND FELL. IT IS NOTED WITHOUT GUILT. THE GROUND KEEPS WHAT THE GROUND IS GIVEN.",
    // game.js line 6606 · ch10Dawn
    theHarvestIsIn: "THE HARVEST IS IN: {toFixedVal} LBS FOR THE YEAR. NOW — BATCH TWO, FROM THE FIELD'S OWN FRUIT, AT YOUR OWN RATIO. THE KITCHEN WAITS, AND THE JOURNAL HOLDS THE LESSON.",
    // game.js line 4311 · ch5Dawn
    theStairsAreDone: [
      "THE STAIRS ARE DONE. THE HOUSE IS ONE HOUSE NOW, TOP TO BOTTOM.",
      "OMA COMES THIS WEEK. HER ROOM HAS ITS OWN DOOR AND, AS OF TODAY, STAIRS. SHE WILL PRETEND NOT TO BE PLEASED. SHE WILL FAIL.",
    ],
    // game.js line 4560 · ch6Dawn
    joinvalVSlippedIn: " {joinVal}{v} SLIPPED IN THE NIGHT.",
    // game.js line 4560 · ch6Dawn
    theyHeldThisTime: " THEY HELD, THIS TIME.",
    // game.js line 4560 · ch6Dawn
    theGlassHouseIs: "THE GLASS HOUSE IS AN OVEN THIS MORNING.{v}",
    // game.js line 4560 · ch6Dawn
    theCrisisHasThree: "THE CRISIS HAS THREE DAYS IN IT. THIS IS DAY {step}.",
    // game.js line 4564 · ch6Dawn
    aTruckRollsUp: [
      "A TRUCK ROLLS UP THE DRIVE: THE GARDENING FRIEND, WITH DIRT, AND OPINIONS, AND BOTH ARE NEEDED.",
      "THE GARDENING FRIEND: FRANK. YOUR PLANTS ARE STARVING IN PLASTIC. REPOT THEM — TODAY, ALL OF THEM. I BROUGHT THE DIRT. (THE REPOTTING WAITS AT THE GLASS HOUSE BENCH.)",
    ],
    // game.js line 4633 · ch7Dawn
    aQuietNightIn: [
      "A QUIET NIGHT IN THE NURSERY. ALVIN'S EARS TURNED LIKE DISHES ALL NIGHT, AND NOTHING CAME. OR NOTHING DARED.",
    ],
    // game.js line 4643 · ch7Dawn
    shornAgainNameThe: "SHORN AGAIN: {name}, THE SMALLEST LEFT. THE CUTS ARE CLEAN. THE NURSERY IS AFRAID IN A TIDY, ORGANIZED WAY.",
    // game.js line 4643 · ch7Dawn
    aQuietNight: "A QUIET NIGHT.",
    // game.js line 4643 · ch7Dawn
    setTheWatchWhere: "SET THE WATCH WHERE THE SMALLEST SLEEP. AT THE BARN DOOR, AT REST: THE NURSERY.",
    // game.js line 4732 · ch8Dawn
    everySectionAtZero: "EVERY SECTION AT ZERO. DAY {clearStreak} OF 7. THE FIELD BREATHES LIKE A HELD NOTE.",
    // game.js line 4766 · ch8Dawn
    aCarInThe: [
      "A CAR IN THE DRIVE BEFORE THE COFFEE IS: FRANK'S MOM, WITH A BASKET, A HAT, AND OPINIONS ABOUT THE DRIVEWAY PATCH.",
      "SHE WILL SORT PLANTS WITH FRANK TODAY — TEN OF THEM, BY THE DRIVE. SOME LESSONS ONLY ARRIVE IN PERSON, WITH A BASKET.",
    ],
    // game.js line 4800 · ch9Dawn
    firstYellow: [
      "FIRST YELLOW.",
      "OMA SEES IT FIRST — FROM HER WINDOW, BEFORE ANYONE IS AWAKE TO BE TOLD: THE FORSYTHIA, LIT LIKE A LAMP SOMEONE LEFT ON FOR A TRAVELLER.",
      "AND THEN, ROW BY ROW, THE FIELD ANSWERS: CLIMAX FIRST, THEN ECHO, THEN CHANDLER — BLOSSOM, ALL OVER, ALL AT ONCE, LIKE THE WHOLE FIELD EXHALED.",
      "BEES ARRIVE FROM NOWHERE IN PARTICULAR AND GET STRAIGHT TO WORK. WATER THE ROWS THIS WEEK. BLOSSOM IS THIRSTY WORK.",
      "OMA, FROM HER WINDOW, TO THE YARD AT LARGE: IT KEPT ITS APPOINTMENT. IN THE COLD. ON TIME. (SHE SAYS IT LIKE A WEATHER REPORT. SHE MEANS IT LIKE A CREED.)",
    ],
    // game.js line 4854 · ch9Dawn
    nightNightOfThe: "NIGHT {night} OF THE FROST, AND NO WATCH SET. THE COLD WALKS THE ROWS UNCHALLENGED, CHOOSING LIKE A SHOPPER.",
    // game.js line 4854 · ch9Dawn
    theFruitSetWill: "THE FRUIT-SET WILL REMEMBER IT. SET THE WATCH AT THE GATE TOMORROW — WHAT IS LEFT OF TOMORROW.",
    // game.js line 4958 · ltDawn
    summerTheFieldTurns: [
      "SUMMER. THE FIELD TURNS BERRY-DARK AND THE BASKET BY THE BARN DOOR EMPTIES ITS SHADOW INTO THE ROWS. HARVEST WHEN READY.",
    ],
    // game.js line 4969 · ltDawn
    winterTheFieldSleeps: [
      "WINTER. THE FIELD SLEEPS IN ROWS. PRUNE WHEN YOU ARE READY — SEVEN TO TEN CANES, THE CROSSING WOOD FIRST — AND LET THE TRAY DREAM IN THE FRIDGE.",
      "REST IS TENDING TOO. THE FIELD IS NOT BEING LAZY UNDER ITS BREATH, AND NEITHER, MOST YEARS NOW, IS FRANK.",
      "WHAT BELONGS TO THE LORD WILL GROW WHEN ITS SEASON COMES. FRANK'S PART IS TO WAIT WITHOUT SULKING. HE IS PRACTICING. HE IS, SLOWLY, GETTING BETTER AT IT.",
    ],
    // game.js line 4988 · ltDawn
    nineHundredPoundsThe: [
      "NINE HUNDRED POUNDS. THE NUMBER FRANK WROTE AT THE FENCE, IN THE YEAR OF THE FIRST HARVEST, IS A NUMBER THE FIELD HAS NOW PRODUCED IN A SINGLE YEAR.",
      "IT GOES IN THE REGISTER IN INK, WITH A STAMP: 900. SOME NUMBERS BECOME PLANS. SOME PLANS BECOME YEARS. THIS ONE BECAME BOTH — AND FRANK THANKS THE LORD FOR IT BEFORE THE INK IS DRY.",
    ],
    // game.js line 5008 · ch4Dawn
    theFenceWillNot: [
      "THE FENCE WILL NOT PRICE ITSELF. THE GOOD SHED HAS THE NOTES, AND FRANK HAS A PENCIL.",
    ],
    // game.js line 5025 · ch3Dawn
    aBarnLandA: [
      "A BARN. LAND. A FIELD. THE WORDS GO AROUND THE RENTAL LIKE A CAT AROUND A CHAIR.",
      "THE GATE BY THE ROAD, WHEN YOU ARE READY. CONSTANCE HAS ALREADY PACKED A TAPE MEASURE AND NO EXPECTATIONS.",
    ],
    // game.js line 5029 · ch3Dawn
    oneMoreHouseFails: [
      "ONE MORE HOUSE FAILS — A NICE HOUSE, WITH A YARD THE SIZE OF A RUG AND A NEIGHBOUR WITH A LEAF BLOWER AND A PHILOSOPHY.",
      "CONSTANCE: THE BARN, FRANK.",
      "FRANK: THE BARN WAS NEVER THE PLAN. THE FIELD WAS.",
      "CONSTANCE: THEY COME AS A SET. THEY ALWAYS DID. THIS WEEKEND, THEN. THE TRUCK COMES SATURDAY. THE HOUSE DOOR, BACK IN DEERBROOK, WHEN YOU ARE READY.",
      "CONSTANCE: AND HEAR THIS, FRANK — WE ASKED THE LORD FOR A PLACE, AND THIS IS THE ANSWER HE GAVE US. IT HAS A BARN IN IT. HE NEVER PROMISED IT WOULD LOOK LIKE WHAT WE PICTURED.",
    ],
    // game.js line 5036 · ch3Dawn
    thePlantsSpentThe: [
      "THE PLANTS SPENT THE NIGHT IN THE EMPTY HOUSE, IN THE COLD, AMONG THE ECHOES.",
      "THEY ARE ALIVE. THEY ARE FINE. FRANK HAS APOLOGIZED TO EACH OF THEM BY NAME ANYWAY, AND ONE OF THE APOLOGIES HAD A SMALL SPEECH IN IT.",
      "CONSTANCE: THEY FORGIVE YOU. PLANTS ARE LIKE THAT. NOW — A GLASS HOUSE FOR THEM, BEFORE ANYTHING ELSE.",
    ],
    // game.js line 5038 · ch3Dawn
    theFurnitureArrivesOn: [
      "THE FURNITURE ARRIVES ON THE SECOND LOAD, SLIGHTLY OFFENDED AND ENTIRELY INTACT.",
      "THE PLANTS ARE ALREADY ON THE OFFICE SHELF, ACTING LIKE THEY OWN THE BARN. NEXT: THE GREENHOUSE. ITS SITE IS STAKED, BY THE FIELD PATH.",
    ],
    // game.js line 6597 · ch10Dawn
    theFieldTurnsBerry: [
      "THE FIELD TURNS BERRY-DARK, ROW BY ROW, LIKE A PAGE BEING READ ALOUD. THE HARVEST IS ON. ROW 1 FIRST — BY NAME, INTO ITS OWN BOWL.",
    ],
    // game.js line 6645 · ch2Dawn
    theSummerPassesThe: [
      "THE SUMMER PASSES THE WAY SUMMERS DO — ALL AT ONCE, LOOKING BACK.",
      "FALL, THEN. THE SECOND PACKET COMES OUT OF THE DRAWER. THE FRIDGE GETS A TENANT.",
    ],
    // game.js line 6649 · ch2Dawn
    theSeedsWaitIn: [
      "THE SEEDS WAIT IN THEIR PACKET. THE FRIDGE, FRANK. COLD FIRST.",
    ],
    // game.js line 6652 · ch2Dawn
    theFirstHouseA: [
      "THE FIRST HOUSE: A FINE HOUSE. THE LAND WAS A POSTAGE STAMP WITH AMBITIONS.",
      "CONSTANCE: NEXT.",
    ],
    // game.js line 6653 · ch2Dawn
    theSecondHouseHad: [
      "THE SECOND HOUSE HAD LAND ENOUGH FOR A GOAT AND STRONG OPINIONS ABOUT BOTH. THE HOUSE ITSELF WAS LEANING. IT HAD A SLOPE AND A SMELL.",
      "CONSTANCE: NEXT.",
      "CONSTANCE: WE ASKED THE LORD FOR A PLACE, FRANK. NOW WE WAIT, AND TRUST HIM ABOUT THE WHEN. WE CAN KEEP ASKING. THAT PART IS OURS.",
    ],
    // game.js line 6656 · ch2Dawn
    theThirdHousePerfect: [
      "THE THIRD HOUSE: PERFECT LAND. ALSO A TRAIN, WITH RIGHT OF WAY THROUGH THE MIDDLE OF EVERYTHING.",
      "CONSTANCE: WE SELL THIS ONE FIRST. NO MORE FALLING FOR FIELDS WE CANNOT CARRY.",
      "FRANK: SELL THE HOUSE TO BUY THE LAND. WE PACK LIKE WE MEAN IT — ONE VAN LOAD A DAY. THE BOXES ARE BY THE STAIRS.",
    ],
    // game.js line 6664 · ch2Dawn
    inTheNightIn: [
      "IN THE NIGHT, IN THE COLD, IN THE DARK OF THE FRIDGE — EVERYTHING GERMATED. ALL OF IT. AT ONCE.",
      "FRANK: THEY ALL CAME UP! EVERY LAST ONE! IT IS A SMALL GREEN RIOT!",
      "CONSTANCE: THEN WE POT THEM UP, FRANK. ONE AT A TIME. AT THE SHELF, BY THE TRAY.",
      "FRANK: WITH NAMES. OBVIOUSLY. WITH NAMES.",
    ],
    // game.js line 6669 · ch2Dawn
    theRadioSaysA: [
      "THE RADIO SAYS A HARD FREEZE TONIGHT. THE SHELF CROWD WILL FEEL IT.",
      "A BLANKET OVER THE SHELF — AT THE GROW-LIGHT END OF IT — WOULD KEEP THE COLD OFF. OR ALVIN STANDS GUARD. HE WOULD PREFER TO STAND GUARD.",
    ],
  },

  // ======================================================================
  // WINE — the batches, the jar, the tasting
  // ======================================================================
  wine: {
    // game.js line 6577 · tasting
    aLateOctoberEvening: [
      "A LATE-OCTOBER EVENING. THE TABLE IS SET IN THE BARN: CONSTANCE, AND THE PASTOR — COME AT LAST TO TASTE WHAT THE FIELD HAS MADE, AS FRANK HAS BEEN PROMISING HIM ALL YEAR.",
    ],
    // game.js line 6497 · startBatchOne
    batchOneTheRehearsal: [
      "BATCH ONE: THE REHEARSAL. BOUGHT FRUIT — GOOD FRUIT, SOMEBODY ELSE'S FIELD — CRUSHED AT THE BARN KITCHEN, WITH A DASH OF HONEY. A DASH. FRANK MEASURED THE DASH WITH HIS HEART.",
      "CONSTANCE: A DASH IS NOT A MEASUREMENT, FRANK. FRANK: IT IS A MEASUREMENT OF ENTHUSIASM. (THE REGISTER RECORDS THE RATIO ANYWAY: 0.1. THE REGISTER HAS NO HEART.)",
      "THREE DAYS OPEN — SWISH IT DAILY AT THE KITCHEN — THEN IT SEALS ITSELF, AND THE LONG PATIENCE BEGINS.",
    ],
    // game.js line 6503 · startBatchTwo
    batchNTheField: "BATCH {n}: THE FIELD'S OWN FRUIT, AND FRANK'S OWN RATIO — {toFixedVal}, HONEY TO FRUIT, SET BY HAND AND WRITTEN IN THE REGISTER BEFORE THE JAR IS SEALED, SO NO ONE CAN LIE ABOUT IT LATER.",
    // game.js line 6503 · startBatchTwo
    twentyEightDaysSealed: "TWENTY-EIGHT DAYS SEALED, WHEN THE THREE OPEN DAYS ARE DONE. LATE SUMMER INTO FALL. THE JAR WILL KEEP. THE QUESTION IS WHETHER FRANK WILL.",
    // game.js line 6507 · swishJar
    theJarIsSealed: "THE JAR IS SEALED. SWISHING NOW WOULD BE THEATRE, AND NOT THE KIND THAT HELPS.",
    // game.js line 6509 · swishJar
    thriceSwishedTodayThe: "THRICE SWISHED TODAY. THE JAR IS AWAKE, AERATED, AND SLIGHTLY DIZZY. ENOUGH.",
    // game.js line 6511 · swishJar
    swishSwishesOf3: "SWISH {swishes} OF 3. THE MUST TURNS OVER LIKE A SLEEPER FINDING THE COOL SIDE OF THE PILLOW.",
    // game.js line 6515 · sealCheck
    stillOpen: "STILL OPEN.",
    // game.js line 6515 · sealCheck
    notBrewing: "NOT BREWING.",
    // game.js line 6515 · sealCheck
    noSealToCheck: "NO SEAL TO CHECK — THE JAR IS {v}",
    // game.js line 6517 · sealCheck
    sealWaterToppedMeniscus: "SEAL-WATER TOPPED, MENISCUS PERFECT, CONSCIENCE CLEAR. THE JAR SETTLES BACK INTO ITS LONG THOUGHT.",
    // game.js line 6521 · bottleJar
    notYetTheJar: "NOT YET. THE JAR IS STILL THINKING.",
    // game.js line 6527 · bottleJar
    batchOneBottledAnd: [
      "BATCH ONE, BOTTLED AND TASTED IN THE KITCHEN DOORWAY, STANDING UP, LIKE A VERDICT DELIVERED IN A HALLWAY.",
      "IT IS — THERE IS NO KINDER WORD, AND CONSTANCE TRIES THREE — TART. TART AS A GREEN APPLE'S OPINION OF YOU.",
      "CONSTANCE, KINDLY, WITH THE GLASS STILL IN HER HAND: IT IS THE HONEY, FRANK. A DASH IS A SEASONING. WINE WANTS A MEASURE — HALF TO FOUR-FIFTHS, HONEY AGAINST FRUIT, THE WAY THE OLD BOOKS SAY. BATCH TWO IS YOURS TO SET. THE FIELD WILL PROVIDE.",
      "THE LESSON GOES IN THE JOURNAL, IN INK: A DASH IS NOT A MEASUREMENT. AND NOW — THE HARVEST IS RIPE. ROW 1 FIRST, BY NAME, INTO ITS OWN BOWL.",
    ],
    // game.js line 6531 · bottleJar
    batchTwoBottledThe: "BATCH TWO, BOTTLED. THE VERDICT, BY THE FORMULA THE REGISTER KEEPS: {verdict}.",
    // game.js line 6531 · bottleJar
    theTastingIsSet: "THE TASTING IS SET FOR A LATE-OCTOBER EVENING: THE PASTOR AT THE TABLE, AND CONSTANCE WHERE SHE HAS STOOD FOR EVERY STEP OF IT — BESIDE FRANK. THE TABLE IN THE BARN WILL HOST IT.",
    // game.js line 6534 · bottleJar
    batchNBottledVerdict: "BATCH {n}, BOTTLED: {verdict}. THE CELLAR PAGE TAKES ANOTHER LINE, AND KEEPS IT FOREVER.",
    // game.js line 6578 · tasting
    theWineIsPoured: "THE WINE IS POURED. THE PASTOR HOLDS IT TO THE LIGHT LIKE A MAN WHO HAS BEEN HANDED A LETTER FROM A FRIEND.",
    // game.js line 6578 · tasting
    pastorLovelyOneWord: "PASTOR: LOVELY. (ONE WORD. IT IS ENOUGH. IT IS, IN FACT, THE WHOLE REVIEW.)",
    // game.js line 6578 · tasting
    constanceYouCanTaste: "CONSTANCE: YOU CAN TASTE THE FIELD IN IT. ALL THAT WORK, AND IT COMES UP THROUGH THE GLASS LIKE A REPORT. (SHE SAYS IT TO THE PASTOR. SHE LOOKS AT FRANK WHEN SHE SAYS IT.)",
    // game.js line 6579 · tasting
    theWineIsPoured_2: "THE WINE IS POURED. IT IS — THERE IS NO OTHER WORD — SWEET AS CANDY. CONSTANCE LAUGHS INTO HER GLASS, DELIGHTED AND BETRAYED IN EQUAL MEASURE.",
    // game.js line 6579 · tasting
    pastorTheChildrenAt: "PASTOR: THE CHILDREN AT THE HARVEST SUPPER WILL FIGHT OVER THIS, FRANK. THE ADULTS WILL PRETEND NOT TO.",
    // game.js line 6579 · tasting
    constanceYouHaveMade: "CONSTANCE: YOU HAVE MADE DESSERT, FRANK. THE FIELD SENT FRUIT AND YOU SENT BACK PUDDING. (SHE IS NOT, IT MUST BE SAID, REFUSING A SECOND GLASS.)",
    // game.js line 6580 · tasting
    theWineIsPoured_3: "THE WINE IS POURED. IT IS TART — HONESTLY, STRUCTURALLY TART. THE TABLE SURVIVES IT WITH GOOD HUMOUR AND WATER.",
    // game.js line 6580 · tasting
    pastorItWouldWake: "PASTOR: IT WOULD WAKE A MAN FOR MORNING PRAYER, FRANK. THERE ARE WORSE MINISTRIES.",
    // game.js line 6580 · tasting
    constanceItIsThe: "CONSTANCE: IT IS THE FIRST WINE, FRANK. IT IS SUPPOSED TO BE A LESSON. (SHE TAKES A SECOND SIP ANYWAY. A SMALL ONE. FOR THE LESSON.)",
    // game.js line 6581 · tasting
    theWineIsPoured_4: "THE WINE IS POURED. IT IS AN HONEST WINE — NOT THE ONE FRANK DREAMED, AND NOT A LIE EITHER. THE TABLE DRINKS IT WITH RESPECT.",
    // game.js line 6581 · tasting
    pastorItIsAn: "PASTOR: IT IS AN HONEST WINE, FRANK. A MAN COULD PUT THIS ON HIS TABLE WITHOUT APOLOGY — AND I HAVE SAT AT TABLES THAT COULD NOT SAY AS MUCH.",
    // game.js line 6581 · tasting
    constanceItTastesLike: "CONSTANCE: IT TASTES LIKE THE YEAR IT WAS. THAT IS ALL ANY WINE CAN TRULY SAY.",
    // game.js line 6582 · tasting
    constanceRaisesHerGlass: "CONSTANCE RAISES HER GLASS, LAST AND SLOWEST: TO THE FIELD. AND TO THE MAN WHO TALKED ABOUT IT AT THIS TABLE UNTIL THE TABLE BELIEVED HIM. (SHE IS SMILING. SHE HAS BEEN SMILING SINCE THE FIRST POUR.)",
    // game.js line 6583 · tasting
    andAtTheEnd: "AND AT THE END OF THE TABLE, WITH THE GLASSES LOW AND THE LIGHT GOING, FRANK SAYS THE THING THE WHOLE FIELD HAS BEEN WAITING TO HEAR HIM SAY PLAINLY:",
    // game.js line 6583 · tasting
    frankNextYearAnd: "FRANK: NEXT YEAR, AND EVERY YEAR: WINE. I AM A WINEMAKER. THE FIELD IS A VINEYARD THAT HAPPENS TO BE BLUEBERRIES. WE ARE GOING TO NEED MORE BUSHES. (CONSTANCE: WE ARE GOING TO NEED MORE EVERYTHING, FRANK. SHE IS SMILING WHEN SHE SAYS IT.)",
    // game.js line 6473 · wineDawn
    aMoldScareOn: "A MOLD SCARE ON THE JAR — SKIMMED OFF, PRAYED OVER, AND NOT SPOKEN OF AT BREAKFAST. THE CARE SLIPS A GRADE.",
    // game.js line 6477 · wineDawn
    theJarIsSealed_2: "THE JAR IS SEALED ON THE THIRD DAY. NOW: PATIENCE, AND THE SEAL-WATER KEPT TOPPED, WEEK BY WEEK.",
    // game.js line 6482 · wineDawn
    theSealRanDry: "THE SEAL RAN DRY TWICE RUNNING. THE JAR FORGIVES, MOSTLY. THE CARE SLIPS A GRADE.",
    // game.js line 6483 · wineDawn
    theSealWaterSits: "THE SEAL-WATER SITS LOW ON THE JAR. IT ASKS, POLITELY, TO BE TOPPED UP AT THE KITCHEN.",
    // game.js line 6486 · wineDawn
    theJarIsDone: "THE JAR IS DONE. BATCH {batch} WAITS AT THE BARN KITCHEN, FULL OF OPINIONS. BOTTLE IT THERE.",
    // game.js line 6462 · wineVerdict
    tart: "TART",
    // game.js line 6463 · wineVerdict
    sweetAsCandy: "SWEET AS CANDY",
    // game.js line 6464 · wineVerdict
    honest: "HONEST",
    // game.js line 6464 · wineVerdict
    lovely: "LOVELY",
    // game.js line 6465 · wineVerdict
    sweet: "SWEET",
  },

  // ======================================================================
  // TRIALS — Alvin against the deer, the cold, the weeds, the barber
  // ======================================================================
  trials: {
    // game.js line 4583 · TRIAL_OUTCOMES.deerFirstNight.lose
    theHerdGetsIn: [
      "THE HERD GETS IN. IT IS A BAD HOUR, AND THEN IT IS OVER.",
    ],
    // game.js line 4869 · TRIAL_OUTCOMES.frostBlossom.lose
    theFrostTakesRow: "THE FROST TAKES ROW {rn} FOR THE NIGHT.",
    // game.js line 6803
    moves: ['LUNGE', 'GUARD', 'DIG IN', 'BARK'],
    // game.js line 6891 · trialChoose
    theDeer: "THE DEER",
    // game.js line 6891 · trialChoose
    theCold: "THE COLD",
    // game.js line 6891 · trialChoose
    theWeeds: "THE WEEDS",
    // game.js line 6891 · trialChoose
    theBarber: "THE BARBER",
    // game.js line 7481 · renderTrial
    defend: [
      "DEFEND",
      "PLANTS",
      "BAG",
      "FLEE",
    ],
    // game.js line 4329 · TRIAL_OUTCOMES.weedsPatch.win
    thePatchSettlesThe: [
      "THE PATCH SETTLES. THE CANES STAND IN CLEARED GROUND, NETTED AND NAMED, LIKE THEY WERE ALWAYS THE POINT.",
      "OMA HAS HEARD ABOUT THE BLACKBERRIES. SHE HAS QUESTIONS, AND A BOWL. VISIT HER.",
    ],
    // game.js line 4333 · TRIAL_OUTCOMES.weedsPatch.lose
    alvinBacksOffThe: "ALVIN BACKS OFF. THE PATCH KEEPS ITS NERVE FOR ANOTHER NIGHT.",
    // game.js line 4337 · TRIAL_OUTCOMES.weedsPatch.lose
    thePatchWinsThe: [
      "THE PATCH WINS THE NIGHT. THE CANES ARE SET BACK, SORE AND SMALLER — BUT ROOTED, AND ROOTS ARE A PROMISE.",
      "THE WEEDS WILL TRY AGAIN IN TWO DAYS. SO WILL ALVIN. IT IS THAT KIND OF WAR.",
    ],
    // game.js line 4579 · TRIAL_OUTCOMES.deerFirstNight.win
    theHerdTurnsAt: [
      "THE HERD TURNS AT THE DOUBLE FENCE LIKE WEATHER AT A MOUNTAIN. THE FIELD KEEPS ITS FIRST NIGHT. THE FENCE HELD. THE DOG HELD. AND THE LORD KEPT EVERYTHING ELSE.",
      "IN ROW 1, SIXTY HEARTBEATS SLOW DOWN. IN THE BARN, FRANK SLEEPS THE WHOLE NIGHT THROUGH, EVENTUALLY, MOSTLY.",
    ],
    // game.js line 4587 · TRIAL_OUTCOMES.deerFirstNight.lose
    nameDidNotSurvive: "{name} DID NOT SURVIVE THE NIGHT. IT IS WRITTEN IN THE BACK OF THE REGISTER, WITH THE REST OF THE TRUTH.",
    // game.js line 4593 · TRIAL_OUTCOMES.deerFirstNight.lose
    aRowIsMowed: "A ROW IS MOWED, A FENCE SEGMENT IS DOWN, AND THE FIELD LOOKS LIKE A PLACE WHERE SOMETHING HAPPENED. REPAIR IT. PLANTS HAVE SURVIVED WORSE CHAPTERS THAN THIS ONE.",
    // game.js line 4651 · TRIAL_OUTCOMES.barber.win
    itIsGoneOver: [
      "IT IS GONE — OVER THE FENCE, UNDER THE GATE, SOMEWHERE SMALL AND PRECISE AND ELSEWHERE. ALVIN NEVER GOT A NAME FOR IT, OR A LOOK WORTH DESCRIBING.",
      "IT WILL BE IN THE REGISTER ANYWAY, IN THE BACK: UNKNOWN — SMALL — PRECISE. SOME ENTRIES ARE WARNINGS. SOME ARE JUST TRUE.",
      "FRANK, TO JEREMIAH, ON THE WALK BACK: SOME THINGS ARE NOT GIVEN TO US TO PREVENT, SON. WE TEND WHAT IS OURS. WE WATCH WHAT WE CAN. THE REST IS NOT OURS TO CARRY.",
    ],
    // game.js line 4658 · TRIAL_OUTCOMES.barber.lose
    leavingNameShornBehind: ", LEAVING {name} SHORN BEHIND IT",
    // game.js line 4658 · TRIAL_OUTCOMES.barber.lose
    itSlipsAwayBetween: "IT SLIPS AWAY BETWEEN ONE SNIP AND THE NEXT{v}.",
    // game.js line 4658 · TRIAL_OUTCOMES.barber.lose
    itWillComeAgain: "IT WILL COME AGAIN. SO WILL ALVIN. THE NURSERY HOLDS ITS BREATH AND GROWS, QUIETLY, IN THE MEANTIME.",
    // game.js line 4775 · TRIAL_OUTCOMES.weedsLongWar.win
    theLineBreaksTwice: [
      "THE LINE BREAKS. TWICE IT CAME, AND TWICE ALVIN WAS THE ARGUMENT IT COULD NOT ANSWER.",
      "EVERY SECTION DROPS A LEVEL. THE LONG WAR IS NOT OVER — WARS OF WEEDS NEVER ARE — BUT THE FIELD HAS SEEN IT CAN BE WON. NOW: PULL, FEED, MULCH, AND KEEP IT WON.",
    ],
    // game.js line 4778 · TRIAL_OUTCOMES.weedsLongWar.lose
    theTideKeepsThe: [
      "THE TIDE KEEPS THE SECTION TONIGHT. THE WEEDS ARE NOT SORRY, AND THEY WILL BE BACK AT DAWN.",
      "SO WILL ALVIN. IT IS, AS CONSTANCE SAYS, A LONG WAR — AND LONG WARS ARE WON BY THE SIDE THAT KEEPS SHOWING UP.",
    ],
    // game.js line 4863 · TRIAL_OUTCOMES.frostBlossom.win
    theFrostBreaksOn: "THE FROST BREAKS ON ROW {rn} LIKE A WAVE ON A FENCE POST. THE BLOSSOM HOLDS — SINGED AT THE EDGES, HOLDING. THE LORD KEPT THIS ONE TOO.",
    // game.js line 4863 · TRIAL_OUTCOMES.frostBlossom.win
    alvinComesInWith: "ALVIN COMES IN WITH FROST ON HIS WHISKERS AND THE AIR OF A DOG WHO HAS BEEN SOMEWHERE AND DONE SOMETHING.",
    // game.js line 4875 · TRIAL_OUTCOMES.frostBlossom.lose
    nameDidNotSurvive_2: "{name} DID NOT SURVIVE THE NIGHT. IT WILL BE NAMED FIRST IN THE RECKONING, AND IN THE BACK PAGES, WITH HONOUR.",
    // game.js line 4993 · TRIAL_OUTCOMES.deerScoutsLT.win
    theScoutsLeaveWith: "THE SCOUTS LEAVE WITH A STORY ABOUT A DOG. THE FIELD KEEPS ITS NIGHT. SOME GUARDS NEVER RETIRE; THEY JUST NAP PROFESSIONALLY.",
    // game.js line 4994 · TRIAL_OUTCOMES.deerScoutsLT.lose
    theScoutsGrazeThe: "THE SCOUTS GRAZE THE FENCE LINE AND GO. NO HARM WORTH WRITING DOWN — THE REGISTER LEAVES THE PAGE BLANK, WHICH IS ITS OWN KIND OF ENTRY.",
    // game.js line 5013 · TRIAL_OUTCOMES.deerScouts.win
    theScoutsRetreatTo: [
      "THE SCOUTS RETREAT TO TELL THE HERD: THIS FIELD HAS A DOG, AND THE DOG HAS OPINIONS.",
      "WORD WILL SPREAD. SO WILL THE DEER. BOTH ARE CERTAIN; ONLY THE TIMING IS NEGOTIABLE.",
    ],
    // game.js line 5014 · TRIAL_OUTCOMES.deerScouts.lose
    theScoutsGrazeA: [
      "THE SCOUTS GRAZE A WHILE, UNHURRIED, AND LEAVE BY THE NORTH CORNER LIKE THEY PAY RENT.",
      "NOTHING IS LOST BUT A MORNING AND SOME DIGNITY. THE FENCE QUESTION JUST GOT LOUDER.",
    ],
    // game.js line 5055 · TRIAL_OUTCOMES.frostGlass.win
    theGlassHoldsThe: [
      "THE GLASS HOLDS. THE STOVE TICKS. BY MORNING THERE IS FROST ON THE OUTSIDE OF THE PANES AND NONE — NONE — ON THE INSIDE.",
      "THE PLANTS HAVE A HOUSE. THE FAMILY HAS A BARN. THE FIELD HAS A FUTURE. EVERYONE SLEEPS.",
      "FRANK, QUIETLY, TO THE EMPTY GREENHOUSE: THANK YOU, LORD. (IT HAS BEEN THAT KIND OF NIGHT. IT HAS BEEN THAT KIND OF YEAR.)",
    ],
    // game.js line 5059 · TRIAL_OUTCOMES.frostGlass.lose
    alvinBacksOffThe_2: "ALVIN BACKS OFF. THE COLD KEEPS THE NIGHT; THE WAR CONTINUES TOMORROW.",
    // game.js line 5063 · TRIAL_OUTCOMES.frostGlass.lose
    theColdFoundA: [
      "THE COLD FOUND A SEAM. BY MORNING THE GLASS HOUSE CROWD IS A DAY POORER AND A STEP SORER — BUT STANDING.",
      "CONSTANCE: A HOUSE, LIKE A PLANT, TELLS YOU WHERE IT HURTS. WE SEAL THE SEAM. WE GO ON. THEY ARE ALL STILL HERE, FRANK.",
    ],
    // game.js line 6686 · TRIAL_OUTCOMES.frostTray.win
    theFreezeBreaksAgainst: [
      "THE FREEZE BREAKS AGAINST ONE SMALL DOG AND A CLOSED DOOR. THE SHELF CROWD STANDS, EVERY LAST LEAF. FRANK COUNTS THEM TWICE, AND THANKS THE LORD BOTH TIMES.",
      "ALVIN IS FROSTED AT THE TIPS AND PLEASED WITH HIMSELF.",
    ],
    // game.js line 6690 · TRIAL_OUTCOMES.frostTray.lose
    alvinBacksOffTo: "ALVIN BACKS OFF TO REGROUP. THE COLD WILL TRY AGAIN TOMORROW NIGHT. IT ALWAYS DOES.",
    // game.js line 6698 · TRIAL_OUTCOMES.frostTray.lose
    theColdGotIn: [
      "THE COLD GOT IN. LEAVES CURL, SHOULDERS HUNCH — A STEP BACK FOR THE WHOLE SHELF, AND THE SIX FEEL IT TOO.",
      "CONSTANCE: THEY ARE ALIVE, FRANK. SORE, AND ALIVE. WE WATER, WE WAIT, WE LEARN WHERE THE DRAFT LIVES.",
    ],
    // REVISION (Nov 27, 2026) — the frost tutorial costs the Company a count.
    companyColdLoss: "THE COMPANY LOSES {n} TO THE COLD. THEY ARE COUNTED AT DAWN, PLAINLY, THE WAY FRANK COUNTS EVERYTHING THAT MATTERS.",
    // game.js line 6869 · trialChoose
    youBackAwaySlowly: "YOU BACK AWAY SLOWLY. THE DEER WINS THIS ROUND OF STARING.",
    // game.js line 6869 · trialChoose
    alvinBacksOffSlowly: "ALVIN BACKS OFF, SLOWLY. THIS IS NOT OVER — ONLY POSTPONED.",
    // game.js line 6876 · trialChoose
    usedCompostTeaAlvin: "USED COMPOST TEA! ALVIN LAPS IT UP, RESTORED.",
    // game.js line 6877 · trialChoose
    noTeaLeftBrew: "NO TEA LEFT! (BREW MORE AT THE COMPOST.)",
    // game.js line 6895 · trialChoose
    alvinLungesFoenameBreaks: "ALVIN LUNGES! {foeName} BREAKS AND RUNS!",
    // game.js line 6896 · trialChoose
    alvinLungesFoenameStaggers: "ALVIN LUNGES! {foeName} STAGGERS BACK.",
    // game.js line 6898 · trialChoose
    alvinPlantsHisPaws: "ALVIN PLANTS HIS PAWS. HE WILL TAKE THE NEXT HIT HIMSELF.",
    // game.js line 6902 · trialChoose
    alvinTearsAtThe: "ALVIN TEARS AT THE ROOTS! THE MAT GIVES — AND THE WEEDS REEL!",
    // game.js line 6903 · trialChoose
    alvinDigsInAmong: "ALVIN DIGS IN AMONG THE ROOTS. THE WEEDS HATE THIS.",
    // game.js line 6904 · trialChoose
    alvinDigsInNothing: "ALVIN DIGS IN. NOTHING PUSHES PAST HIM EASILY.",
    // game.js line 6909 · trialChoose
    alvinBarksHisBrave: "ALVIN BARKS HIS BRAVE HEART OUT! {foeName} IS GONE!",
    // game.js line 6911 · trialChoose
    alvinUsedBarkFoename: "ALVIN USED BARK! {foeName} FLINCHED!",
    // game.js line 6912 · trialChoose
    alvinUsedBarkFoename_2: "ALVIN USED BARK! {foeName} STAMPS, UNIMPRESSED BUT RATTLED.",
    // game.js line 6928 · foeHit
    foeUsedNameIt: "{foe} USED {name}! IT GETS AT ALVIN. (-{dmg})",
    // game.js line 6935 · frostAct
    theColdSettlesInto: "THE COLD SETTLES INTO THE PATTERN OF IT. (+5 PRESSURE)",
    // game.js line 6938 · frostAct
    snap: "SNAP",
    // game.js line 6938 · frostAct
    theColdSnapsShut: "THE COLD SNAPS SHUT LIKE A TRAP! (-%D)",
    // game.js line 6939 · frostAct
    gust: "GUST",
    // game.js line 6939 · frostAct
    theGustHitsLike: "THE GUST HITS LIKE A SLAP OF ICE WATER! (-%D)",
    // game.js line 6942 · frostAct
    creep: "CREEP",
    // game.js line 6942 · frostAct
    theColdCreepsIn: "THE COLD CREEPS IN — AND SOMEWHERE, WOOD TICKS. SOMETHING IS COMING. (-%D)",
    // game.js line 6943 · frostAct
    theColdCreepsIn_2: "THE COLD CREEPS IN. THE AIR THICKENS — A GUST IS GATHERING. (-%D)",
    // game.js line 6948 · weedsAct
    theWeedsCreepA: "THE WEEDS CREEP — A ROOT RUNNER FINDS NEW GROUND. (+4 PRESSURE)",
    // game.js line 6949 · weedsAct
    choke: "CHOKE",
    // game.js line 6953 · barberAct
    theBarberIsGone: "THE BARBER IS GONE. JUST — GONE. AND THE PRESSURE OF NOT KNOWING GROWS. (+5)",
    // game.js line 6954 · barberAct
    aSnipInThe: "A SNIP IN THE DARK — AND ALVIN IS THERE. THE CUT FINDS ONLY FUR AND SPITE. (0)",
    // game.js line 6955 · barberAct
    snip: "SNIP",
    // game.js line 6964 · deerAct
    theDeerSettlesIn: "THE DEER SETTLES IN TO GRAZE, PERFECTLY AT HOME. (+3 PRESSURE)",
    // game.js line 6965 · deerAct
    theDeerLowersIts: "THE DEER LOWERS ITS HEAD TO GRAZE. IT IS IN NO HURRY AT ALL.",
    // game.js line 6976 · deerAct
    deerUsedStareIt: "DEER USED STARE. IT IS NOT AFRAID OF YOU. IT IS NOT AFRAID OF ANYONE. (-{dmg})",
    // game.js line 6977 · deerAct
    deerUsedNameIt: "DEER USED {name}! IT GETS AT ALVIN. (-{dmg})",
    // game.js line 6986 · endTrial
    theYardIsSafe: "THE YARD IS SAFE. ALVIN TAKES A SMALL, PROUD BOW. THE SPROUTS STAND TALL. WELL. TALL-ISH.",
    // game.js line 6992 · endTrial
    theDeerGotPast: "THE DEER GOT PAST ALVIN AND MOWED THE SPROUT DOWN. IT WILL GROW BACK. SO WILL YOU.",
    // game.js line 7466 · renderTrial
    pressure: "PRESSURE",
    // game.js line 7475 · renderTrial
    dugIn: "DUG IN",
    // game.js line 7479 · renderTrial
    whatWillAlvinDo: "WHAT WILL ALVIN DO?",
    // game.js line 7479 · renderTrial
    chooseAMove: "CHOOSE A MOVE:",
    // game.js line 7489 · renderTrial
    theGardenAlvinGuards: "THE GARDEN ALVIN GUARDS:",
    // game.js line 7494 · renderTrial
    aBBack: "A/B: BACK",
    // game.js line 7498 · renderTrial
    compostTeaTea10: "COMPOST TEA ×{tea} (+10 HP)",
    // game.js line 4315 · ch5Dawn
    thePatchFightsBack: "THE PATCH FIGHTS BACK! ROOTS AND RUNNERS, UP IN THE NIGHT, AFTER THE BRAMBLE! ALVIN DIGS IN!",
    // game.js line 4321 · ch5Dawn
    theWeedsReturnAs: "THE WEEDS RETURN, AS PROMISED BY EVERY WEED SINCE EDEN. ALVIN IS READY.",
    // game.js line 4570 · ch6Dawn
    nameIsVTonight: "{name} IS {v} TONIGHT, AT THE HEAD OF THE ROW",
    // game.js line 4570 · ch6Dawn
    theRow: "THE ROW",
    // game.js line 4570 · ch6Dawn
    theFirstNightThe: "THE FIRST NIGHT. THE HERD COMES TO READ THE NEW FIELD — AND {v}. ALVIN TAKES HIS POST.",
    // game.js line 4630 · ch7Dawn
    twoQuietNightsUnder: "TWO QUIET NIGHTS UNDER ALVIN'S WATCH — AND ON THE THIRD, A SHADOW AT THE SHELF, SMALL AND PRECISE AND CAUGHT. THE BARBER, AT LAST, IN THE OPEN!",
    // game.js line 4640 · ch7Dawn
    itComesInDaylight: "IT COMES IN DAYLIGHT THIS TIME — BOLD WITH PRACTICE. SMALL. PRECISE. SNIPPING AT THE SHELF LIKE IT OWNS SCISSORS AND A GRUDGE. ALVIN, AT LAST, HAS SOMETHING TO FACE!",
    // game.js line 4761 · ch8Dawn
    theLongWarIn: "THE LONG WAR, IN PERSON: THE WEED LINE COMES OVER SECTION {worst}1 LIKE A GREEN TIDE. ALVIN CHARGES THE FRONT OF IT!",
    // game.js line 4850 · ch9Dawn
    andNameIsV: " — AND {name} IS {v} TONIGHT",
    // game.js line 4850 · ch9Dawn
    theLateFrostNight: "THE LATE FROST, NIGHT {night} OF 3. IT WALKS ROW {watch} LIKE IT OWNS THE DEED{v}. ALVIN STANDS IN THE ROW AND DOES NOT BLINK.",
    // game.js line 4977 · ltDawn
    aLateFrostIn: "A LATE FROST, IN THE LONG TENDING, COMES FOR ROW {rn} LIKE IT PAYS RENT THERE. ALVIN — OLDER, NOT SLOWER — TAKES HIS POST.",
    // game.js line 4983 · ltDawn
    scoutsAtTheFence: "SCOUTS AT THE FENCE IN THE SMALL HOURS. ALVIN IS ALREADY THERE, AHEAD OF THE ALARM, AS ALWAYS.",
    // game.js line 5003 · ch4Dawn
    scoutsTwoDeerAt: "SCOUTS! TWO DEER AT THE FIELD GATE, READING THE STAKES LIKE A MENU! ALVIN IS ALREADY THERE!",
    // game.js line 5050 · startGlassTrial
    theFirstNightIn: "THE FIRST NIGHT IN THE GLASS HOUSE, AND THE COLD COMES TO TEST THE SEAMS! ALVIN STANDS IN THE DOORWAY OF THE GREENHOUSE AND DARES IT!",
    // game.js line 6681 · startFrostTrial
    theColdComesFor: "THE COLD COMES FOR THE SHELF! ALVIN PLANTS HIMSELF IN THE DRAFT AND GROWLS AT THE WEATHER ITSELF!",
    // game.js line 6818 · startTrial
    alvinLeapsInFront: "ALVIN LEAPS IN FRONT OF THE BENCH, BARKING!",
    // game.js line 6997 · endTrial
    theSecondWaveComes: "THE SECOND WAVE COMES OVER THE FENCE LINE LIKE WEATHER. ALVIN SHAKES HIMSELF AND DIGS IN AGAIN.",
    // game.js line 6969 · deerAct
    nibble: "NIBBLE",
    // game.js line 6970 · deerAct
    stomp: "STOMP",
    // game.js line 6971 · deerAct
    stare: "STARE",
  },

  // ======================================================================
  // PLANTS — where they came from, what their pages say, how they died
  // ======================================================================
  plants: {
    // game.js line 4299 · patchInteract
    blackberry: "BLACKBERRY",
    // game.js line 4498 · doPlanting
    plantedInRow1: "PLANTED IN ROW 1",
    // game.js line 4509 · doPlanting
    plantedInRowRn: "PLANTED IN ROW {rn}",
    // game.js line 4531 · repot
    theHardSpring: "THE HARD SPRING",
    // game.js line 4587 · TRIAL_OUTCOMES.deerFirstNight.lose
    theFirstNight: "THE FIRST NIGHT",
    // game.js line 4606 · barberStrike
    shornInTheNight: "SHORN IN THE NIGHT",
    // game.js line 4619 · ch7Dawn
    firstFallTurnedFirst: "FIRST FALL — TURNED FIRST, DARK RED",
    // game.js line 4707 · strawberryInteract
    strawberry: "STRAWBERRY",
    // game.js line 4716 · butterflyPlant
    butterfly: "BUTTERFLY",
    // game.js line 4785 · forsythiaPlant
    forsythia: "FORSYTHIA",
    // game.js line 4811 · ch9Dawn
    coveredInBlossomSpring: "COVERED IN BLOSSOM, SPRING YEAR 3",
    // game.js line 4875 · TRIAL_OUTCOMES.frostBlossom.lose
    theLateFrost: "THE LATE FROST",
    // game.js line 6343 · clearHusk
    frankClearsWhatIs: "FRANK CLEARS WHAT IS LEFT OF {name}.",
    // game.js line 6343 · clearHusk
    intoTheCompostIt: "INTO THE COMPOST IT GOES. NOTHING IN THIS YARD IS WASTED.",
    // game.js line 6343 · clearHusk
    n2Compost: "(+2 COMPOST)",
    // game.js line 6364 · plantDawn
    aDrySpellAnd: "A DRY SPELL, AND NO RESCUE CAME",
    // game.js line 6364 · plantDawn
    itFailedAndWas: "IT FAILED, AND WAS REMEMBERED",
    // game.js line 7648 · regInspectMark
    firstFall: "FIRST FALL",
    // game.js line 4268 · irisInteract
    inheritedWithThePlace: [
      "INHERITED WITH THE PLACE",
    ],
    // game.js line 4297 · patchInteract
    rescuedFromThePatch: [
      "RESCUED FROM THE PATCH BEHIND THE GOOD SHED",
    ],
    // game.js line 4537 · repot
    aGiftFromA: [
      "A GIFT FROM A FRIEND WHO SHOWS UP",
    ],
    // game.js line 4705 · strawberryInteract
    aFoundingClumpOf: [
      "A FOUNDING CLUMP OF THE FAMILY GARDEN",
    ],
    // game.js line 4714 · butterflyPlant
    opaNamedItIn: [
      "OPA NAMED IT IN THE OLD GARDEN, BEFORE ANY OF THIS",
      "DUG FROM THE OLD YARD AND CARRIED HOME",
    ],
    // game.js line 4783 · forsythiaPlant
    omaNamedItFrank: [
      "OMA NAMED IT. FRANK ONLY DUG.",
      "CARRIED PAST HER WINDOW TO THE SPOT SHE CHOSE",
    ],
    // game.js line 4911 · potUpLT
    sownInTheLong: [
      "SOWN IN THE LONG TENDING",
    ],
    // game.js line 5146 · potUp
    germinatedInTheFridge: [
      "GERMINATED IN THE FRIDGE FLOOD",
    ],
    // game.js line 6335 · killPlant
    itWasNotWatered: "IT WAS NOT WATERED IN TIME",
    // REVISION (Nov 27, 2026) — the two tiers: collective names and the
    // history lines an event-Favorite is born with.
    theCompany: "THE COMPANY",
    theNursery: "THE NURSERY",
    namedAtTheReckoning: [
      "NAMED AT THE RECKONING — THE FROST SPARED IT",
    ],
    namedAtFirstPicking: [
      "NAMED AT THE FIRST PICKING — IT FED THEM FIRST",
    ],
    namedByAlvin: [
      "NAMED BY ALVIN, WHO SAT BESIDE IT UNTIL FRANK NOTICED",
    ],
  },

  // ======================================================================
  // THE FAITH THREAD (REVISION, Nov 27, 2026) — woven, in the characters'
  // own words. DIALOGUE PASS (later Nov 27, 2026), at Daniel's ruling:
  // less vague, more directly Jesus-honoring, Westminster-compatible —
  // where faith is spoken, Christ is named; gratitude and prayer are
  // addressed to God plainly; hope is resurrection hope. Verbatim
  // Scripture stays rare and natural. VOICE PASS (later Nov 27, 2026),
  // at Daniel's playtest verdict — the content was right, the register
  // too formal: the same lines re-voiced plainer, the way people in
  // the novel actually talk. Daniel's pencil is the final review,
  // like everywhere else in this file.
  // ======================================================================
  faith: {
    // ch. 1: the first sprout's morning line (dawn, once)
    firstSprout: "FRANK THANKS GOD FOR THE SPROUT OUT LOUD, AT A VOLUME THE SPROUT COULD NOT POSSIBLY REQUIRE. THE NEIGHBOURS' DOG ANSWERS. IT COUNTS.",
    // ch. 1: after the deer trial — the tenant line (endTrial, win)
    tenantYard: "FRANK: THIS YARD IS NOT MY KINGDOM. I AM A TENANT HERE, WITH A DOG FOR A NIGHT WATCHMAN. THE LORD OWNS THE PLACE, AND HE IS GOOD, AND FRANKLY HE KEEPS BETTER WATCH THAN EITHER OF US.",
    // ch. 6: the crisis diagnosis arrives by ordinary means (repot)
    crisisDiagnosis: "THE DIAGNOSIS ARRIVES THE WAY THE LORD'S MERCY USUALLY ARRIVES IN THIS FAMILY — BY ORDINARY MEANS, OUT OF A FRIEND'S MOUTH, WITH HIS SLEEVES ALREADY ROLLED UP.",
    // ch. 6: Frank receives the gift bush (repot)
    giftThanks: "FRANK: I DID NOT EARN THIS ONE AND I CANNOT REPAY IT. IT JUST — STANDS THERE, HEALTHY, AMONG MY STARVING PLANTS. THE LORD KEEPS HANDING ME THINGS I DID NOT EARN. THIS ONE HAS LEAVES. THANK YOU FEELS TOO SMALL, AND IT IS ALL I HAVE GOT.",
    // ch. 6: Planting Day — the handover at the head of Row 1 (doPlanting)
    plantingHandover: [
      "FRANK STANDS AT THE HEAD OF ROW 1 A MOMENT, WITH DIRT ON HIS HANDS AND NOTHING LEFT TO DO THAT IS HIS TO DO.",
      "FRANK: THERE. HOLES DUG, WATER IN, MULCH DOWN, A FENCE AGAINST DEER. THE GROWING IS NOT MINE, CONSTANCE. IT NEVER WAS. THEY BELONG TO THE LORD — HE IS THE ONE WHO GIVES THE GROWTH. WHATEVER COMES NEXT IS UP TO HIM.",
      "FRANK: AND THE SMALL GARDENERS IN THE NEXT ROW ARE NOT MINE EITHER, NOT REALLY. I AM THEIR CARETAKER. I AM CONTENT TO BE ONLY THAT.",
      "ZOEY NEEDS HELP WITH A BUCKET. THE MOMENT ENDS THE WAY FRANK'S MOMENTS END.",
    ],
    // ch. 4: the irises — the creation beat (irisInteract, first viewing)
    irisGlory: [
      "FRANK: I DID NOT PLANT THESE. I CANNOT EAT THEM. AND THEY ARE SHOUTING.",
      "CONSTANCE: SHOUTING, FRANK?",
      "FRANK: ABOUT THEIR MAKER. PURPLE, AND BLUE, AND BLACK AS A WELL — IN A YARD I THOUGHT WAS ONLY FOR USEFUL THINGS. EVERYTHING HERE IS SAYING SOMETHING, CONSTANCE. I HAVE BEEN TOO BUSY TO HEAR MOST OF IT.",
      "CONSTANCE: THEN HEAR THIS: THEY NEED A STAKE BEFORE THE WIND DOES. (SHE HANDS HIM ONE. SHE IS SMILING.)",
    ],
    // ch. 4: the ordinance refusal — Constance's clause (ch4, the verdict)
    ordinanceClause: "CONSTANCE: SOME NO'S ARE ANSWERS TOO, FRANK. THE LORD SAID NO TO THIS ONE, SAME AS HE SAYS YES TO OTHERS. WRITE THAT IN THE BOOK TOO.",
    // ch. 5: Oma's faith, told as a story (npcTalk rotation)
    omaTightMonth: [
      "OMA: ONE WINTER THE MONEY RAN OUT BEFORE THE MONTH DID. I PRAYED — OUT LOUD, IN THE KITCHEN. AND BY SUPPER THERE WAS A BAG ON THE STEP WITH NO NAME ON IT. FLOUR. COFFEE. A HAM.",
      "OMA: I NEVER DID LEARN WHOSE HANDS THEY WERE. I STOPPED NEEDING TO. THE LORD ANSWERED THAT PRAYER WITH SOMEBODY'S HANDS, FRANK. HE USUALLY DOES.",
    ],
    // ch. 5: Opa, in memory — the thread's most delicate beat (npcTalk, once)
    opaExchange: [
      "CONSTANCE: YOUR FATHER PRAYED, AND READ, AND TOOK YOU TO CHURCH, OMA. AND HE WAS A HARD MAN. I HAVE NEVER KNOWN HOW TO HOLD BOTH OF THOSE.",
      "OMA: YOU HOLD THEM THE WAY YOU HOLD A CAT, CONSTANCE. GENTLY, AND WITHOUT EXPECTING IT TO MAKE SENSE ON COMMAND.",
      "FRANK: THE GOD HE HANDED YOU TURNED OUT KINDER THAN THE MAN WHO HANDED HIM OVER. GOD IS KIND, AND MERCIFUL, AND PRONE TO BE GENEROUS TO PEOPLE WHO DO NOT DESERVE IT. CHRIST CAME INTO THE WORLD TO SAVE SINNERS, CONSTANCE. I AM ONE, AND I AM COUNTING ON IT.",
      "CONSTANCE: SUPPER IS AT SIX. THAT IS THE WHOLE SERMON. (SHE SAYS IT FONDLY, AND EVERYONE COMES TO THE TABLE.)",
    ],
    // ch. 9: the frost reckoning — trust shown as a man picking up the can
    reckoningWater: "AND THEN FRANK PICKS UP THE WATERING CAN AND WATERS WHAT REMAINS. NO SPEECH. JUST THE CAN, AND THE ROWS, AND A MAN DOING THE NEXT THING.",
    // ch. 9: the spectacular one, if it carries THE HARD SPRING
    spectacularClause: "CONSTANCE: THE ONE THAT SUFFERED MOST, BLOOMING HARDEST. THAT IS NO ACCIDENT, FRANK — NOT IN MY FATHER'S WORLD. (SHE SAYS IT TO THE BUSH. SHE MEANS IT AT HIM.)",
    // ch. 10: the harvest — thanks before the weighing (harvestRow, Row 1, once)
    harvestThanks: "FRANK, BEFORE THE WEIGHING: THANK YOU, LORD. (THE LORD SENT THIS FRUIT, OUT OF DIRT AND A LOT OF WAITING. FRANK WANTS IT SAID BEFORE THE NUMBERS START.)",
    // ch. 10: the tasting — what was given away counts as yield
    sharedCounts: "WHAT WAS GIVEN AWAY COUNTS AS YIELD IN THIS HOUSE. THE LORD COUNTS IT THAT WAY, AND SO DOES THE CELLAR PAGE. IT ALWAYS HAS.",
    // ch. 2: the great emptying — gratitude under load (storageTrip)
    greatEmptying: "MID-LIFT, ARMS FULL, FRANK SAYS THANK YOU, LORD, TO NOBODY IN PARTICULAR. CONSTANCE, HOLDING THE DOOR, DOES NOT ASK. SHE KNOWS WHO HE IS TALKING TO. SHE TALKS TO HIM HERSELF.",
    // ch. 3: moving weekend — mercy wears work gloves (carryPlants)
    movingHands: "THE SECOND LOAD IS CARRIED BY FRIENDS FROM CHURCH, WHO ARRIVED WITH GLOVES AND LEFT WITH PIE. THE LORD'S MERCY, AROUND HERE, USUALLY SHOWS UP WEARING WORK GLOVES.",
    // ch. 10: the tasting — Frank's settlement (tasting)
    settlement: "FRANK: I DID MY PART AND SEALED IT, AND THEN I WAITED ON WHAT I COULD NOT HURRY. THE LORD KEPT THE WINE ALL WINTER WITHOUT ANY HELP FROM ME. (A BEAT.) HE HAS KEPT ME A LOT LONGER THAN THAT, WITH A LOT LESS TO WORK WITH.",
    // the Long Tending: at a Favorite's husk, cleared to the compost
    huskHope: "FRANK: NOTHING HERE IS WASTED. A SEED GOES INTO THE GROUND IN HOPE IN THIS YARD, NOT IN DESPAIR. CHRIST CAME UP OUT OF THE GROUND. SO THE GROUND IS NOT THE END OF ANYTHING. IT NEVER HAS BEEN.",
  },

  // ======================================================================
  // NAMES AND LABEL LISTS — plant names, stages, seasons, health
  // ======================================================================
  names: {
    // game.js line 5497
    empty: [
      "EMPTY",
      "SEED",
      "SPROUT",
      "SEEDLING",
      "BUSH",
      "BLOSSOM",
      "FRUITING",
    ],
    // game.js line 5501
    spring: [
      "SPRING",
      "SUMMER",
      "FALL",
      "WINTER",
    ],
    // game.js line 5508
    fine: [
      "FINE",
      "STRESSED",
      "DECLINING",
      "CRITICAL",
      "DEAD",
    ],
    // game.js line 5513
    pools: [
  ['ENSIGN', 'LIEUTENANT', 'MAJOR', 'COLONEL', 'SERGEANT', 'CORPORAL', 'PRIVATE', 'COMMODORE', 'BRIGADIER', 'SCOUT'],
  ['MERCY', 'GRACE', 'JOY', 'PEACE', 'KINDNESS', 'FAITH', 'CHARITY', 'TEMPERANCE', 'COURAGE', 'HUMILITY'],
  ['BUTTON', 'BISCUIT', 'PICKLE', 'MARBLE', 'ACORN', 'PEBBLE', 'WIDGET', 'SPROCKET', 'MITTEN', 'POCKET', 'LANTERN', 'COMPASS', 'ANCHOR', 'BEACON', 'HARBOUR', 'SUMMIT', 'EMBER', 'CLOVER', 'FERN', 'JUNIPER', 'MAGPIE', 'WREN', 'FINCH', 'OTTER', 'BADGER', 'MARMALADE', 'TOFFEE', 'BRAMBLE', 'HAZEL', 'ROWAN', 'ALDER', 'BIRCH', 'CEDAR', 'MAPLE', 'WILLOW', 'POPLAR', 'THISTLE', 'HEATHER', 'BRIAR', 'TANSY', 'SORREL', 'CHIVE', 'BASIL', 'MINTY', 'PARSLEY', 'DILL', 'FENNEL', 'OKRA', 'QUINCE', 'MEDLAR', 'SLOE', 'HUCKLE', 'BILBERRY', 'DEWBERRY', 'CLOUDBERRY', 'ADMIRAL2', 'CAPTAIN2', 'GENERAL2', 'HOPE2', 'PATIENCE2', 'PROFESSOR2'],
],
    // game.js line 5531
    admiral: [
      "ADMIRAL",
      "CAPTAIN",
      "GENERAL",
      "HOPE",
      "PATIENCE",
      "PROFESSOR",
    ],
  },

  // ======================================================================
  // OBJECTIVES — the small line at the top of the screen
  // ======================================================================
  objectives: {
    // game.js line 6040 · objective
    alvinIsDownstairsKeeping: "ALVIN IS DOWNSTAIRS, KEEPING OMA'S FEET WARM.",
    // game.js line 6041 · objective
    tendTheSixThe: [
      "TEND THE SIX. THE STORY IS IN THE HOUSE.",
      "SEEDS IN THE FRIDGE. JEREMIAH CARRIES. HOUSES FAIL.",
      "SELL FIRST. PACK LIKE YOU MEAN IT.",
      "SELL FIRST. PACK LIKE YOU MEAN IT.",
      "SELL FIRST. PACK LIKE YOU MEAN IT.",
      "THE GREAT EMPTYING: ONE VAN LOAD A DAY.",
      "THE WINTER DEEPENS. THE FRIDGE KEEPS ITS SECRET.",
      "POT THEM UP. EVERY ONE GETS A NAME.",
      "SIGN THE PAPERS AT THE TABLE.",
    ],
    // game.js line 6041 · objective
    tendTheShelf: "TEND THE SHELF.",
    // game.js line 6042 · objective
    goAndLookQuietly: [
      "GO AND LOOK. QUIETLY.",
      "THE GATE BY THE ROAD LEADS TO BERRYHILL.",
      "THINK IT OVER. THEN DECIDE LIKE YOU MEAN IT.",
      "THE BARN. THE FIELD. THE SET.",
      "MOVING WEEKEND: THE TRUCK, AT THE OLD DOOR.",
      "ONE MORE LOAD, ONE WAY OR ANOTHER.",
      "BUILD THE GREENHOUSE: FRAME, SHELL, HEATER.",
      "CARRY THE PLANTS TO THE GLASS HOUSE.",
      "THE FIRST NIGHT IN THE GLASS HOUSE.",
      "SETTLE IN.",
    ],
    // game.js line 6042 · objective
    settleIn: "SETTLE IN.",
    // game.js line 6043 · objective
    stakeTheField: [
      "STAKE THE FIELD.",
      "MEET THE IRISES.",
      "THE TOWN HAS OPINIONS.",
      "PRICE THE FENCE AT THE GOOD SHED.",
    ],
    // game.js line 6043 · objective
    walkTheField: "WALK THE FIELD.",
    // game.js line 6044 · objective
    buildTheStairsDown: [
      "BUILD THE STAIRS DOWN.",
      "OMA IS COMING. MAKE READY.",
      "CLEAR THE PATCH BEHIND THE GOOD SHED.",
      "THE PATCH FIGHTS BACK.",
      "VISIT OMA.",
    ],
    // game.js line 6044 · objective
    tendEveryone: "TEND EVERYONE.",
    // game.js line 6045 · objective
    somethingIsWrongIn: [
      "SOMETHING IS WRONG IN THE GLASS HOUSE.",
      "WATER. VENT. DIRT. FIGHT FOR THEM.",
      "WATER. VENT. DIRT. FIGHT FOR THEM.",
      "WATER. VENT. DIRT. FIGHT FOR THEM.",
      "REPOT THEM. THE FRIEND IS RIGHT: DIRT.",
      "THE LONG PREP: TARP, PIPE, MULCH, FENCE.",
      "PLANTING DAY.",
      "THE FIRST NIGHT.",
    ],
    // game.js line 6045 · objective
    tendTheField: "TEND THE FIELD.",
    // game.js line 6046 · objective
    somethingIsCuttingThe: "SOMETHING IS CUTTING THE SMALLEST. SET THE WATCH AT REST.",
    // game.js line 6047 · objective
    theLongWarPull: [
      "THE LONG WAR: PULL, FEED, MULCH.",
      "A VISIT, AND A SORTING LESSON.",
      "THE PROUD WEED STANDS BY THE FENCE.",
      "STRAWBERRIES FOR THE FAMILY GARDEN.",
      "A BUSH FOR OMA'S PATIO.",
      "HOLD EVERY SECTION AT ZERO, A FULL WEEK.",
    ],
    // game.js line 6047 · objective
    theLongWar: "THE LONG WAR.",
    // game.js line 6048 · objective
    aForsythiaForOma: [
      "A FORSYTHIA FOR OMA'S WINDOW.",
      "BLOSSOM WEEK. WATER THE ROWS.",
      "THE LATE FROST: THREE NIGHTS. SET THE WATCH AT THE GATE.",
      "THE RECKONING OF THE BLOSSOM.",
    ],
    // game.js line 6048 · objective
    tendTheBlossom: "TEND THE BLOSSOM.",
    // game.js line 6049 · objective
    batchOneARehearsal: [
      "BATCH ONE: A REHEARSAL, AT THE BARN KITCHEN.",
      "MIND THE JAR: SWISH IT, WATCH THE SEAL.",
      "THE HARVEST. ROW 1 FIRST, BY NAME.",
      "BATCH TWO: YOUR RATIO, FROM THE FIELD'S OWN FRUIT.",
      "MIND THE JAR: SWISH IT, WATCH THE SEAL.",
      "THE TASTING, AT THE TABLE.",
    ],
    // game.js line 6049 · objective
    makeTheWine: "MAKE THE WINE.",
    // game.js line 6050 · objective
    theLongTendingEvery: "THE LONG TENDING. EVERY YEAR, THE SAME GOOD WORK.",
    // game.js line 6051 · objective
    theGrandPlanSix: "THE GRAND PLAN: SIX POTS, SIX PROMISES (A)",
    // game.js line 6052 · objective
    aDrinkForEach: "A DRINK FOR EACH POT: A AT A POT",
    // game.js line 6053 · objective
    freeTendingBerryhillComes: "FREE TENDING. BERRYHILL COMES LATER.",
    // game.js line 6054 · objective
    aDeerIsIn: "A DEER IS IN THE YARD! FACE IT, PRESS A",
    // game.js line 6055 · objective
    waterThePotsDaily: "WATER THE POTS DAILY. REST AT THE DOOR.",
    // game.js line 6056 · objective
    faceTheDeerTo: "FACE THE DEER TO FINISH THE CHAPTER",
  },

  // ======================================================================
  // THE DAY COUNTER
  // ======================================================================
  hud: {
    // game.js line 5189 · renderArea
    dayDay: "DAY {day}",
  },

  // ======================================================================
  // BERRYHILL — mornings and Constance, later chapters
  // ======================================================================
  berry: {
    // game.js line 4025
    constance: [
  'CONSTANCE: THE BARN SMELLS OF HAY AND SECOND CHANCES. I CHECKED: THE SECOND CHANCES ARE STRUCTURAL.',
  'CONSTANCE: A FIELD, FRANK. AN ACTUAL FIELD. I HAVE ALREADY FORGIVEN IT FOR THE WORK IT WILL CAUSE.',
  'CONSTANCE: THE DOWNSTAIRS WILL BE OMA\'S WHEN SHE IS READY. THE DOOR OPENS TO THE YARD — HER OWN DOOR. THAT MATTERS.',
],
    // game.js line 6452
    morning: [
  'THE FIELD IS STILL THERE. IT IS PATIENT THAT WAY.',
  'SOMEWHERE A ROOSTER HAS OPINIONS. NOT OURS. NO CHICKENS. TOWN RULES.',
  'THE BARN SMELLS OF HAY AND SECOND CHANCES.',
  'ALVIN HAS ALREADY INSPECTED EVERYTHING. TWICE.',
  'A GOOD DAY TO TEND SOMETHING SMALL.',
  'THE MOUNTAINS ARE DOING THEIR LONG BLUE STAND AT THE EDGE OF EVERYTHING.',
],
    // game.js line 3798 · onEnterArea
    thePlaceOutsideBerryhill: [
      "THE PLACE OUTSIDE BERRYHILL. A BARN THAT BECAME A HOUSE, A HOUSE THAT KEPT THE BARN'S HONESTY.",
      "A GOOD SHED. A LINE OF PINES. AND THE FIELD — SQUARE, OPEN, WAITING — VISIBLE FROM THE DRIVE LIKE IT IS HOLDING ITS BREATH.",
      "CONSTANCE, QUIETLY: OH. OH, FRANK.",
      "FRANK: I KNOW. I KNOW. DO NOT SAY IT YET. LET IT BE UNSAID AND TRUE A MINUTE LONGER.",
    ],
  },

  // ======================================================================
  // CHAPTER CARDS AND THE JOURNAL
  // ======================================================================
  cards: {
    // game.js line 6704
    chapters: [
  null,
  { name: 'SEEDS', teaser: 'SIX POTS, SIX PROMISES. NO LAND YET — BUT A START.' },
  { name: 'SPROUTS', teaser: 'A HUNDRED LITTLE PROMISES, AND NOWHERE TO PUT THEM. YET.' },
  { name: 'LANDING', teaser: 'THE BARN WAS NEVER THE PLAN. THE FIELD WAS. THEY CAME AS A SET.' },
  { name: 'PLANS', teaser: 'HE MEASURED IT TWICE. IT WAS SQUARE. SOME DREAMS HAVE CORNERS.' },
  { name: 'DOWNSTAIRS', teaser: 'SHE GOT THE DOWNSTAIRS. THE DOG GOT HER FEET. EVERYONE LANDED SOFTLY.' },
  { name: 'THE FIELD', teaser: 'THEY STARTED IN A FRIDGE AND A PRAYER. NOW THEY HAVE AN ADDRESS: ROW ONE.' },
  { name: 'THE BARBER', teaser: 'SOMETHING OUT THERE GIVES HAIRCUTS. FRANK HAS DECIDED TO LET IT.' },
  { name: 'WEEDS', teaser: "THE WEEDS WILL BE BACK THURSDAY. SO WILL HE. IT ISN'T A WAR, EXACTLY. IT'S A MARRIAGE." },
  { name: 'THE FORSYTHIA', teaser: 'FIRST THE YELLOW BUSH. THEN THE WHOLE FIELD, HOLDING ITS BREATH, IN WHITE.' },
  { name: 'WINE', teaser: 'HE ASKED WHAT HE WOULD DO WITH NINE HUNDRED POUNDS OF BLUEBERRIES. THE ANSWER FIT IN A SMALL GLASS.' },
],
    // game.js line 7527 · renderCard
    theSix: "THE SIX: ",
    // game.js line 7533 · renderCard
    memRemembered: " · {mem} REMEMBERED",
    // game.js line 7533 · renderCard
    theRegisterLivLiving: "THE REGISTER: {liv} LIVING{v}",
    // game.js line 7536 · renderCard
    keepTendingA: "KEEP TENDING (A)",
    // game.js line 7514 · renderCard
    chapterComplete: "CHAPTER COMPLETE",
    // game.js line 6706
    sixPotsSixPromises: "SIX POTS, SIX PROMISES. NO LAND YET — BUT A START.",
    // game.js line 6707
    aHundredLittlePromises: "A HUNDRED LITTLE PROMISES, AND NOWHERE TO PUT THEM. YET.",
    // game.js line 6708
    theBarnWasNever: "THE BARN WAS NEVER THE PLAN. THE FIELD WAS. THEY CAME AS A SET.",
    // game.js line 6709
    heMeasuredItTwice: "HE MEASURED IT TWICE. IT WAS SQUARE. SOME DREAMS HAVE CORNERS.",
    // game.js line 6710
    sheGotTheDownstairs: "SHE GOT THE DOWNSTAIRS. THE DOG GOT HER FEET. EVERYONE LANDED SOFTLY.",
    // game.js line 6711
    theField: "THE FIELD",
    // game.js line 6711
    theyStartedInA: "THEY STARTED IN A FRIDGE AND A PRAYER. NOW THEY HAVE AN ADDRESS: ROW ONE.",
    // game.js line 6712
    somethingOutThereGives: "SOMETHING OUT THERE GIVES HAIRCUTS. FRANK HAS DECIDED TO LET IT.",
    // game.js line 6713
    theWeedsWillBe: "THE WEEDS WILL BE BACK THURSDAY. SO WILL HE. IT ISN'T A WAR, EXACTLY. IT'S A MARRIAGE.",
    // game.js line 6714
    theForsythia: "THE FORSYTHIA",
    // game.js line 6714
    firstTheYellowBush: "FIRST THE YELLOW BUSH. THEN THE WHOLE FIELD, HOLDING ITS BREATH, IN WHITE.",
    // game.js line 6715
    heAskedWhatHe: "HE ASKED WHAT HE WOULD DO WITH NINE HUNDRED POUNDS OF BLUEBERRIES. THE ANSWER FIT IN A SMALL GLASS.",
    // game.js line 7159 · renderChapters
    theLongTending: "THE LONG TENDING",
    // game.js line 7159 · renderChapters
    noLastPageJust: "NO LAST PAGE. JUST SEASONS, AND A FIELD THAT KNOWS YOUR STEP.",
  },

  // ======================================================================
  // THE PLANT REGISTER — pages, cards, the back pages
  // ======================================================================
  register: {
    // game.js line 0
    notYet: "NOT YET",
    // game.js line 7635
    locPretty: { BENCH: 'THE BENCH', WINDOW: 'THE WINDOW SHELF', FRIDGE: 'THE FRIDGE', GREENHOUSE: 'THE GREENHOUSE', NURSERY: 'THE NURSERY', OFFICE: "FRANK'S OFFICE", GARDEN: 'THE GARDEN', MEMORIAL: 'THE BACK PAGES' },
    // game.js line 7760 · renderRegister
    namesSliceval: "NAMES: {sliceVal}",
    // game.js line 7760 · renderRegister
    locprettyval: "◀ {locPrettyVal} ▶",
    // game.js line 7839 · renderRegister
    sproutedDaySproutedday: " · SPROUTED: DAY {sproutedDay}",
    // game.js line 7839 · renderRegister
    sownDayorvalV: "SOWN: {dayOrVal}{v}",
    // game.js line 7840 · renderRegister
    bushDayBushday: " · BUSH: DAY {bushDay}",
    // game.js line 7840 · renderRegister
    seedlingDayorvalV: "SEEDLING: {dayOrVal}{v}",
    // game.js line 7841 · renderRegister
    watered: "WATERED",
    // game.js line 7841 · renderRegister
    thirsty: "THIRSTY",
    // game.js line 7841 · renderRegister
    daysTendedTendedToday: "DAYS TENDED: {tended} · TODAY: {v}",
    // game.js line 7659 · renamePlantObj
    aNameForThis: "A NAME FOR THIS PLANT:",
    // game.js line 7759 · renderRegister
    plantRegister: "PLANT REGISTER",
    // game.js line 7764 · renderRegister
    pageRegpage1Pagecount: "PAGE {regPage}1/{pageCount}",
    // game.js line 7777 · renderRegister
    nothingHereYet: "NOTHING HERE. YET.",
    // game.js line 7778 · renderRegister
    aCardPageB: "A: CARD · ◀▶ PAGE · B: CLOSE",
    // game.js line 7781 · renderRegister
    theRegister: "THE REGISTER",
    // game.js line 7782 · renderRegister
    everyPlantByName: "THE NAMED, AND THE ROWS",
    // game.js line 7791 · renderRegister
    nameIndex: "NAME INDEX",
    // game.js line 7798 · renderRegister
    aNamesUnderThe: "A: NAMES UNDER THE LETTER · B: BACK",
    // game.js line 7800 · renderRegister
    theBackPages: "THE BACK PAGES",
    // game.js line 7801 · renderRegister
    inMemory: "IN MEMORY",
    // game.js line 7807 · renderRegister
    dayV: "DAY {v}",
    // game.js line 7809 · renderRegister
    noOneRestsHere: "NO ONE RESTS HERE. MAY IT STAY SO.",
    // game.js line 7811 · renderRegister
    rollCallNamedNamed: "ROLL CALL: {named} NAMED · {living} LIVING · {length} REMEMBERED",
    // game.js line 7812 · renderRegister
    berrydexLength18Cells: "BERRYDEX: {length}/18 CELLS SEEN",
    // game.js line 7813 · renderRegister
    wellTended: "WELL TENDED.",
    // game.js line 7833 · renderRegister
    goodDirt: "GOOD DIRT",
    // game.js line 7835 · renderRegister
    blueberry: "BLUEBERRY",
    // game.js line 7835 · renderRegister
    vPlantstagelabelval: "{v} · {plantStageLabelVal}",
    // game.js line 7836 · renderRegister
    rowRow: "ROW{row}",
    // game.js line 7836 · renderRegister
    livesAtV: "LIVES AT: {v}",
    // game.js line 7837 · renderRegister
    healthV: "HEALTH: {v}",
    // game.js line 7843 · renderRegister
    diedDayDiedday: "DIED: DAY {diedDay}",
    // game.js line 7843 · renderRegister
    causeV: "CAUSE: {v}",
    // game.js line 7845 · renderRegister
    harvestJoinval: "HARVEST: {joinVal}",
    // game.js line 7864 · regPageLines
    batchNVerdictHoney: "BATCH {n}: {verdict} (HONEY {toFixedVal}, CARE {care})",
    // game.js line 7865 · regPageLines
    poundsSharedDownThe: "POUNDS SHARED DOWN THE ROAD: {v}",
    // game.js line 7730 · regIndexEntries
    aZNameIndex: "A–Z NAME INDEX",
    // game.js line 7731 · regIndexEntries
    theBackPagesIn: "THE BACK PAGES — IN MEMORY",
    // game.js line 7732 · regIndexEntries
    germinationRecord: "GERMINATION RECORD",
    // game.js line 7733 · regIndexEntries
    omaSPromise: "OMA'S PROMISE",
    // game.js line 7734 · regIndexEntries
    theCellar: "THE CELLAR",
    // game.js line 7737 · regIndexEntries
    theGoats: "THE GOATS",
    // game.js line 7858 · regPageLines
    germination: "GERMINATION",
    // game.js line 7858 · regPageLines
    sownSownSeedsLate: "SOWN: {sown} SEEDS, LATE FALL.",
    // game.js line 7858 · regPageLines
    pottedUpPottedEvery: "POTTED UP: {potted} — THE COMPANY, ALL TOLD.",
    // game.js line 7858 · regPageLines
    lostAlongTheWay: "LOST ALONG THE WAY: {lost}.",
    // game.js line 7858 · regPageLines
    theTrayIsEmpty: "THE TRAY IS EMPTY NOW. THE SHELF IS NOT.",
    // game.js line 7859 · regPageLines
    shePromisedToStay: "SHE PROMISED TO STAY",
    // game.js line 7859 · regPageLines
    untilSheTastesThe: "UNTIL SHE TASTES THE FIRST WINE",
    // game.js line 7859 · regPageLines
    madeFromThisField: "MADE FROM THIS FIELD'S FRUIT.",
    // game.js line 7859 · regPageLines
    theJarIsFilled: "THE JAR IS FILLED AT LAST. AT THE TABLE HER GLASS IS SET OUT AND REMEMBERED — THE PROMISE KEPT, IN THE KEEPING.",
    // Decision 10 (Nov 27, 2026): a lesser verdict gets a soberer line — the
    // page no longer stamps the same triumph regardless of the wine.
    theJarIsFilledLesson: "THE JAR IS FILLED, AND IT IS A LESSON IN A JAR. HER GLASS WAITS FOR A KINDER YEAR — PROMISES IN THIS HOUSE ARE PATIENT.",
    // game.js line 7859 · regPageLines
    theJarWaitsEmpty: "THE JAR WAITS, EMPTY, PATIENT AS SHE IS.",
    // game.js line 7860 · regPageLines
    markvalBerrydexLength18: "{markVal}BERRYDEX: {length}/18 CELLS",
    // game.js line 7860 · regPageLines
    markvalAll12Rows: "{markVal}ALL 12 ROWS PLANTED",
    // game.js line 7860 · regPageLines
    markvalA900Lb: "{markVal}A 900-LB YEAR",
    // game.js line 7860 · regPageLines
    markvalALovelyBatch: "{markVal}A LOVELY BATCH",
    // game.js line 7860 · regPageLines
    markvalCellarStreak3: "{markVal}CELLAR STREAK: 3 LOVELY YEARS",
    // game.js line 7860 · regPageLines
    markvalEveryGardenEntry: "{markVal}EVERY GARDEN ENTRY FLOURISHING",
    // game.js line 7860 · regPageLines
    markvalRow1Accounted: "{markVal}THE FAVORITE ACCOUNTED FOR",
    // game.js line 7860 · regPageLines
    markvalRollCallLength: "{markVal}THE FIELD AT FULL STRENGTH: {length}/120 BUSHES",
    // game.js line 7860 · regPageLines
    theFieldIsYoung: "THE FIELD IS YOUNG. TEND IT.",
    // game.js line 7861 · regPageLines
    twoGoatsByAppeal: [
      "TWO GOATS, BY APPEAL, IN THE PEN",
      "BY THE GOOD SHED. THEY ARE NOT",
      "PLANTS. THEY ARE IN THE GARDEN",
      "PAGES ANYWAY, BECAUSE JOY IS A",
      "CATEGORY HERE, AND THE REGISTER",
      "HAS NEVER ONCE APOLOGIZED FOR IT.",
      "",
      "THEY EAT EVERYTHING EXCEPT THE",
      "BLUEBERRIES. THIS WAS NEGOTIATED.",
    ],
    // game.js line 7862 · regPageLines
    unknownSmallPrecise: [
      "UNKNOWN — SMALL — PRECISE.",
      "IT CUT THE SMALLEST, AT AN ANGLE,",
      "IN THE NIGHT, AND WAS NEVER",
      "NAMED, NEVER CAUGHT, NEVER",
      "SEEN AGAIN AFTER ALVIN FACED IT.",
      "",
      "THE NURSERY REMEMBERS. SO DOES",
      "THE DOG. ESPECIALLY THE DOG.",
    ],
    // game.js line 7866 · regPageLines
    noBatchesYet: [
      "NO BATCHES YET.",
    ],
    // REVISION (Nov 27, 2026) — the register reshaped: Favorites, rows,
    // the Company and the Nursery.
    favorites: "THE FAVORITE",
    theCompanyNursery: "THE COMPANY & THE NURSERY",
    theRows: "THE ROWS",
    rowSummaryLine: "ROW {rn} — {variety}: {n} BUSHES",
    rowDetailLine: "{stage} · {health} · YIELD {rating}",
    rowPoundsLine: "{lbs} LBS LIFETIME · SET {fs}%",
    rowPlantedLine: "PLANTED {v}",
    rowFavNote: "A FAVORITE STANDS HERE: {name}",
    rowFavNoteMany: "{n} FAVORITES STAND HERE",
    inTheGround: "IN THE GROUND: {n} BUSHES",
    companyCardN: "THE COMPANY: {n} STRONG",
    companyCardStage: "{stage} · {health} · AT {loc}",
    companyArchived: "THE COMPANY, DISSOLVED INTO",
    companyArchived2: "THE ROWS AT PLANTING DAY.",
    companyPlantedOut: "PLANTED OUT: {v}",
    companyRollLine: "THE POTTING ROLL IS KEPT ON",
    companyRollLine2: "THE GERMINATION PAGE.",
    nurseryCard: "THE NURSERY: {n} IN STOCK",
    nurseryCardStage: "{stage} · {health}",
    shornLine: "SHORN IN THE NIGHT",
    stockLostLine: "ONE LOST TO THE BARBER",
    rowPlantedWith: "PLANTED WITH: {joinVal}",
    nurseryStockedWith: "STOCKED FROM: {joinVal}",
    companyPottedFrom: "POTTED UP, ONE BY ONE, FROM THE TRAY",
    // ONE FAVORITE (Nov 27, 2026) — the circle is one: HOPE, and her
    // line after her. The rest are named, and kept, and written down
    // all the same; only the Favorite is mourned with a page.
    demotedLine: "THE REGISTER KEEPS ONE FAVORITE CLOSE. THIS ONE IS NAMED, AND KEPT, AND WRITTEN HERE ALL THE SAME.",
    goneLine: "{name} IS GONE. IT IS WRITTEN HERE, PLAINLY — A LINE IN THE REGISTER, THE WAY THIS HOUSE KEEPS ITS NEWS.",
    rowNamedNote: "A NAMED ONE STANDS HERE: {name}",
    rowNamedNoteMany: "{n} NAMED ONES STAND HERE",
    // Decision 11-A (Nov 27, 2026) — succession, register-driven: the
    // memorial page offers the replant; the name goes on, in hope.
    succPlant: "PLANT {name}",
    succLine: "SUCCEEDED BY {name} — PLANTED DAY {day}.",
    succBornLine: "PLANTED IN {name}'S PLACE, FROM THE NURSERY — THE NAME GOES ON, IN HOPE.",
    succPlanted: "IN THE GROUND: {name}.",
    succNoStock: "THE NURSERY SHELF IS EMPTY — NOTHING TO PLANT FROM.",
    succCircleFull: "THE CIRCLE OF ONE STANDS WITH ANOTHER NAME.",
  },

  // ======================================================================
  // THE BERRYDEX — a reference shelf in the back of the register
  // (Nov 27, 2026). Real blueberry varieties and their real habits,
  // researched from Bluegrass Blueberries' own catalog and shop
  // (checked Nov 27, 2026) and university extension publications.
  // Facts stay facts: where sources disagreed, both figures are
  // printed; what could not be verified is printed as unverified.
  // Nothing here is a quest, a prompt, or a HUD — it sits in the
  // journal for whoever goes looking.
  // The marks on each entry: bg — YES (Bluegrass sells it), LISTED
  // (in their shop, but their guide says otherwise — see the note),
  // GUIDE (in their guide; no shop listing could be verified), NO.
  // z6 — YES (its range covers zone 6A), EDGE (borderline: 6A is the
  // cold edge of its range), NO.
  // ======================================================================
  berrydex: {
    indexLabel: "THE BERRYDEX — VARIETIES",
    title: "THE BERRYDEX",
    subTitle: "A REFERENCE SHELF, KEPT BY HAND",
    menuVarieties: "THE VARIETIES ({n})",
    menuAbout: "ABOUT THIS SHELF",
    menuPrimer: "THE FOUR KINDS",
    menuCare: "A YEAR OF CARE",
    menuSources: "THE SOURCES",
    pageOf: "PAGE {p} OF {n}",
    hintList: "A: READ · ARROWS: TURN · B: BACK",
    // field labels on a variety's page
    fType: "TYPE:",
    fAka: "SOLD AS:",
    fZones: "ZONES:",
    fChill: "CHILL:",
    fSize: "SIZE:",
    fFruit: "FRUIT:",
    fSeason: "SEASON:",
    fYield: "YIELD:",
    fPoll: "POLLINATION:",
    fNotes: "NOTES:",
    fBluegrass: "BLUEGRASS:",
    fZone6a: "ZONE 6A:",
    // the marks, written out
    bgYes: "SELLS IT",
    bgNo: "DOES NOT SELL IT",
    bgListed: "LISTED IN THE SHOP — SEE THE NOTE",
    bgGuide: "IN THEIR GUIDE; SHOP LISTING UNVERIFIED",
    z6Yes: "YES",
    z6Edge: "BORDERLINE — THE COLD EDGE OF ITS RANGE",
    z6No: "NO",
    // the marks, as they appear in the variety list
    chipBg: "BG",
    chipBgQ: "BG?",
    chipZ6: "6A",
    chipZ6Q: "6A?",
    chipNone: "--",
    // ABOUT THIS SHELF — the framing, and how to read the marks
    about: [
      "TUCKED IN THE BACK OF THE PLANT REGISTER, BEHIND THE PAGES FRANK ACTUALLY WRITES IN, IS A REFERENCE SHELF HE KEEPS ADDING TO: THE BERRYDEX. REAL BLUEBERRY VARIETIES — THE ONES A REAL GROWER CAN ORDER AND PLANT — WITH THEIR REAL HABITS: HOW COLD THEY CAN STAND, HOW MUCH WINTER THEY NEED, WHEN THEY FRUIT, AND WHAT THEY ASK OF THE PERSON GROWING THEM.",
      "IT IS NOT PART OF ANY QUEST. NOBODY IN DEERBROOK WILL EVER MENTION IT. IT IS SIMPLY THERE, THE WAY A GOOD BOOK IS SIMPLY THERE ON THE SHELF, FOR WHOEVER GOES LOOKING.",
      "EACH ENTRY IS MARKED TWO WAYS. BLUEGRASS: WHETHER BLUEGRASS BLUEBERRIES, A FAMILY NURSERY IN OAKLAND, KENTUCKY — GROWING BLUEBERRY PLANTS SINCE 1995 — SELLS THE VARIETY, PER THEIR CATALOG AND SHOP AS CHECKED NOV 27, 2026. IN THE LIST IT READS BG, OR BG? WHEN THE SALE IS LISTED BUT QUESTIONED — SEE THE ENTRY. ZONE 6A: WHETHER THE VARIETY'S PUBLISHED HARDINESS RANGE COVERS USDA ZONE 6A, FRANK'S GROUND. YES MEANS THE RANGE INCLUDES 6A (6A IN THE LIST). BORDERLINE MEANS 6A SITS AT THE COLD EDGE OF ITS RANGE: IT MAY GROW, BUT HARD WINTERS CAN TAKE BUDS OR CANES (6A?). NO MEANS WINTER, NOT THE GROWER, WILL END THE EXPERIMENT (--).",
      "A NOTE ON MONTHS: RIPENING MONTHS MARKED (KENTUCKY) ARE BLUEGRASS'S OWN, FROM THEIR FIELDS IN KENTUCKY (ABOUT ZONE 6B-7). ON COLDER 6A GROUND, EXPECT THE SAME VARIETIES ROUGHLY ONE TO TWO WEEKS LATER.",
      "A NOTE ON CHILL HOURS: A VARIETY'S CHILL REQUIREMENT IS THE NUMBER OF WINTER HOURS (ROUGHLY 32-45F) IT MUST ACCUMULATE BEFORE IT WILL BREAK DORMANCY AND FRUIT PROPERLY. ZONE 6A WINTERS NORMALLY DELIVER WELL OVER 1,000 CHILL HOURS — ENOUGH FOR EVERY NORTHERN VARIETY IN THIS BOOK, AND FAR MORE THAN THE SOUTHERN ONES ASK FOR. FOR SOUTHERN VARIETIES THE PROBLEM IN 6A IS NEVER CHILL. IT IS COLD ITSELF.",
      "TWO FAMILY NOTES. THE THREE HALF-HIGHS (CHIPPEWA, NORTHBLUE, POLARIS) ARE NOT SOLD BY BLUEGRASS — THEY ARE HERE BECAUSE THEY ARE THE COMMON VARIETIES OF COLD-CLIMATE CATALOGS, AND ALL THREE SUIT 6A. AND THE RABBITEYES ARE ALL MARKED NO FOR 6A, HERE AND ON EVERY ENTRY, BECAUSE A BERRYDEX THAT FLATTERED THEM WOULD BE LYING.",
    ],
    // THE FOUR KINDS — and pollination, once for the whole book
    primer: [
      { h: "NORTHERN HIGHBUSH", t: "THE CLASSIC GARDEN AND FARM BLUEBERRY OF THE NORTH. ZONES ROUGHLY 4-7, NEEDS 800-1,000+ CHILL HOURS, BUSHES 4-7 FT. THIS IS THE TYPE FOR ZONE 6A, AND MOST OF THIS BOOK IS GIVEN TO IT." },
      { h: "HALF-HIGH", t: "NORTHERN HIGHBUSH CROSSED WITH LOWBUSH, BRED MOSTLY AT THE UNIVERSITY OF MINNESOTA FOR THE COLDEST GARDENS. SHORT (2-4 FT), EXTREMELY WINTER-HARDY (ZONES 3-7), SMALLER CROPS. GOOD FOR SMALL YARDS AND POTS." },
      { h: "SOUTHERN HIGHBUSH", t: "HIGHBUSH CROSSED WITH SOUTHERN SPECIES TO NEED LITTLE CHILL (150-600 HOURS). ZONES ROUGHLY 7-10, A FEW HARDIER ONES REACHING ZONE 5-6. IN 6A, MOST ARE A GAMBLE; TWO ARE LISTED HERE AS BORDERLINE, AND THE HARDY HYBRID LEGACY AS A GENUINE YES." },
      { h: "RABBITEYE", t: "THE SOUTH'S OWN BLUEBERRY (VACCINIUM VIRGATUM), BIG BUSHES (6-12 FT), HEAT- AND DROUGHT-TOLERANT, ZONES 7-9 PER BLUEGRASS'S OWN GUIDE. NOT HARDY IN 6A. INCLUDED BECAUSE BLUEGRASS SELLS THEM AND BECAUSE A BERRYDEX SHOULD TELL THE TRUTH ABOUT THE WHOLE FAMILY — INCLUDING THE COUSINS WHO CANNOT COME NORTH." },
      { h: "POLLINATION, ONCE FOR THE WHOLE BOOK", t: "NEARLY ALL BLUEBERRIES ARE SELF-FERTILE — ONE BUSH ALONE WILL FRUIT. BUT PLANTING TWO OR MORE DIFFERENT VARIETIES WITH OVERLAPPING BLOOM GIVES NOTICEABLY MORE BERRIES, AND LARGER ONES, ON ALMOST EVERY VARIETY HERE. RABBITEYES ARE THE EXCEPTION IN DEGREE: THEY GENUINELY NEED A DIFFERENT RABBITEYE VARIETY NEARBY TO CROP WELL. VARIETIES WHOSE SELF-FERTILITY IS NOTABLY WEAK ARE FLAGGED IN THEIR ENTRIES." },
    ],
    careIntro: "FOR BLUEBERRIES GENERALLY; VARIETY NOTES WHERE THEY DIFFER. WRITTEN FOR 6A WINTERS AND SUMMERS.",
    // A YEAR OF CARE (zone 6A)
    care: [
      { h: "THE GROUND RULES, ALL YEAR", lines: [
        "SOIL IS THE WHOLE SECRET. BLUEBERRIES NEED ACID SOIL, PH 4.5-5.5, HIGH IN ORGANIC MATTER AND WELL DRAINED. TEST BEFORE PLANTING — A SOIL TEST, NOT A GUESS.",
        "IF PH MUST COME DOWN, WORK IN ELEMENTAL SULFUR ABOUT SIX MONTHS BEFORE PLANTING; IT ACIDIFIES SLOWLY, AS SOIL BACTERIA CONVERT IT.",
        "NEVER USE ALUMINUM SULFATE — BLUEBERRIES ARE SENSITIVE TO ALUMINUM (UNIV. OF MARYLAND). PEAT MOSS MIXED INTO THE PLANTING HOLE HELPS ACIDIFY AND FEEDS THE ROOTS ORGANIC MATTER.",
        "SUN: FULL SUN, 8+ HOURS FOR THE BEST CROPS.",
        "SPACING: 4-5 FT BETWEEN BUSHES IN A ROW.",
        "ROOTS ARE SHALLOW AND NEARLY HAIRLESS — THEY DRINK FROM THE TOP FOOT OF SOIL AND SUFFER DROUGHT FAST. MULCH AND STEADY WATER MATTER MORE FOR BLUEBERRIES THAN FOR ALMOST ANY OTHER FRUIT.",
        "FRUIT FORMS ON LAST YEAR'S WOOD. THE MOST PRODUCTIVE CANES ARE ABOUT FIVE YEARS OLD; CANES PAST SEVEN OR EIGHT FADE AND ARE PRUNED OUT AT THE CROWN TO MAKE ROOM FOR YOUNG ONES (UNIV. OF MARYLAND).",
      ] },
      { h: "LATE WINTER (FEBRUARY-MARCH) — PRUNING SEASON", lines: [
        "PRUNE WHILE FULLY DORMANT, BEFORE BUD BREAK. ON YOUNG BUSHES: REMOVE WEAK, SPINDLY, AND LOW-GROWING SHOOTS AND ANY CROSSING CANES.",
        "ON MATURE BUSHES (YEAR 6+): RENEWAL PRUNING — CUT OUT ONE TO THREE OF THE OLDEST, THICKEST CANES AT THE CROWN EACH YEAR, KEEPING A BUSH OF ROUGHLY 12-18 CANES OF MIXED AGES. REMOVE LOW CANES WHOSE FRUIT WOULD TOUCH THE GROUND.",
        "A NEGLECTED BUSH CAN BE REJUVENATED BY CUTTING OUT ALL THE OLD WOOD AT ONCE, ACCEPTING A FEW LEAN YEARS WHILE IT REGROWS.",
        "THIS IS ALSO WHEN TO TAKE STOCK: WHICH VARIETIES EARNED THEIR GROUND, WHICH BUSH SULKED, WHAT THE SOIL TEST SAYS THIS YEAR (RETEST EVERY TWO OR THREE YEARS).",
      ] },
      { h: "SPRING (MARCH-MAY) — PLANTING AND FIRST FEEDING", lines: [
        "PLANT BARE-ROOT OR CONTAINER BUSHES IN EARLY SPRING IN 6A (FALL PLANTING SUITS MILDER ZONES BETTER). AT PLANTING, PRUNE BACK A THIRD TO A HALF OF EACH CANE AND REMOVE ALL FLOWER BUDS THE FIRST YEAR — A NEW BUSH SHOULD SPEND ITS FIRST SEASON ON ROOTS, NOT FRUIT. PINCH THE FLOWERS OFF IN YEAR TWO AS WELL FOR THE STRONGEST START.",
        "FERTILIZE WITH THE AMMONIUM FORM OF NITROGEN — AMMONIUM SULFATE (21-0-0) IS THE STANDARD — BECAUSE BLUEBERRIES USE AMMONIUM AND ARE HARMED BY NITRATE-HEAVY FEEDS.",
        "UNIV. OF MARYLAND'S SCHEDULE: NOTHING THE FIRST YEAR; IN YEAR TWO, 2 OZ OF AMMONIUM SULFATE PER PLANT AT BLOOM AND THE SAME AGAIN THREE WEEKS LATER, SCATTERED IN A RING 12-18 INCHES FROM THE CROWN; ADD 1 OZ PER YEAR UNTIL YEAR SIX, THEN 8 OZ PER PLANT YEARLY.",
        "IF POTASSIUM IS NEEDED, USE POTASSIUM SULFATE, NOT POTASSIUM CHLORIDE.",
        "BLOOM COMES IN SPRING, AND BEES DO THE REST — BUMBLEBEES AND NATIVE BEES POLLINATE BLUEBERRIES BETTER THAN HONEYBEES. A LATE FROST DURING BLOOM IS THE YEAR'S GREAT DANGER; EARLY VARIETIES THAT BLOOM LATE (DUKE) OR SITES WITH GOOD AIR DRAINAGE ARE THE QUIET INSURANCE.",
      ] },
      { h: "SUMMER (JUNE-AUGUST) — WATER, MULCH, HARVEST", lines: [
        "WATER DEEPLY AND STEADILY — ABOUT 1-1 1/2 INCHES A WEEK THROUGH DRY SPELLS, MORE WHILE FRUIT IS SIZING. DRIP LINES OR SOAKER HOSES UNDER THE MULCH ARE BETTER THAN SPRINKLERS: WET FOLIAGE INVITES DISEASE.",
        "KEEP 2-4 INCHES OF ORGANIC MULCH YEAR-ROUND — PINE BARK, WOOD CHIPS, AGED SAWDUST, OR PINE NEEDLES — OVER THE ROOT ZONE, PULLED A FEW INCHES BACK FROM THE CROWN. IT HOLDS MOISTURE, COOLS THE SHALLOW ROOTS, AND FEEDS THE ACIDITY AS IT BREAKS DOWN.",
        "BIRDS: NET THE BUSHES AS THE FIRST BERRIES COLOR, OR ACCEPT THE TITHE. THERE IS NO THIRD ARRANGEMENT THAT WORKS.",
        "HARVEST: A BERRY TURNS BLUE 3-6 DAYS BEFORE IT IS TRULY RIPE. WAIT UNTIL IT IS BLUE ALL THE WAY TO THE STEM — ANY RED AT THE STEM END MEANS UNDER-RIPE, AND BLUEBERRIES DO NOT RIPEN AFTER PICKING.",
        "RIPE BERRIES ROLL OFF INTO THE PALM WITH A GENTLE TOUCH. PICK IN THE MORNING AFTER THE DEW DRIES, EVERY FEW DAYS THROUGH THE SEASON; A MATURE HIGHBUSH GIVES ROUGHLY 6-8 LBS (7-9 PINTS) A YEAR, MORE FOR THE HEAVY VARIETIES IN THIS BOOK.",
        "PICKING RUNS JUNE (EARLIBLUE, DUKE) THROUGH AUGUST (ELLIOTT) IN 6A IF THE PATCH MIXES EARLY, MID, AND LATE VARIETIES.",
        "WATCH FOR YELLOW LEAVES WITH GREEN VEINS (IRON CHLOROSIS): IT ALMOST ALWAYS MEANS THE SOIL PH HAS CREPT ABOVE 5.5-6.0, NOT THAT IRON IS ABSENT. THE CURE IS ACIDIFYING THE SOIL, NOT DOSING THE PLANT.",
      ] },
      { h: "FALL (SEPTEMBER-NOVEMBER) — PUTTING THE PATCH TO BED", lines: [
        "THE BUSHES PAY A SECOND DIVIDEND: FALL FOLIAGE IN CRIMSON, ORANGE, AND SCARLET — BLUERAY, BLUECROP, AND EARLIBLUE ARE ESPECIALLY FINE.",
        "KEEP WATERING IN A DRY FALL UNTIL THE LEAVES DROP; ROOTS GROW WHILE THE SOIL IS WARM.",
        "RENEW THE MULCH BEFORE WINTER. DO NOT FERTILIZE NOW — LATE NITROGEN PUSHES TENDER GROWTH THAT WINTER WILL KILL.",
        "IF SOIL PH NEEDS A BIGGER CORRECTION, FALL IS A GOOD TIME TO WORK IN SULFUR, GIVING IT THE WINTER TO BEGIN ACIDIFYING BEFORE SPRING PLANTING.",
      ] },
      { h: "WINTER (DECEMBER-FEBRUARY) — THE QUIET WORK", lines: [
        "THE CHILL HOURS ACCUMULATE NOW — 6A WINTERS GIVE NORTHERN VARIETIES ALL THEY NEED. THIS IS THE SEASON THE WHOLE NORTHERN HALF OF THIS BOOK IS BUILT FOR, AND THE SEASON THAT RULES THE SOUTHERN HALF OUT.",
        "WATER DEEPLY BEFORE THE GROUND FREEZES IF THE FALL HAS BEEN DRY; A BUSH ENTERING WINTER THIRSTY WINTERKILLS MORE EASILY.",
        "HALF-HIGHS WELCOME SNOW COVER — IT INSULATES THEM AGAINST THE DEEPEST COLD. LEAVE THE SNOW ON THEM.",
        "ORDER PLANTS FOR SPRING (THIS IS WHEN THE NURSERIES' CATALOGS ARE READ — BLUEGRASS TAKES ORDERS FOR PLUGS AND CONTAINER PLANTS THROUGH THE WINTER).",
        "PRUNE ON A MILD LATE-WINTER DAY, AND THE YEAR COMES ROUND AGAIN.",
      ] },
    ],
    // THE SOURCES — where the facts came from
    sources: [
      "BLUEGRASS BLUEBERRIES (BLUEGRASSBLUEBERRIES.COM), OAKLAND, KENTUCKY — HOMEPAGE GROW LIST, ONLINE SHOP LISTINGS, AND THE VARIETY GUIDE 'WHAT BLUEBERRY PLANT VARIETY IS GOOD FOR MY AREA?': THEIR OWN DESCRIPTIONS, HEIGHTS, KENTUCKY RIPENING MONTHS, AND YIELDS; THE SHARPBLUE PRODUCT PAGE FOR ITS CHILL HOURS AND ZONES. ALL CHECKED NOV 27, 2026.",
      "UNIVERSITY OF MARYLAND EXTENSION — 'BLUEBERRY CULTIVARS FOR MARYLAND AND THE GREATER MID-ATLANTIC REGION': CHILL HOURS, SEASONS, TORO'S LOW SELF-FERTILITY, SPARTAN'S MUMMY-BERRY RESISTANCE, NELSON'S COLD TOLERANCE. AND 'GROWING BLUEBERRIES IN A HOME GARDEN': SOIL PH 4.5-5.5, SULFUR TIMING, THE ALUMINUM-SULFATE WARNING, THE FERTILIZER SCHEDULE, PRUNING, MULCHING, HARVEST RIPENESS.",
      "UNIVERSITY OF MINNESOTA EXTENSION — 'GROWING BLUEBERRIES IN THE HOME GARDEN': HALF-HIGH VARIETY SIZES, YIELDS, AND HARDINESS FROM THEIR TRIALS (CHIPPEWA, NORTHBLUE, POLARIS); SOIL PREPARATION.",
      "MICHIGAN STATE UNIVERSITY EXTENSION — 'HIGHBUSH BLUEBERRY VARIETIES FOR MICHIGAN': FRUIT QUALITY AND YIELD RATINGS FOR BERKELEY, ELIZABETH, EARLIBLUE, AND OTHERS.",
      "FALL CREEK FARM & NURSERY — U.S./CANADA NURSERY CATALOG VARIETY CHART: ZONE RANGES AND CHILL FIGURES (EARLIBLUE, NORTHLAND, BLUEJAY, DRAPER AT 1,000+).",
      "KRIEGER'S WHOLESALE NURSERY AND SKY NURSERY (VARIETY HANDOUTS): ZONE RANGES AND DESCRIPTIVE DETAILS FOR BERKELEY, EARLIBLUE, DRAPER, NORTHLAND.",
      "BLUEBERRY BUSHES.COM VARIETY PROFILES — A NURSERY COMPILATION USED ONLY TO CROSS-CHECK ZONE, CHILL, AND SEASON FIGURES AGAINST THE EXTENSION SOURCES ABOVE; WHERE IT DISAGREED WITH EXTENSION, EXTENSION WON.",
      "KNOWN DISAGREEMENTS AND GAPS, KEPT VISIBLE ON PURPOSE: O'NEAL CHILL HOURS, 200-300 (UNIV. OF CALIFORNIA) VS 500-600 (UNIV. OF MARYLAND) — BOTH PRINTED IN ITS ENTRY. LEGACY CHILL, 500-600 (COMMONLY CITED) VS 700-900 (MARYLAND) — BOTH PRINTED. HALF-HIGH CHILL: NO OFFICIAL PUBLISHED FIGURES; THE 800-1,000 RANGE IS NURSERY CONVENTION AND IS LABELED AS SUCH. BERKELEY CHILL: NO VARIETY-SPECIFIC FIGURE VERIFIED; THE TYPE'S STANDARD 800-1,000 IS PRINTED AND FLAGGED. COLUMBUS: CHILL AND SEASON UNVERIFIED — PRINTED AS UNVERIFIED RATHER THAN FILLED IN. JERSEY AT BLUEGRASS: THEIR GUIDE SAYS DISCONTINUED; THEIR SHOP STILL LISTED IT — FLAGGED ON THE ENTRY.",
    ],
    // THE VARIETIES — in the order of the research draft: northern
    // highbush first, then the half-highs, the southern highbush and
    // the hardy hybrid, and the rabbiteyes last.
    varieties: [
      { name: "DUKE", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7 (SOME CATALOGS 4-8)", chill: "800-1,000 HRS", size: "4-6 FT TALL",
        fruit: "LARGE, FIRM, LIGHT BLUE; VERY SWEET",
        season: "EARLY — EARLY TO MID-JUNE (KENTUCKY)",
        yld: "HEAVY, 15-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "THE COMMERCIAL STANDARD FOR EARLY FRUIT — THE MOST WIDELY PLANTED EARLY VARIETY IN THE COUNTRY. BLOOMS LATE FOR AN EARLY VARIETY, WHICH SLIPS ITS FLOWERS PAST MOST SPRING FROSTS, THEN RIPENS EARLY ANYWAY.",
        bg: "YES", z6: "YES" },
      { name: "EARLIBLUE", aka: "EARLY BLUE", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7 (SOME CATALOGS 5-8)", chill: "800-1,000 HRS", size: "4-6 FT TALL, UPRIGHT",
        fruit: "MEDIUM-LARGE, FIRM, LIGHT BLUE; SWEET, GOOD DESSERT QUALITY",
        season: "VERY EARLY — OFTEN THE FIRST OF THE YEAR; EARLY JUNE (KENTUCKY)",
        yld: "10-20 LBS PER MATURE BUSH (BLUEGRASS); RATED LOW-TO-MODERATE IN MICHIGAN TRIALS",
        poll: "SELF-FERTILE; CROPS LARGER WITH BLUECROP OR JERSEY NEARBY",
        notes: "ONE OF THE OLDEST NAMED VARIETIES (RELEASED 1952). FRUIT RESISTS CRACKING. RED-TO-BURGUNDY FALL COLOR AND BRIGHT RED WINTER BARK.",
        bg: "YES", z6: "YES" },
      { name: "SPARTAN", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "5-7", chill: "800-1,000 HRS", size: "5-6 FT TALL",
        fruit: "VERY LARGE; FLAVOR RATED AMONG THE BEST OF THE EARLY VARIETIES",
        season: "EARLY — EARLY TO MID-JUNE (KENTUCKY)",
        yld: "10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "RESISTANT TO MUMMY BERRY DISEASE (UNIV. OF MARYLAND). CAUTION: FUSSY ABOUT DRAINAGE — IT DISLIKES WET FEET AND WANTS LOOSE, WELL-DRAINED SOIL. A FAVORITE FOR U-PICK FARMS WHERE THE SOIL SUITS IT.",
        bg: "YES", z6: "YES" },
      { name: "PATRIOT", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "3-7 — ONE OF THE HARDIEST HIGHBUSH VARIETIES", chill: "800-1,000 HRS", size: "4-5 FT TALL",
        fruit: "VERY LARGE (ABOUT 50-60 BERRIES PER CUP), FIRM, SMALL PICKING SCAR",
        season: "EARLY, OVER A LONG WINDOW — JUNE INTO JULY (KENTUCKY)",
        yld: "HEAVY, 10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "TOLERATES HEAVIER, WETTER SOILS BETTER THAN MOST BLUEBERRIES, WHICH MAKES IT THE FORGIVING CHOICE FOR IMPERFECT GROUND. GOOD FALL COLOR.",
        bg: "YES", z6: "YES" },
      { name: "BLUEJAY", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7 (SOME CATALOGS 4-8)", chill: "800-1,000 HRS", size: "5-7 FT TALL",
        fruit: "MEDIUM-LARGE (ABOUT 75 PER CUP), FIRM, LIGHT BLUE; MILD, SLIGHTLY TART",
        season: "EARLY — FIRST TO MID-JUNE (KENTUCKY)",
        yld: "10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "FAST-GROWING AND VIGOROUS. FRUIT HANGS ON THE BUSH A LONG TIME WITHOUT LOSING QUALITY, WHICH FORGIVES A PICKER WHO IS A FEW DAYS LATE.",
        bg: "YES", z6: "YES" },
      { name: "BLUERAY", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "ABOUT 800 HRS", size: "5-7 FT TALL",
        fruit: "VERY LARGE (ABOUT 60 PER CUP), FIRM, SMALL PICKING SCAR; EXCELLENT FLAVOR",
        season: "EARLY-MID — LATE JUNE INTO EARLY JULY (KENTUCKY)",
        yld: "HEAVY, 10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "AN OLD HOME-GARDEN FAVORITE. THE PLANT TOLERATES HEAT WELL FOR A NORTHERN VARIETY (UNIV. OF MARYLAND), AND THE FRUIT RESISTS CRACKING. BEST PICKED BY HAND.",
        bg: "YES", z6: "YES" },
      { name: "BLUECROP", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "800-1,000 HRS", size: "5-6 FT TALL",
        fruit: "LARGE (ABOUT 65 PER CUP), FIRM, BRIGHT LIGHT BLUE; CLASSIC SWEET FLAVOR",
        season: "MID — MID TO LATE JUNE (KENTUCKY)",
        yld: "10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "THE STANDARD AGAINST WHICH OTHER VARIETIES ARE MEASURED; FOR DECADES THE MOST PLANTED BLUEBERRY IN THE WORLD. FRUIT RESISTS CRACKING. ITS ONE VICE IS GENEROSITY — IT TENDS TO OVERBEAR, AND PRUNING FOR QUALITY OVER QUANTITY IS REPAID. ORANGE-RED FALL COLOR.",
        bg: "YES", z6: "YES" },
      { name: "TORO", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7 (SOME CATALOGS 4-8)", chill: "800-1,000 HRS", size: "4-6 FT TALL",
        fruit: "VERY LARGE, FIRM, HANDSOME DARK BLUE",
        season: "MID",
        yld: "MODERATE (UNIV. OF MARYLAND)",
        poll: "LOW SELF-FERTILITY — PLANT A PARTNER VARIETY WITH IT (UNIV. OF MARYLAND). THIS IS THE ENTRY WHERE THE GENERAL RULE BECOMES A REQUIREMENT.",
        notes: "BERRIES RIPEN IN TIGHT CLUSTERS OVER A SHORT WINDOW, NEARLY ALL AT ONCE — A PRESERVER'S VARIETY, MADE FOR THE JAM POT AND THE FREEZER.",
        bg: "YES", z6: "YES" },
      { name: "DRAPER", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "5-7 (SOME CATALOGS 4-7)", chill: "800-1,000 HRS", size: "4-5 FT TALL, COMPACT",
        fruit: "LARGE, POWDER-BLUE, VERY FIRM AND CRISP; RICH FLAVOR",
        season: "EARLY-MID",
        yld: "HEAVY FOR ITS SIZE; HARVEST IS CONCENTRATED",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "BRED AT MICHIGAN STATE UNIVERSITY FOR COLD WINTERS AND MACHINE HARVEST; THE BERRIES KEEP UNUSUALLY WELL AFTER PICKING. YELLOW FALL FOLIAGE. A TIDY BUSH THAT SUITS A SMALLER YARD.",
        bg: "YES", z6: "YES" },
      { name: "BERKELEY", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "5-7", chill: "800-1,000 HRS (THE TYPE'S USUAL FIGURE; A BERKELEY-SPECIFIC PUBLISHED FIGURE WAS NOT VERIFIED)", size: "4-6 FT TALL, SPREADING HABIT",
        fruit: "LARGE, LIGHT BLUE, FIRM; MILD, LOW-ACID, SWEET",
        season: "MID-LATE",
        yld: "MODERATE (MICHIGAN STATE TRIALS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "A CLOSE COUSIN OF BLUECROP AND LONG A COMMERCIAL STANDBY. BLUEGRASS GROWS IT BUT PUBLISHES NO DESCRIPTION OF IT; THE FACTS HERE ARE FROM EXTENSION AND NURSERY SOURCES.",
        bg: "YES", z6: "YES" },
      { name: "CHANDLER", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "800-1,000 HRS", size: "5-6 FT TALL",
        fruit: "EXTRA-LARGE — AMONG THE LARGEST OF ANY BLUEBERRY, SOME BERRIES APPROACHING THE SIZE OF A QUARTER",
        season: "MID-LATE, WITH AN EXCEPTIONALLY LONG PICKING WINDOW — UP TO SIX WEEKS FROM ONE BUSH",
        yld: "HEAVY",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "THE VARIETY FOR PEOPLE WHO PICK A BOWL AT A TIME OVER A WHOLE SUMMER RATHER THAN A BUCKET IN ONE DAY. SOLD BY BLUEGRASS AS PLUGS; IT DOES NOT APPEAR IN THEIR PRINTED VARIETY GUIDE, SO ITS FACTS HERE ARE FROM EXTENSION AND NURSERY SOURCES.",
        bg: "YES", z6: "YES" },
      { name: "NELSON", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "800-1,000 HRS", size: "4-6 FT TALL, UPRIGHT",
        fruit: "LARGE, FIRM; GOOD FLAVOR",
        season: "LATE",
        yld: "HIGH (UNIV. OF MARYLAND)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "GOOD COLD TOLERANCE (UNIV. OF MARYLAND) AND A DEPENDABLE LATE-SEASON BRIDGE BETWEEN BLUECROP AND ELLIOTT.",
        bg: "YES", z6: "YES" },
      { name: "ELIZABETH", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "800-1,000 HRS (COMMONLY CITED FOR THE VARIETY)", size: "4-6 FT TALL",
        fruit: "LARGE; FLAVOR RATED AMONG THE VERY BEST BY MANY GROWERS",
        season: "LATE",
        yld: "LOW TO MODERATE (MICHIGAN STATE TRIALS) — GROWN FOR FLAVOR, NOT BULK",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "NAMED FOR ELIZABETH COLEMAN WHITE, THE NEW JERSEY PIONEER WHO FIRST BROUGHT CULTIVATED BLUEBERRIES TO MARKET. THE CONNOISSEUR'S BUSH: PLANT IT FOR THE BOWL ON THE TABLE, NOT THE FREEZER.",
        bg: "YES", z6: "YES" },
      { name: "JERSEY", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "800-1,000 HRS", size: "5-7 FT TALL",
        fruit: "SMALL TO MEDIUM (ABOUT 110 PER CUP); SWEET, A CLASSIC BAKING BERRY",
        season: "LATE — MID TO LATE JULY (KENTUCKY)",
        yld: "7-10 LBS PER MATURE BUSH (BLUEGRASS) — MODEST",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "ONE OF THE OLDEST VARIETIES (1934) AND FOR GENERATIONS THE DEPENDABLE LATE BUSH. A CATALOG CAUTION: BLUEGRASS'S OWN VARIETY GUIDE SAYS THEY NO LONGER CARRY JERSEY, CITING LOW YIELD AND DISEASE PROBLEMS IN KENTUCKY — THOUGH A JERSEY PLUG LISTING WAS STILL IN THEIR ONLINE SHOP IN NOV 2026. WHICH IS CURRENT COULD NOT BE VERIFIED; ASK BEFORE ORDERING.",
        bg: "LISTED", z6: "YES" },
      { name: "ELLIOTT", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH", zones: "4-7", chill: "800-1,000 HRS", size: "6-7 FT TALL",
        fruit: "SMALL TO MEDIUM (ABOUT 75 PER CUP), VERY FIRM; SLIGHTLY TANGY — LET IT HANG UNTIL FULLY RIPE, WHEN IT SWEETENS",
        season: "VERY LATE — MID TO LATE JULY (KENTUCKY), INTO AUGUST FURTHER NORTH; THE LAST OF THE NORTHERN SEASON",
        yld: "10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "THE SEASON-CLOSER. PAIRED WITH AN EARLY VARIETY, IT STRETCHES ONE GARDEN'S HARVEST FROM JUNE INTO LATE SUMMER. FRUIT STORES WELL.",
        bg: "YES", z6: "YES" },
      { name: "NORTHLAND", group: "NORTHERN HIGHBUSH",
        type: "NORTHERN HIGHBUSH X LOWBUSH CROSS (OFTEN CLASSED AS HALF-HIGH)", zones: "3-7", chill: "800-1,000 HRS", size: "3-4 FT TALL, SPREADING 4-5 FT WIDE",
        fruit: "MEDIUM, DARK BLUE; SWEET, WITH SOMETHING OF THE WILD BERRY'S FLAVOR",
        season: "EARLY-MID",
        yld: "VERY HEAVY — MATURE PLANTS HAVE BEEN REPORTED OVER 20 LBS",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "AMONG THE MOST COLD-HARDY OF ALL HIGHBUSH-TYPE VARIETIES, BRED IN MICHIGAN. ITS BRANCHES ARE FLEXIBLE AND BEND UNDER SNOW INSTEAD OF BREAKING. A GOOD CHOICE WHERE WINTERS ARE THE WHOLE ARGUMENT.",
        bg: "YES", z6: "YES" },
      { name: "PINK LEMONADE", group: "NORTHERN HIGHBUSH",
        type: "HIGHBUSH HYBRID — THE PINK-FRUITED NOVELTY", zones: "4-8", chill: "300-500 HRS (SOURCES VARY)", size: "4-5 FT TALL",
        fruit: "MEDIUM; RIPE FRUIT IS PINK, NOT BLUE — SWEET AND MILD, WITH THE FAINTEST LEMONY NOTE THE NAME PROMISES",
        season: "MID-LATE",
        yld: "MODERATE",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "DEVELOPED BY THE USDA. CHILDREN AND NEIGHBORS WILL ASK ABOUT THIS BUSH; NO OTHER ENTRY IN THIS BOOK CAN SAY THAT. PICK IT PINK — WAITING FOR BLUE MEANS WAITING FOREVER.",
        bg: "YES", z6: "YES" },
      { name: "CHIPPEWA", group: "HALF-HIGH",
        type: "HALF-HIGH", zones: "3-7", chill: "COMMONLY LISTED ABOUT 800-1,000 HRS (NO OFFICIAL FIGURE IS PUBLISHED FOR MOST HALF-HIGHS)", size: "ABOUT 4 1/2 FT TALL X 5 FT WIDE (UNIV. OF MINNESOTA TRIALS)",
        fruit: "MEDIUM-LARGE, SKY BLUE, FIRM; SWEET",
        season: "MID",
        yld: "3-8 LBS PER BUSH IN MINNESOTA TRIALS",
        poll: "BETTER WITH A SECOND VARIETY",
        notes: "A UNIVERSITY OF MINNESOTA INTRODUCTION (1996) AND THE TALLEST OF ITS HALF-HIGHS. EXCELLENT WINTER HARDINESS.",
        bg: "NO", z6: "YES" },
      { name: "NORTHBLUE", group: "HALF-HIGH",
        type: "HALF-HIGH", zones: "3-7", chill: "COMMONLY LISTED ABOUT 800-1,000 HRS (NO OFFICIAL FIGURE PUBLISHED)", size: "2-3 FT TALL X ABOUT 4 FT WIDE",
        fruit: "LARGE, DARK BLUE, FIRM — BIG BERRIES ON A SMALL BUSH",
        season: "MID",
        yld: "3-9 LBS PER BUSH IN MINNESOTA TRIALS",
        poll: "BETTER WITH A SECOND VARIETY",
        notes: "UNIVERSITY OF MINNESOTA, 1983. THE PATIO-AND-RAISED-BED CHOICE FOR COLD COUNTRY; SNOW COVER IS ITS FRIEND, BURYING IT AGAINST THE WORST COLD.",
        bg: "NO", z6: "YES" },
      { name: "POLARIS", group: "HALF-HIGH",
        type: "HALF-HIGH", zones: "3-7 (PROVEN IN UNIV. OF MINNESOTA ZONE 3-4 TRIALS)", chill: "COMMONLY LISTED ABOUT 800-1,000 HRS (NO OFFICIAL FIGURE PUBLISHED)", size: "ABOUT 4 FT X 4 FT (MINNESOTA TRIALS)",
        fruit: "MEDIUM, FIRM AND CRISP; INTENSE FLAVOR",
        season: "EARLY — EARLY FRUIT ON A VERY HARDY BUSH",
        yld: "3-8 LBS PER BUSH IN MINNESOTA TRIALS",
        poll: "BETTER WITH A SECOND VARIETY",
        notes: "UNIVERSITY OF MINNESOTA, 1996. FOR THE GARDENER WHOSE SPRING COMES LATE AND WHOSE WINTER MEANS IT.",
        bg: "NO", z6: "YES" },
      { name: "LEGACY", group: "SOUTHERN HIGHBUSH",
        type: "SOUTHERN HIGHBUSH — THE HARDY ONE", zones: "5-8", chill: "500-600 HRS COMMONLY CITED; THE UNIV. OF MARYLAND LISTS 700-900 — SOURCES DISAGREE, AND BOTH FIGURES ARE PRINTED HERE HONESTLY", size: "5-6 FT TALL",
        fruit: "MEDIUM-LARGE TO LARGE, FIRM; VERY SWEET",
        season: "MID-LATE (LATE IN KENTUCKY PLANTINGS)",
        yld: "HEAVY",
        poll: "SELF-FERTILE; BETTER WITH A PARTNER",
        notes: "THE BRIDGE VARIETY: SOUTHERN BLOOD, NORTHERN MANNERS. HOLDS ITS LEAVES SEMI-EVERGREEN THROUGH MILD WINTERS. TOLERATES A WIDER RANGE OF SOILS THAN MOST. IF A 6A GROWER WANTS ONE SOUTHERN VARIETY, THIS IS IT.",
        bg: "YES", z6: "YES" },
      { name: "MISTY", group: "SOUTHERN HIGHBUSH",
        type: "SOUTHERN HIGHBUSH", zones: "6-10 COMMONLY LISTED (SOME SOURCES 5-9)", chill: "150-300 HRS", size: "5-6 FT TALL",
        fruit: "LARGE (ABOUT 65 PER CUP), FIRM; VERY GOOD QUALITY",
        season: "EARLY — LATE MAY INTO EARLY JUNE (KENTUCKY)",
        yld: "HIGH (BLUEGRASS)",
        poll: "THE CLASSIC PARTNER FOR SHARPBLUE — BLUEGRASS NOTES THE TWO ARE PLANTED TOGETHER TO RAISE EACH OTHER'S YIELDS",
        notes: "VIGOROUS, WITH HANDSOME BLUE-GREEN FOLIAGE. IN 6A IT LIVES AT THE COLD EDGE OF ITS RANGE: A HARD WINTER CAN TAKE FLOWER BUDS OR CANES EVEN WHEN THE BUSH ITSELF SURVIVES. PLANT IT AS AN EXPERIMENT IN A SHELTERED SPOT, NOT AS THE BACKBONE OF THE PATCH.",
        bg: "YES", z6: "EDGE" },
      { name: "O'NEAL", group: "SOUTHERN HIGHBUSH",
        type: "SOUTHERN HIGHBUSH", zones: "5-9 COMMONLY LISTED TODAY (OLDER SOURCES SAY 7-9)", chill: "SOURCES GENUINELY DISAGREE — 200-300 HRS (UNIV. OF CALIFORNIA) VERSUS 500-600 HRS (UNIV. OF MARYLAND). BOTH ARE PRINTED; THE TRUTH IS IN THAT NEIGHBORHOOD AND EITHER FIGURE IS EASILY MET BY A 6A WINTER.", size: "ABOUT 6 FT TALL X 4 FT ACROSS (BLUEGRASS)",
        fruit: "LARGE; FLAVOR OFTEN RATED THE BEST OF THE SOUTHERN HIGHBUSH",
        season: "EARLY, WITH A LONG PICKING WINDOW",
        yld: "10-20 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "A GOOD POLLINIZER FOR OTHER SOUTHERN HIGHBUSH (UNIV. OF MARYLAND); BETTER WITH A PARTNER ITSELF",
        notes: "BORDERLINE IN 6A FOR THE SAME REASON AS MISTY — COLD, NOT CHILL, IS THE QUESTION. ITS EARLY BLOOM ALSO WAKES EARLY, WHICH RISKS SPRING FROST. A SHELTERED WALL AND A HOPEFUL HEART.",
        bg: "YES", z6: "EDGE" },
      { name: "SHARPBLUE", aka: "SHARP BLUE", group: "SOUTHERN HIGHBUSH",
        type: "SOUTHERN HIGHBUSH", zones: "7-10", chill: "ABOUT 200 HRS (BLUEGRASS'S OWN PRODUCT PAGE)", size: "5-6 FT TALL",
        fruit: "MEDIUM (ABOUT 75-80 PER CUP); GOOD FLAVOR, BUT SOFT KEEPING — BLUEGRASS ADVISES SHIPPING THE DAY IT IS PICKED",
        season: "EARLY — LATE MAY (KENTUCKY)",
        yld: "8-16 LBS PER MATURE BUSH (BLUEGRASS)",
        poll: "PLANTED WITH MISTY TO RAISE YIELDS (BLUEGRASS)",
        notes: "THE NUMBER-ONE HIGHBUSH VARIETY IN FLORIDA (BLUEGRASS). A FINE BUSH — FOR FLORIDA. IN 6A THE FIRST HARD WINTER ENDS IT.",
        bg: "YES", z6: "NO" },
      { name: "BILOXI", group: "SOUTHERN HIGHBUSH",
        type: "SOUTHERN HIGHBUSH", zones: "8-10", chill: "VIRTUALLY NONE — BRED TO FRUIT WHERE WINTER BARELY VISITS", size: "5-6 FT TALL",
        fruit: "MEDIUM; GOOD QUALITY",
        season: "EARLY — EARLY JUNE IN KENTUCKY PLANTINGS; EARLIER IN THE DEEP SOUTH",
        yld: "12-15 LBS PER BUSH (BLUEGRASS)",
        poll: "SELF-POLLINATING (BLUEGRASS)",
        notes: "BRED IN MISSISSIPPI FOR THE GULF COAST AND FOR LOW-CHILL PRODUCTION IN MEXICO. INCLUDED SO THE RECORD IS COMPLETE: IT IS THE FAR SHORE OF THE BLUEBERRY FAMILY, AND 6A IS NOT ITS COUNTRY.",
        bg: "YES", z6: "NO" },
      { name: "BRIGHTWELL", group: "RABBITEYE",
        type: "RABBITEYE", zones: "7-9", chill: "ABOUT 350-400 HRS", size: "8-10 FT TALL (BLUEGRASS)",
        fruit: "MEDIUM (SOURCES VARY, SMALL TO MEDIUM-LARGE); DEEP BLUE",
        season: "MID — JULY (KENTUCKY)",
        yld: "ABOUT 10 LBS PER BUSH (BLUEGRASS); RATED BIG-YIELDING BY MARYLAND EXTENSION",
        poll: "NEEDS A DIFFERENT RABBITEYE PARTNER",
        notes: "UPRIGHT AND VIGOROUS, HEAT- AND DROUGHT-TOLERANT. ONE OF ONLY TWO RABBITEYES ON BLUEGRASS'S REGULAR GROW LIST.",
        bg: "YES", z6: "NO" },
      { name: "PREMIER", group: "RABBITEYE",
        type: "RABBITEYE", zones: "7-9", chill: "ABOUT 550 HRS", size: "UP TO 10 FT (BLUEGRASS); OFTEN LISTED 6-8 FT — COMPACT FOR A RABBITEYE",
        fruit: "MEDIUM TO LARGE, DARK",
        season: "EARLIEST OF THE RABBITEYES — LATE JUNE (KENTUCKY)",
        yld: "ABOUT 10 LBS PER BUSH (BLUEGRASS); PROLIFIC",
        poll: "NEEDS A DIFFERENT RABBITEYE PARTNER",
        notes: "THE SECOND RABBITEYE BLUEGRASS GROWS REGULARLY. MARYLAND EXTENSION CALLS IT COMPACT BUT PROLIFIC.",
        bg: "YES", z6: "NO" },
      { name: "CLIMAX", group: "RABBITEYE",
        type: "RABBITEYE", zones: "7-9", chill: "ABOUT 450 HRS", size: "UP TO 12 FT TALL (BLUEGRASS) — THE BIGGEST BUSH IN THIS BOOK",
        fruit: "MEDIUM",
        season: "JULY (KENTUCKY); ITS FRUIT RIPENS ALL AT ONCE, IN ONE GREAT WAVE",
        yld: "UP TO 15 LBS PER BUSH (BLUEGRASS)",
        poll: "NEEDS A DIFFERENT RABBITEYE PARTNER",
        notes: "DESCRIBED IN BLUEGRASS'S VARIETY GUIDE; A CURRENT SHOP LISTING COULD NOT BE VERIFIED (NOV 2026), SO ITS SALE STATUS IS UNCONFIRMED.",
        bg: "GUIDE", z6: "NO" },
      { name: "COLUMBUS", group: "RABBITEYE",
        type: "RABBITEYE", zones: "7-9", chill: "UNVERIFIED — NO FIGURE FOUND IN THE SOURCES CONSULTED", size: "UP TO 10 FT TALL (BLUEGRASS)",
        fruit: "SMALL (BLUEGRASS)",
        season: "UNVERIFIED IN THE SOURCES CONSULTED",
        yld: "UP TO 12 LBS PER BUSH (BLUEGRASS)",
        poll: "NEEDS A DIFFERENT RABBITEYE PARTNER",
        notes: "A NEWER NORTH CAROLINA RELEASE. DESCRIBED IN BLUEGRASS'S VARIETY GUIDE; A CURRENT SHOP LISTING COULD NOT BE VERIFIED (NOV 2026). THE THINNEST ENTRY IN THIS BOOK, PRINTED THIN RATHER THAN PADDED.",
        bg: "GUIDE", z6: "NO" },
      { name: "POWDERBLUE", aka: "POWDER BLUE", group: "RABBITEYE",
        type: "RABBITEYE", zones: "7-9", chill: "ABOUT 550-650 HRS", size: "UP TO 8 FT TALL (BLUEGRASS)",
        fruit: "MEDIUM-LARGE, UNDER A HEAVY PALE BLOOM THAT GIVES IT THE NAME",
        season: "LATE — CLOSES THE RABBITEYE SEASON",
        yld: "ABOUT 10 LBS PER BUSH (BLUEGRASS)",
        poll: "NEEDS A DIFFERENT RABBITEYE PARTNER",
        notes: "DESCRIBED IN BLUEGRASS'S VARIETY GUIDE; A CURRENT SHOP LISTING COULD NOT BE VERIFIED (NOV 2026).",
        bg: "GUIDE", z6: "NO" },
      { name: "TIFBLUE", group: "RABBITEYE",
        type: "RABBITEYE", zones: "7-9", chill: "ABOUT 600-700 HRS", size: "UP TO 8 FT TALL (BLUEGRASS)",
        fruit: "MEDIUM-LARGE, LIGHT BLUE, FIRM",
        season: "MID-LATE",
        yld: "ABOUT 10 LBS PER BUSH (BLUEGRASS)",
        poll: "NEEDS A DIFFERENT RABBITEYE PARTNER",
        notes: "THE CLASSIC RABBITEYE STANDARD, RELEASED IN GEORGIA IN 1955, AND THE HARDIEST OF ITS TYPE — WHICH IS A RELATIVE TERM: HARDIEST RABBITEYE STILL DOES NOT REACH 6A. DESCRIBED IN BLUEGRASS'S VARIETY GUIDE; A CURRENT SHOP LISTING COULD NOT BE VERIFIED (NOV 2026).",
        bg: "GUIDE", z6: "NO" },
    ],
  },

  // ======================================================================
  // TITLE SCREEN AND MENUS
  // ======================================================================
  screens: {
    // game.js line 6013 · drawDlg
    aChoiceBChoice2: "A:{choice}  B:{choice2}",
    // game.js line 7121 · renderTitle
    hopeStarts: "HOPE STARTS",
    // game.js line 7126 · renderTitle
    chapter1Seeds: "CHAPTER 1 · SEEDS",
    // game.js line 7147 · renderTitle
    eraseYourSaveAnd: "ERASE YOUR SAVE AND",
    // game.js line 7148 · renderTitle
    startOver: "START OVER?",
    // game.js line 7149 · renderTitle
    aYesBNo: "A: YES   B: NO",
    // game.js line 7154 · renderChapters
    theJournal: "THE JOURNAL",
    // game.js line 7155 · renderChapters
    whatTheFieldRemembers: "WHAT THE FIELD REMEMBERS",
    // game.js line 7174 · renderChapters
    bBack: "B: BACK",
    // game.js line 7566 · renderMenu
    nothingSeenYet: "NOTHING SEEN YET",
    // game.js line 7566 · renderMenu
    berrydexV: "BERRYDEX: {v}",
    // game.js line 7567 · renderMenu
    teaTeaCompostCompost: "TEA ×{tea} · COMPOST ×{compost}",
    // game.js line 7568 · renderMenu
    goodDirtGooddirt: "GOOD DIRT ×{goodDirt}",
    // game.js line 6007 · drawDlg
    n7fd1c8: "#7fd1c8",
    // game.js line 6007 · drawDlg
    ffd94a: "#ffd94a",
  },

  // ======================================================================
  // TIME TRAVEL (Nov 27, 2026): the title screen's slider to any point
  // of the perfect run. Plain words, like everything else here.
  // ======================================================================
  travel: {
    title: "TIME TRAVEL",
    note: [
      "THE PERFECT RUN, AS THE STORY GOES:",
      "EVERY TRIAL WON, EVERY PLANT TENDED.",
      "NOT YOUR GARDEN AS YOU LEFT IT.",
    ],
    remembering: "REMEMBERING THE YEARS…",
    couldNot: "THE YEARS WOULD NOT COME. TRY AGAIN.",
    travelHere: "TRAVEL HERE?",
    replaced: "YOUR CURRENT GARDEN IS REPLACED.",
    choose: "◀ ▶ CHOOSE · A: TRAVEL",
    dayOfChapter: "DAY {n} OF THE CHAPTER",
    firstMorning: "THE FIRST MORNING",
    arrived: "THE GARDEN, AS IT SHOULD BE.",
  },

  // ======================================================================
  // THE CONTROLS SCREEN
  // ======================================================================
  controls: {
    // game.js line 7607 · renderControls
    controls: "CONTROLS",
    // game.js line 7610 · renderControls
    keyboard: "KEYBOARD",
    // game.js line 7611 · renderControls
    arrowsOrWasdMove: "ARROWS OR WASD: MOVE",
    // game.js line 7612 · renderControls
    zOrEnterA: "Z OR ENTER: A · X OR ESC: B",
    // game.js line 7613 · renderControls
    pMenu: "P: MENU",
    // game.js line 7614 · renderControls
    gamepad: "GAMEPAD",
    // game.js line 7615 · renderControls
    stickOrDPad: "STICK OR D-PAD: MOVE",
    // game.js line 7616 · renderControls
    aOkBBack: "A: OK · B: BACK · START: MENU",
    // game.js line 7618 · renderControls
    stickMoveOnScreen: "STICK MOVE · ON-SCREEN A/B",
    // game.js line 7621 · renderControls
    showStickTouppercaseval: "SHOW STICK: < {toUpperCaseVal} >",
    // game.js line 7623 · renderControls
    musicV: "MUSIC: < {v} >",
  },

  // ======================================================================
  // TOASTS — the small pop-up messages
  // ======================================================================
  toasts: {
    // game.js line 5815 · (anon)
    gamepadConnected: "GAMEPAD CONNECTED",
    // game.js line 6136 · overworldUpdate
    theStairsPressA: "THE STAIRS — PRESS A TO USE THEM",
    // game.js line 6136 · overworldUpdate
    theDoorPressA: "THE DOOR — PRESS A TO STEP THROUGH",
    // game.js line 7052 · continueGame
    welcomeBackDayDay: "WELCOME BACK. DAY {day}",
    // game.js line 7662 · renamePlantObj
    renamedV: "RENAMED: {v}",
  },

  // ======================================================================
  // EVERYTHING ELSE
  // ======================================================================
  misc: {
    // game.js line 5521 · allocName
    slicevalIi: "{sliceVal} II",
    // game.js line 5526 · allocName
    plantN: "PLANT {n}",
    // game.js line 7636 · locPretty
    fieldReplaceval: "FIELD {replaceVal}",
  },
};
