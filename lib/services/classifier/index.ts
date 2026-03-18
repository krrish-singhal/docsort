import { ClassificationResult } from "@/lib/types";
import { classifyByRules } from "./ruleClassifier";
import { classifyWithAI } from "./aiClassifier";

export async function classifyDocument(
  text: string,
): Promise<ClassificationResult> {
  // Try rule-based classification first for speed
  const ruleResult = classifyByRules(text);

  if (ruleResult) {
    return ruleResult;
  }

  // Fall back to AI classification
  return await classifyWithAI(text);
}

export { classifyByRules, classifyWithAI };
