import { LANGUAGES, useLanguage } from "../context/LanguageContext.jsx";
import {
  Description,
  Eyebrow,
  FeatureCard,
  FeatureGrid,
  FeatureStatus,
  Heading,
} from "../components/NoteEditor.styles.jsx";

const FEATURES = [
  {
    slug: "timeline",
    title: "View your notes over time",
    description: "See how your notes have evolved and connected.",
  },
  {
    slug: "discuss",
    title: "Discuss your notes with AI",
    description: "Have a conversation with your notes using AI.",
  },
  {
    slug: "ask",
    title: "Ask your notes using AI",
    description: "Get answers grounded in what you've written.",
  },
];

export default function IntelligencePage() {
  const { language } = useLanguage();
  const languageName =
    LANGUAGES.find(({ code }) => code === language)?.name ?? language;

  return (
    <>
      <Eyebrow>Gem Notes AI</Eyebrow>
      <Heading>Intelligence</Heading>
      <Description>
        Explore ideas in your notes with AI. Your selected language is{" "}
        {languageName}.
      </Description>
      <FeatureGrid>
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.slug}
            href={`/intelligence/${feature.slug}`}
          >
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
            <FeatureStatus>Explore feature</FeatureStatus>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </>
  );
}
