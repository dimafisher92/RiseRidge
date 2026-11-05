import type { Metadata } from 'next';
import { ServicePage, type ServicePageContent } from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'Local SEO Agency & Google Business Profile',
  description:
    'Local SEO agency for service businesses: Google Business Profile optimization, local landing pages, citations and reviews that turn map rankings into calls.',
  alternates: { canonical: '/local-seo' },
  openGraph: {
    title: 'Local SEO Agency | RiseRidge',
    description: 'Local SEO measured in calls, map visibility and website visits.',
  },
};

const CONTENT: ServicePageContent = {
  path: '/local-seo',
  breadcrumb: 'Local SEO',
  eyebrow: 'Local SEO agency',
  title: 'Local SEO that makes the',
  titleAccent: 'phone ring',
  answer:
    'RiseRidge is a local SEO agency for service businesses and multi-location brands. We optimize your Google Business Profile, build a landing page for each service and area you cover, fix the technical issues holding your site back, and track the results in map visibility, phone calls and website visits. Engagements are month-to-month.',
  primaryCta: 'Get a Free Local SEO Audit',
  included: [
    {
      title: 'Google Business Profile management',
      description:
        'Categories, services, products, photos, posts and Q&A, kept complete, accurate and active.',
    },
    {
      title: 'Local landing pages',
      description:
        'One page per core service and service area, written for the way customers search, such as "[service] near me" or "[service] in [city]".',
    },
    {
      title: 'Technical local SEO',
      description:
        'Site health, speed, LocalBusiness schema, consistent name, address and phone, and internal links between services and areas.',
    },
    {
      title: 'Citations and directories',
      description:
        'Consistent listings on the directories that Google and AI assistants use to verify and recommend local businesses.',
    },
    {
      title: 'Reviews process',
      description:
        'A simple way to ask real customers for reviews and respond to every one. We never buy, write or gate reviews.',
    },
    {
      title: 'Map and rank tracking',
      description:
        'Keyword positions and map visibility across your service area, plus calls, website clicks and direction requests from your profile.',
    },
  ],
  steps: [
    {
      title: 'Audit',
      description:
        'Your profile, site, citations, and the competitors who own the map results in your area.',
    },
    {
      title: 'Fix',
      description: 'Complete the Google Business Profile, fix site health and clean up your business data.',
    },
    {
      title: 'Build',
      description: 'Launch landing pages and content for each service and city you want to win.',
    },
    {
      title: 'Grow',
      description: 'Reviews, local links and a monthly report on calls, visits and map visibility.',
    },
  ],
  proof: [
    {
      client: 'Windshield-repair shop, Charlotte, NC',
      period: 'First 90 days',
      stats: [
        { value: '519 of 1,000', label: 'Tracked keywords in Google\'s top 10' },
        { value: '15.5 → 10.1', label: 'Average Google position' },
        { value: '71', label: 'Phone calls from Google Business Profile' },
        { value: '6', label: 'Local landing pages launched' },
      ],
    },
    {
      client: 'Catering company',
      period: 'First 90 days',
      stats: [
        { value: '+76%', label: 'Local map visibility' },
        { value: '+37%', label: 'Visits from Google Maps' },
        { value: '61 → 92', label: 'Site health score' },
      ],
    },
  ],
  fit: [
    'Service-area businesses: auto glass and repair, home services, legal, medical and other professional services',
    'Restaurants, catering and hospitality',
    'Multi-location brands that need every location to rank in its own area',
    'Owners who want results measured in calls and visits, not impressions',
  ],
  guides: [
    { href: '/blog/google-business-profile-optimization/', title: 'Google Business Profile optimization: a step-by-step guide' },
    { href: '/blog/chatgpt-recommendation-experiment/', title: 'Our research: how ChatGPT picks local firms to recommend' },
    { href: '/blog/technical-seo-audit-checklist/', title: 'Technical SEO audit checklist' },
    { href: '/ai-seo-agency/', title: 'AI SEO: getting recommended by AI assistants' },
  ],
  faqs: [
    {
      question: 'What does a local SEO agency do?',
      answer:
        'A local SEO agency helps a business show up when people nearby search for its services on Google, Google Maps and AI assistants. The core work is Google Business Profile optimization, local landing pages, consistent directory listings, a reviews process and technical fixes, measured in calls, website visits and direction requests.',
    },
    {
      question: 'How long does local SEO take?',
      answer:
        'It depends on competition and on where your profile and site start. For reference, our Charlotte, NC windshield-repair client improved its average Google position from 15.5 to 10.1 and put 519 of its 1,000 tracked keywords into Google\'s top 10 within the first 90 days.',
    },
    {
      question: 'Do you manage Google Business Profile posts and reviews?',
      answer:
        'Yes. We keep the profile complete and active with posts, photos and Q&A, and set up a process for asking real customers for reviews and responding to them. We never buy, write or gate reviews.',
    },
    {
      question: 'Do you work with multi-location businesses?',
      answer:
        'Yes. Each location gets its own landing page and profile strategy. One multi-location retail client with 50+ locations grew revenue 277% and reached #1–3 local pack rankings.',
    },
    {
      question: 'Does local SEO help with ChatGPT and other AI assistants?',
      answer:
        'Yes. When people ask an AI assistant for a business in their city, the answer is built largely from directories, review sites and business profiles. In our own test of 15 ChatGPT lawyer recommendations, every shortlist came from third-party directories, not the firms\' own websites. Consistent listings and real reviews help you appear there.',
    },
    {
      question: 'Do I need a long-term contract?',
      answer: 'No. RiseRidge works month-to-month with no long-term lock-in.',
    },
  ],
  cta: {
    heading: 'Who Owns the Map in Your Area?',
    description:
      'Get a free local SEO audit: your Google Business Profile, site health, citations, and the competitors outranking you nearby.',
    primaryLabel: 'Get Your Free Local Audit',
  },
  schema: {
    name: 'Local SEO',
    serviceType: 'Local SEO',
    description:
      'Google Business Profile optimization, local landing pages, citations, reviews process and technical local SEO for service businesses and multi-location brands.',
  },
};

export default function LocalSeoPage() {
  return <ServicePage content={CONTENT} />;
}
