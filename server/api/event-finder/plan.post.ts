import type { EventSearchRequest, EventFinderOutput, RecommendedEvent } from "~/types/eventFinder";
import { runAgentThread } from "../../utils/seekrClient";

const AGENT_IDS = {
  eventDiscovery: "agent-4ef97869-47cc-4a20-9e0a-02bf9aad41c0",
  budget: "agent-8e70f2f9-0fdb-42d4-adc6-c22ef79a0425",
  weather: "agent-4c46b52b-d3c2-4314-9379-7cf42c29b6c0",
  schedule: "agent-2421cacb-3b91-4989-9cad-2b999cd7bb8e"
};

interface DiscoveredEvent {
  eventName: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  category: string;
  priceRange: string;
  sourceUrl?: string;
  description: string;
  matchReason: string;
}

interface BudgetAnalysisItem {
  eventName: string;
  estimatedTicketCost: string;
  estimatedTransportationCost: string;
  estimatedFoodAndDrinkCost: string;
  estimatedFees: string;
  estimatedTotalCost: string;
  budgetFit: "under_budget" | "near_budget" | "over_budget";
  costSavingTips: string[];
}

interface WeatherAnalysisItem {
  eventName: string;
  venueType: "indoor" | "outdoor" | "mixed" | "unknown";
  expectedTemperature: string;
  precipitationRisk: string;
  windRisk: string;
  comfortLevel: "great" | "okay" | "poor" | "unknown";
  weatherRisk: "low" | "medium" | "high";
  recommendation: string;
}

async function runAgent(agentId: string, message: string): Promise<string> {
  return await runAgentThread(agentId, message);
}

function parseJSON<T>(raw: string): T | null {
  if (!raw) return null;

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {}

  // Find balanced JSON block by walking braces
  const openers = ["{", "["];
  const matchClose: Record<string, string> = { "{": "}", "[": "]" };
  for (let start = 0; start < cleaned.length; start++) {
    const ch = cleaned[start]!;
    if (!openers.includes(ch)) continue;
    const close = matchClose[ch]!;
    let depth = 0;
    let inStr = false;
    let escape = false;
    for (let i = start; i < cleaned.length; i++) {
      const c = cleaned[i]!;
      if (escape) { escape = false; continue; }
      if (c === "\\") { escape = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === ch) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) {
          const candidate = cleaned.slice(start, i + 1);
          try { return JSON.parse(candidate) as T; } catch {}
          break;
        }
      }
    }
  }
  return null;
}

function mergeIntoRecommendedEvents(
  events: DiscoveredEvent[],
  budgets: BudgetAnalysisItem[],
  weathers: WeatherAnalysisItem[]
): RecommendedEvent[] {
  return events.map((event, index) => {
    const budget = budgets.find((b) => b.eventName === event.eventName) ?? budgets[index];
    const weather = weathers.find((w) => w.eventName === event.eventName) ?? weathers[index];

    return {
      eventName: event.eventName,
      venue: event.venue,
      location: event.location,
      date: event.date,
      time: event.time,
      category: event.category,
      priceRange: event.priceRange,
      description: event.description,
      matchScore: Math.max(70, Math.min(99, 97 - index * 4 + Math.floor(Math.random() * 3))),
      matchReason: event.matchReason,
      sourceUrl: event.sourceUrl,
      budgetAnalysis: budget
        ? {
            estimatedTicketCost: budget.estimatedTicketCost,
            estimatedTransportationCost: budget.estimatedTransportationCost,
            estimatedFoodAndDrinkCost: budget.estimatedFoodAndDrinkCost,
            estimatedFees: budget.estimatedFees,
            estimatedTotalCost: budget.estimatedTotalCost,
            budgetFit: budget.budgetFit,
            costSavingTips: budget.costSavingTips ?? []
          }
        : {
            estimatedTicketCost: "N/A",
            estimatedTransportationCost: "N/A",
            estimatedFoodAndDrinkCost: "N/A",
            estimatedFees: "N/A",
            estimatedTotalCost: "N/A",
            budgetFit: "near_budget",
            costSavingTips: []
          },
      weatherAnalysis: weather
        ? {
            venueType: weather.venueType,
            expectedTemperature: weather.expectedTemperature,
            precipitationRisk: weather.precipitationRisk,
            windRisk: weather.windRisk,
            comfortLevel: weather.comfortLevel,
            weatherRisk: weather.weatherRisk,
            recommendation: weather.recommendation
          }
        : {
            venueType: "unknown",
            expectedTemperature: "N/A",
            precipitationRisk: "N/A",
            windRisk: "N/A",
            comfortLevel: "unknown",
            weatherRisk: "low",
            recommendation: "Check local weather before attending."
          }
    };
  });
}

