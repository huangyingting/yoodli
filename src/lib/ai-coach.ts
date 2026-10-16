export function generatePersonaReply(params: {
  personaName: string;
  personaTitle: string;
  demeanor: string;
  scenarioTitle: string;
  userMessage: string;
  turnIndex: number;
}): { reply: string; coachingNudge: string } {
  const lower = params.userMessage.toLowerCase();
  const hasQuestion = params.userMessage.includes("?");
  const mentionsMetrics = /\b(\d+%|\$\d+|roi|soc2|gdpr|ramp|payback|arr|ebitda|latency|star)\b/i.test(
    params.userMessage
  );

  let coachingNudge = "Great pacing! Keep your next response concise and end with a calibrated open-ended question.";
  if (!hasQuestion) {
    coachingNudge = "Tip: End your turn with an open-ended discovery question ('How...', 'What...') to lower your talk ratio.";
  } else if (mentionsMetrics) {
    coachingNudge = "Strong use of concrete proof points and metrics! Now lock in a specific next step.";
  }

  if (params.turnIndex === 0) {
    return {
      reply: `That's a helpful overview, ${
        mentionsMetrics ? "and those numbers caught my attention" : "though I hear similar claims from other vendors"
      }. Specifically for our ${params.personaTitle} priorities this quarter, how do you handle enterprise security governance, and how quickly would our team actually see measurable ROI?`,
      coachingNudge,
    };
  }

  if (params.turnIndex === 1) {
    return {
      reply: `Okay, that addresses the governance question. My next concern is bandwidth and budget—our managers are already stretched thin, and Procurement is scrutinizing every new line item. Why shouldn't we wait until next fiscal half to roll this out?`,
      coachingNudge,
    };
  }

  if (lower.includes("thursday") || lower.includes("tuesday") || lower.includes("calendar") || lower.includes("schedule") || lower.includes("next step")) {
    return {
      reply: `Fair enough—you've made a compelling case on both security and payback period. Send over the calendar invite for Thursday along with the SOC2 summary and ROI model, and I'll bring our technical lead to the review.`,
      coachingNudge: "Goal Achieved: You secured a concrete, multi-threaded calendar commitment!",
    };
  }

  return {
    reply: `I appreciate the directness. If we were to run a 30-day pilot with our core team, what specific success criteria would you recommend we track, and what does the onboarding timeline look like?`,
    coachingNudge,
  };
}

export function generateAiRoleplayDraft(prompt: string) {
  const clean = prompt.trim() || "Enterprise SaaS Renewal & Expansion Negotiation";
  const isInterview = /interview|pm|engineer|hire|star|product/i.test(clean);
  const isSecurity = /ciso|security|soc2|privacy|infosec|gdpr/i.test(clean);

  if (isInterview) {
    return {
      title: `AI Behavioral & Case Interview: ${clean.slice(0, 56)}`,
      category: "BEHAVIORAL_INTERVIEW",
      difficulty: "Intermediate",
      personaId: "persona-liam",
      starterPrompt:
        "Thanks for taking the time today! Walk me through a high-stakes initiative related to this role where you had to navigate ambiguity, align cross-functional partners, and deliver measurable impact.",
      scenarioContext: `Generated via Yoodli AI Builder from prompt: "${clean}". Evaluates STAR clarity, executive presence, and quantitative outcomes.`,
      goals: [
        "Set Situation & Task context clearly in under 35 seconds",
        "Articulate specific personal leadership Actions and trade-offs",
        "Quantify final business Results with concrete metrics",
        "Maintain < 2% filler words and 130–165 WPM pacing",
      ],
    };
  }

  return {
    title: `${clean.slice(0, 60)}`,
    category: isSecurity ? "OBJECTION_HANDLING" : "OUTBOUND_DISCOVERY_CALL",
    difficulty: "Advanced",
    personaId: isSecurity ? "persona-dana" : "persona-marcus",
    starterPrompt: isSecurity
      ? "Walk me through exactly how your platform isolates tenant data and guarantees zero-data-retention across LLM sub-processors."
      : "We're currently consolidating vendors and scrutinizing every software dollar. Why should this initiative be a Q1 priority for our executive team?",
    scenarioContext: `Generated via Yoodli AI Builder from prompt: "${clean}". Practice uncovering business pain, defending enterprise value, and locking in a concrete next step.`,
    goals: [
      "Empathize with executive concern and reframe around business ROI",
      "Ask at least 2 open-ended discovery questions to quantify pain",
      "Cite concrete proof points (42% faster ramp, SOC2 Type II, 3.4-mo payback)",
      "Secure a calendar commitment with key stakeholders",
    ],
  };
}

export function answerCoachBotQuery(
  question: string,
  docs: { title: string; category: string; contentSummary: string }[]
) {
  const q = question.toLowerCase();
  const matchedDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.contentSummary.toLowerCase().includes(q) ||
      (q.includes("soc2") && d.contentSummary.toLowerCase().includes("soc2")) ||
      (q.includes("security") && d.category === "Battlecard") ||
      (q.includes("competitor") && d.title.toLowerCase().includes("competitor")) ||
      (q.includes("discount") && d.title.toLowerCase().includes("procurement")) ||
      (q.includes("meddpicc") && d.title.toLowerCase().includes("meddpicc"))
  );

  const sources = (matchedDocs.length > 0 ? matchedDocs : docs.slice(0, 2)).map((d) => d.title);

  if (q.includes("security") || q.includes("soc2") || q.includes("retention") || q.includes("ciso")) {
    return {
      answer:
        "According to the **FY26 Enterprise Security & Zero-Data-Retention Whitepaper**, Acme/Yoodli is **SOC2 Type II** and **GDPR/CCPA** certified with strict logical tenant isolation, AES-256 encryption at rest, and TLS 1.3 in transit. Most importantly for CISOs: we maintain contractual **Zero-Data-Retention** with all LLM providers (customer audio and transcripts are never used to train external models) and support Okta SAML/SCIM 2.0 plus automated 30-, 60-, or 90-day retention purge policies.",
      suggestedPitch:
        "\"Dana, we enforce contractual zero-data-retention across all LLM endpoints and are SOC2 Type II certified—your reps' recordings are private by default and never train external models.\"",
      sources,
    };
  }

  if (q.includes("discount") || q.includes("price") || q.includes("procurement") || q.includes("roi")) {
    return {
      answer:
        "Per the **Acme Corp MEDDPICC Playbook v4.2** and **Procurement Commercial Policy**, reps should never offer unilateral discounts. Re-anchor on our benchmark **42% reduction in new-hire ramp time**, **28% lift in stage-2 win rates**, and **3.4-month payback period**. If Procurement demands a concession, trade up to an **8% multi-year incentive** strictly in exchange for a 24-month agreement and Q1 signature.",
      suggestedPitch:
        "\"Jordan, our enterprise customers see a 3.4-month payback from cutting ramp time by 42%. While we don't discount annual agreements, I can unlock an 8% multi-year rate if we execute a 24-month partnership by Friday.\"",
      sources,
    };
  }

  return {
    answer: `Based on your organization's uploaded playbooks (${sources.join(", ")}), lead with **MEDDPICC pain quantification** before pitching features, differentiate pre-call **AI Roleplay simulation** from passive post-call recorders (Gong/Chorus), and always lock in a multi-threaded calendar next step with the Economic Buyer and Technical Champion.`,
    suggestedPitch:
      "\"Unlike call recorders that tell you what went wrong after you lose a live prospect, Yoodli lets your team practice and certify on high-stakes objections with AI personas before the real meeting.\"",
    sources,
  };
}
