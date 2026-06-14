import { describe, expect, it } from "vitest";
import { architectureLayers } from "@/features/architecture/content";
import {
  foundationPillars,
  getJavaExample,
  getJavaFundamentalsTopic,
  getJavaModuleMapColumns,
  javaFundamentalsTopicIds,
  javaModules
} from "@/features/java-fundamentals/content";

describe("java fundamentals content", () => {
  it("should expose every module and foundation pillar as a route topic", () => {
    const expectedTopicIds = [
      ...javaModules.map((module) => module.id),
      ...foundationPillars.map((pillar) => pillar.id)
    ];

    expect(javaFundamentalsTopicIds).toEqual(expectedTopicIds);
    expect(new Set(javaFundamentalsTopicIds).size).toBe(javaFundamentalsTopicIds.length);
    expect(javaFundamentalsTopicIds.every((topicId) => getJavaFundamentalsTopic(topicId))).toBe(true);
  });

  it("should keep map columns balanced when modules are added", () => {
    const columns = getJavaModuleMapColumns();
    const renderedModules = [...columns.primary, ...columns.secondary];

    expect(renderedModules.map((module) => module.id)).toEqual(javaModules.map((module) => module.id));
    expect(Math.abs(columns.primary.length - columns.secondary.length)).toBeLessThanOrEqual(1);
  });

  it("should reference existing examples from modules and pillars", () => {
    const moduleExampleIds = javaModules.flatMap((module) => module.exampleIds);
    const pillarExampleIds = foundationPillars.map((pillar) => pillar.exampleId);

    for (const exampleId of [...moduleExampleIds, ...pillarExampleIds]) {
      expect(getJavaExample(exampleId)?.id).toBe(exampleId);
    }
  });

  it("should give foundation pillars dedicated examples", () => {
    const moduleExampleIds = new Set(javaModules.flatMap((module) => module.exampleIds));
    const pillarExampleIds = foundationPillars.map((pillar) => pillar.exampleId);

    expect(new Set(pillarExampleIds).size).toBe(pillarExampleIds.length);

    for (const exampleId of pillarExampleIds) {
      expect(moduleExampleIds.has(exampleId)).toBe(false);
    }
  });

  it("should connect every Java topic to an architecture layer", () => {
    const architectureAnchors = new Set(architectureLayers.map((layer) => `/architecture#${layer.id}`));
    const architectureLinks = [
      ...javaModules.flatMap((module) => module.architectureLinks),
      ...foundationPillars.flatMap((pillar) => pillar.architectureLinks)
    ];

    expect(javaModules.every((module) => module.architectureLinks.length > 0)).toBe(true);
    expect(foundationPillars.every((pillar) => pillar.architectureLinks.length > 0)).toBe(true);

    for (const link of architectureLinks) {
      expect(architectureAnchors.has(link.href)).toBe(true);
    }
  });
});