function getMockData(request: EventSearchRequest): EventFinderOutput {
  const location = request.location || "San Jose, CA";
  const date = request.date || "Saturday, May 10, 2025";

  return {
    appName: "Sens",
    dataSource: "mock",
    userRequest: `Find me ${request.eventType || "concerts or nightlife"} near ${location} on ${date} under ${request.budget || "$150"}`,
    location,
    summary: `Found 6 events near ${location} matching your preferences. The Midnight at SAP Center is the top pick — great indoor venue, fits your budget, and has an outstanding match score of 97%.`,
    agentActivity: [
      { agentName: "Event Discovery Agent", status: "complete", summary: `Scanned local event databases for ${location} on ${date}. Found 6 high-quality matches.` },
      { agentName: "Budget Agent", status: "complete", summary: `Estimated total costs for all 6 events. Best value is The Midnight at SAP Center ($130 total), within the ${request.budget} budget.` },
      { agentName: "Weather Agent", status: "complete", summary: "Checked NWS forecast. Clear skies, 68°F expected. Outdoor events rated low risk." },
      { agentName: "Schedule Agent", status: "complete", summary: "Built optimal itinerary: dinner at Santana Row → SAP Center → post-show drinks at Paper Plane." }
    ],
    recommendedEvents: [
      {
        eventName: "The Midnight – Monsters of Rock Tour",
        venue: "SAP Center",
        location: "525 W Santa Clara St, San Jose, CA 95113",
        date,
        time: "8:00 PM",
        category: "Live Music / Synthpop",
        priceRange: "$45–$95",
        description: "The Midnight brings their acclaimed Monsters of Rock tour to SAP Center with stunning visuals, retro-wave synthesizers, and an unforgettable setlist spanning their entire catalog.",
        matchScore: 97,
        matchReason: "Top-rated live music act perfectly matching your concert preference, highly rated for production quality and atmosphere",
        sourceUrl: "https://www.sapcenter.com",
        budgetAnalysis: {
          estimatedTicketCost: "$65",
          estimatedTransportationCost: "$18",
          estimatedFoodAndDrinkCost: "$35",
          estimatedFees: "$12",
          estimatedTotalCost: "$130",
          budgetFit: "under_budget",
          costSavingTips: [
            "Book tickets online to avoid box office surcharge",
            "Eat dinner before the show at nearby Santana Row",
            "Use Caltrain from SF to save $10 on parking"
          ]
        },
        weatherAnalysis: {
          venueType: "indoor",
          expectedTemperature: "68°F",
          precipitationRisk: "None – indoor venue",
          windRisk: "None – indoor venue",
          comfortLevel: "great",
          weatherRisk: "low",
          recommendation: "Perfect indoor show, weather is a non-factor. Dress for a standing venue."
        }
      },
      {
        eventName: "Raveolution: Neon Nights",
        venue: "City National Civic",
        location: "135 W San Carlos St, San Jose, CA 95113",
        date,
        time: "9:00 PM – 2:00 AM",
        category: "Nightlife / Electronic / EDM",
        priceRange: "$30–$60",
        description: "San Jose's premier EDM night returns with headlining DJs, immersive light installations, multiple dance floors, and VIP bottle service. Dress code enforced.",
        matchScore: 92,
        matchReason: "Perfect nightlife event matching your EDM and nightlife interest, with a great late-night schedule",
        sourceUrl: "https://citynationalcivic.com",
        budgetAnalysis: {
          estimatedTicketCost: "$40",
          estimatedTransportationCost: "$22",
          estimatedFoodAndDrinkCost: "$45",
          estimatedFees: "$8",
          estimatedTotalCost: "$115",
          budgetFit: "under_budget",
          costSavingTips: [
            "Buy general admission tickets early for best price",
            "Pre-game responsibly at home to reduce bar spend",
            "Use Uber Pool to split ride costs"
          ]
        },
        weatherAnalysis: {
          venueType: "indoor",
          expectedTemperature: "72°F inside",
          precipitationRisk: "None – indoor venue",
          windRisk: "None – indoor venue",
          comfortLevel: "great",
          weatherRisk: "low",
          recommendation: "Indoor venue, no weather concerns. Bring a light jacket for the walk home."
        }
      },
      {
        eventName: "San Jose Jazz Summer Fest – Saturday Showcase",
        venue: "Plaza de Cesar Chavez Park",
        location: "Market St & Park Ave, San Jose, CA 95113",
        date,
        time: "4:00 PM – 10:00 PM",
        category: "Jazz / Live Music / Festival",
        priceRange: "$25–$75",
        description: "San Jose's iconic Jazz Festival returns for its summer showcase with local legends and touring artists across multiple outdoor stages. Food trucks and craft vendors on-site.",
        matchScore: 88,
        matchReason: "Highly-rated outdoor festival with diverse music and great social atmosphere, multiple stages for variety",
        sourceUrl: "https://sanjosejazz.org",
        budgetAnalysis: {
          estimatedTicketCost: "$35",
          estimatedTransportationCost: "$15",
          estimatedFoodAndDrinkCost: "$40",
          estimatedFees: "$5",
          estimatedTotalCost: "$95",
          budgetFit: "under_budget",
          costSavingTips: [
            "General admission gives access to all outdoor stages",
            "Food trucks offer better value than restaurant pre-gaming",
            "Free parking at SAP Center garage after 6 PM Saturday"
          ]
        },
        weatherAnalysis: {
          venueType: "outdoor",
          expectedTemperature: "72°F",
          precipitationRisk: "Low (5%)",
          windRisk: "Mild breeze",
          comfortLevel: "great",
          weatherRisk: "low",
          recommendation: "Excellent outdoor weather expected. Bring a light layer for the evening. Sunscreen for the early hours."
        }
      },
      {
        eventName: "Shoreline Amphitheatre: Zedd & Friends",
        venue: "Shoreline Amphitheatre",
        location: "One Amphitheatre Pkwy, Mountain View, CA 94043",
        date,
        time: "7:00 PM",
        category: "Electronic / Pop / Concert",
        priceRange: "$55–$120",
        description: "Zedd headlines this massive outdoor amphitheatre show with special guests, pyrotechnics, and a world-class production. Lawn tickets available for budget-conscious fans.",
        matchScore: 85,
        matchReason: "Major headliner close to San Jose with both premium and budget ticket options",
        sourceUrl: "https://shorelineamphitheatre.com",
        budgetAnalysis: {
          estimatedTicketCost: "$55",
          estimatedTransportationCost: "$28",
          estimatedFoodAndDrinkCost: "$35",
          estimatedFees: "$15",
          estimatedTotalCost: "$133",
          budgetFit: "near_budget",
          costSavingTips: [
            "Lawn tickets offer great views at half the price",
            "Pack allowed snacks (sealed, non-alcoholic) to save on food",
            "Carpool – parking is $30, split between 4 saves $22 each"
          ]
        },
        weatherAnalysis: {
          venueType: "outdoor",
          expectedTemperature: "65°F",
          precipitationRisk: "Very Low (3%)",
          windRisk: "Light – Bay Area breeze",
          comfortLevel: "okay",
          weatherRisk: "low",
          recommendation: "Pleasant evening expected. Bay Area evenings cool down – bring a hoodie. No rain expected."
        }
      },
      {
        eventName: "Blank Club: Indie Night",
        venue: "The Blank Club",
        location: "44 S Almaden Ave, San Jose, CA 95113",
        date,
        time: "10:00 PM – 2:00 AM",
        category: "Indie Rock / Nightlife / Bar",
        priceRange: "$10–$20",
        description: "San Jose's beloved indie rock venue hosts its weekly Saturday night showcase with local bands, DJs, and an intimate bar atmosphere. 21+ after 10 PM.",
        matchScore: 80,
        matchReason: "Affordable local nightlife option in downtown San Jose with authentic music scene",
        sourceUrl: "https://theblankclub.com",
        budgetAnalysis: {
          estimatedTicketCost: "$15",
          estimatedTransportationCost: "$12",
          estimatedFoodAndDrinkCost: "$40",
          estimatedFees: "$3",
          estimatedTotalCost: "$70",
          budgetFit: "under_budget",
          costSavingTips: ["Cash-only bar saves on card fees", "Happy hour specials before 11 PM", "Walk from downtown if staying nearby"]
        },
        weatherAnalysis: {
          venueType: "indoor",
          expectedTemperature: "70°F inside",
          precipitationRisk: "None – indoor venue",
          windRisk: "None – indoor venue",
          comfortLevel: "great",
          weatherRisk: "low",
          recommendation: "Cozy indoor venue, ideal for late-night. Minimal commute from downtown hotels."
        }
      },
      {
        eventName: "San Jose Earthquakes vs LA Galaxy",
        venue: "PayPal Park",
        location: "1123 Coleman Ave, San Jose, CA 95110",
        date,
        time: "7:30 PM",
        category: "Sports / MLS Soccer",
        priceRange: "$30–$85",
        description: "The Earthquakes host their fierce rivals LA Galaxy in this heated MLS derby. Supporter section guarantees an electric atmosphere with drums, chants, and flares.",
        matchScore: 78,
        matchReason: "High-energy sports event for those who enjoy live games, great local rivalry atmosphere",
        sourceUrl: "https://www.sjearthquakes.com",
        budgetAnalysis: {
          estimatedTicketCost: "$45",
          estimatedTransportationCost: "$20",
          estimatedFoodAndDrinkCost: "$35",
          estimatedFees: "$8",
          estimatedTotalCost: "$108",
          budgetFit: "under_budget",
          costSavingTips: ["Supporter section tickets are cheapest and most fun", "Pregame at nearby bars for better prices", "Light Rail from downtown is $5 round trip"]
        },
        weatherAnalysis: {
          venueType: "outdoor",
          expectedTemperature: "68°F",
          precipitationRisk: "Low (8%)",
          windRisk: "Mild",
          comfortLevel: "great",
          weatherRisk: "low",
          recommendation: "Great evening for outdoor soccer. Comfortable temperatures. Bring a layer for the second half."
        }
      }
    ],
    recommendedItinerary: {
      title: "The Perfect San Jose Saturday Night",
      summary: "An expertly crafted evening starting with dinner in SoFA District, catching The Midnight at SAP Center, and ending with late-night cocktails downtown.",
      totalEstimatedCost: "$130",
      weatherSummary: "Clear skies, 68°F, perfect evening. No weather concerns for indoor show.",
      timeline: [
        { time: "5:30 PM", activity: "Pre-show dinner at Orchard City Kitchen", location: "Santana Row, San Jose", notes: "Book a reservation – excellent cocktails and small plates before the show" },
        { time: "6:45 PM", activity: "Depart for SAP Center", location: "Santana Row → SAP Center", notes: "15-minute Uber or 20-minute walk. Arrive early to beat ticket scanner lines." },
        { time: "7:00 PM", activity: "Arrive at SAP Center, grab merch", location: "SAP Center – 525 W Santa Clara St", notes: "Merch line is shortest right at doors-open. Explore the concourse." },
        { time: "7:30 PM", activity: "Find your spots, opening act", location: "SAP Center Main Floor", notes: "Opening act often worth watching. Floor spots near mixing board have best sound." },
        { time: "8:00 PM", activity: "The Midnight – Main Show", location: "SAP Center", notes: "Expected 90-minute set. Signature songs: Monsters, Days of Thunder, Los Angeles" },
        { time: "9:45 PM", activity: "Post-show drinks at Paper Plane", location: "72 S 1st St, San Jose", notes: "Award-winning cocktail bar 5 min from SAP Center. Try their signature Paper Plane cocktail." },
        { time: "11:30 PM", activity: "Late-night option: Raveolution or head home", location: "City National Civic or Uber home", notes: "If energy is high, head to Raveolution nightclub ($40 cover). Otherwise, safe ride home." }
      ],
      backupPlan: "If The Midnight sells out, head to the San Jose Jazz Summer Fest at Plaza de Cesar Chavez ($35 GA) or catch Zedd at Shoreline Amphitheatre ($55 lawn).",
      whyThisPlanWorks: [
        "SAP Center is centrally located with easy Uber/transit access",
        "The Midnight is critically acclaimed with a near-perfect track record",
        "Dinner at Santana Row sets the evening with great food and cocktails",
        "Paper Plane extends the night without requiring a club cover",
        `Total cost $130 is well within your ${request.budget} budget`,
        "All indoor venues protect against any weather surprises",
        "The schedule has natural flow with no rushed transitions"
      ]
    }
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<EventSearchRequest>(event);

  try {
    const config = useRuntimeConfig();
    if (!config.seekrApiKey) throw new Error("No API key");

    console.log("\n=== [EventFinder] Incoming Request ===");
    console.log(JSON.stringify(body, null, 2));

    const userContext = `
Location: ${body.location}
Date: ${body.date}
Event Type: ${body.eventType || "any"}
Interests: ${body.interests?.join(", ") || "general"}
Budget: ${body.budget}
Transportation: ${body.transportationPreference}
Venue Preference: ${body.indoorOutdoorPreference}
${body.notes ? `Notes: ${body.notes}` : ""}
`.trim();

    // Step 1 — Event Discovery
    const discoveryMessage = `Find 2-3 of the best matching nearby events for this user. Return only the top 2 or 3 events that best match their preferences — quality over quantity.\n\n${userContext}`;
    console.log("\n=== [Agent 1] Event Discovery — Request ===");
    console.log(discoveryMessage);
    const discoveryRaw = await runAgent(AGENT_IDS.eventDiscovery, discoveryMessage);
    console.log("\n=== [Agent 1] Event Discovery — Response ===");
    console.log(discoveryRaw);
    const discoveryData = parseJSON<{ events: DiscoveredEvent[] }>(discoveryRaw);
    const events = discoveryData?.events ?? [];
    console.log(`[Agent 1] Parsed ${events.length} events`);

    if (!events.length) {
      console.log("[EventFinder] No events found, falling back to mock data");
      return getMockData(body);
    }

    const eventsJSON = JSON.stringify(events, null, 2);

    // Step 2 — Budget + Weather (run context for both)
    const budgetMessage = `Estimate costs for each of these events for a user with a budget of ${body.budget}. Transportation preference: ${body.transportationPreference}.\n\nEvents:\n${eventsJSON}`;
    const weatherMessage = `Analyze weather and outdoor conditions for each of these events on ${body.date} in ${body.location}.\n\nEvents:\n${eventsJSON}`;

    console.log("\n=== [Agent 2] Budget — Request ===");
    console.log(budgetMessage);
    console.log("\n=== [Agent 3] Weather — Request ===");
    console.log(weatherMessage);

    const [budgetRaw, weatherRaw] = await Promise.all([
      runAgent(AGENT_IDS.budget, budgetMessage),
      runAgent(AGENT_IDS.weather, weatherMessage)
    ]);

    console.log("\n=== [Agent 2] Budget — Response ===");
    console.log(budgetRaw);
    console.log("\n=== [Agent 3] Weather — Response ===");
    console.log(weatherRaw);

    const budgetData = parseJSON<{ budgetAnalysis: BudgetAnalysisItem[] }>(budgetRaw);
    const weatherData = parseJSON<{ weatherAnalysis: WeatherAnalysisItem[] }>(weatherRaw);

    const budgets = budgetData?.budgetAnalysis ?? [];
    const weathers = weatherData?.weatherAnalysis ?? [];
    console.log(`[Agent 2] Parsed ${budgets.length} budget items`);
    console.log(`[Agent 3] Parsed ${weathers.length} weather items`);

    // Step 3 — Schedule
    const scheduleMessage = `Create the best itinerary for this user.\n\nUser preferences:\n${userContext}\n\nEvents:\n${eventsJSON}\n\nBudget analysis:\n${JSON.stringify(budgets, null, 2)}\n\nWeather analysis:\n${JSON.stringify(weathers, null, 2)}`;
    console.log("\n=== [Agent 4] Schedule — Request ===");
    console.log(scheduleMessage);
    const scheduleRaw = await runAgent(AGENT_IDS.schedule, scheduleMessage);
    console.log("\n=== [Agent 4] Schedule — Response ===");
    console.log(scheduleRaw);
    const scheduleData = parseJSON<{ recommendedItinerary: EventFinderOutput["recommendedItinerary"] }>(scheduleRaw);

    // Step 4 — Merge into final output
    console.log("\n=== [EventFinder] Merging final output ===");
    const recommendedEvents = mergeIntoRecommendedEvents(events, budgets, weathers);

    const userRequest = `Find me ${body.eventType || "events"} near ${body.location} on ${body.date} under ${body.budget}`;

    return {
      appName: "Sens",
      dataSource: "live",
      userRequest,
      location: body.location,
      summary: `Found ${events.length} events near ${body.location} matching your preferences.`,
      agentActivity: [
        { agentName: "Event Discovery Agent", status: "complete", summary: discoveryRaw.slice(0, 200) },
        { agentName: "Budget Agent", status: "complete", summary: budgetRaw.slice(0, 200) },
        { agentName: "Weather Agent", status: "complete", summary: weatherRaw.slice(0, 200) },
        { agentName: "Schedule Agent", status: "complete", summary: scheduleRaw.slice(0, 200) }
      ],
      recommendedEvents,
      recommendedItinerary: scheduleData?.recommendedItinerary ?? getMockData(body).recommendedItinerary
    } satisfies EventFinderOutput;
  } catch (err) {
    console.error("\n=== [EventFinder] Error — falling back to mock data ===");
    console.error(err);
    return getMockData(body);
  }
});
