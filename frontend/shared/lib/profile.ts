import type { LearningState } from "@/shared/api/contracts";

export function completionTone(completion: number) {
  if (completion >= 90) {
    return "Ready to ship";
  }
  if (completion >= 65) {
    return "Strong start";
  }
  if (completion >= 35) {
    return "Needs focus";
  }
  return "Fresh profile";
}

export function stateAccent(state: LearningState) {
  const accents: Record<LearningState, string> = {
    FOCUSED: "Focus",
    CURIOUS: "Explore",
    BUILDING: "Build",
    STUCK: "Unblock",
    RESTING: "Recharge"
  };
  return accents[state];
}
