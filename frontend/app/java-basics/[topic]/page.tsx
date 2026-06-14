import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getJavaFundamentalsTopic,
  javaFundamentalsTopicIds,
  type JavaFundamentalsTopic
} from "@/features/java-fundamentals/content";
import { JavaFundamentalsDetail } from "@/features/java-fundamentals/JavaFundamentalsDetail";
import { AppShell } from "@/shared/ui/AppShell";

type JavaFundamentalsTopicPageProps = Readonly<{
  params: Promise<{
    topic: string;
  }>;
}>;

export function generateStaticParams() {
  return javaFundamentalsTopicIds.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: JavaFundamentalsTopicPageProps): Promise<Metadata> {
  const { topic: topicId } = await params;
  const topic = getJavaFundamentalsTopic(topicId);

  if (!topic) {
    return {
      title: "Java Fundamentals"
    };
  }

  return {
    alternates: {
      canonical: `/java-basics/${topicId}`
    },
    description: getTopicDescription(topic),
    title: getTopicTitle(topic)
  };
}

export default async function JavaFundamentalsTopicPage({ params }: JavaFundamentalsTopicPageProps) {
  const { topic: topicId } = await params;
  const topic = getJavaFundamentalsTopic(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <AppShell active="java-basics" eyebrow="java-start://java-basics" title="Java Fundamentals">
      <JavaFundamentalsDetail topic={topic} />
    </AppShell>
  );
}

function getTopicTitle(topic: JavaFundamentalsTopic) {
  return topic.kind === "module" ? topic.module.title : topic.pillar.label;
}

function getTopicDescription(topic: JavaFundamentalsTopic) {
  return topic.kind === "module" ? topic.module.summary : topic.pillar.description;
}
