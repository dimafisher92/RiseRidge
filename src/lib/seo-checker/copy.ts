// Business-owner-friendly copy for each check. Kept separate from scoring logic.
// - label: friendly name (always visible)
// - pass: plain-language reassurance shown when the check passes
// - issue: plain-language explanation shown when the check warns/fails (gated)
// - benefit: one outcome-focused sentence shown for warn/fail (gated)

export interface CheckCopy {
  label: string;
  pass: string;
  issue: string;
  benefit: string;
}

export const CHECK_COPY: Record<string, CheckCopy> = {
  'title-tag': {
    label: 'Your page headline (title)',
    pass: 'Your page title is a good length and shows in full on Google.',
    issue:
      'Your page title is the clickable headline Google shows in search results. Right now it is missing or the wrong length, so Google may cut it off or replace it — visitors see a weaker, less convincing headline.',
    benefit:
      'What you gain if ArcWave fixes this: a clear, click-worthy headline that shows in full, so more people choose your link over a competitor’s.',
  },
  'meta-description': {
    label: 'Your search preview text',
    pass: 'Your search preview text is a healthy length and reads well.',
    issue:
      'This is the short summary under your link in Google. It is missing or the wrong length, so Google writes its own — often a dull snippet that does not sell your business.',
    benefit:
      'What you gain if ArcWave fixes this: a persuasive preview that pulls more clicks from the same Google ranking — free extra traffic.',
  },
  'h1-heading': {
    label: 'Your main on-page heading',
    pass: 'Your page has exactly one clear main heading.',
    issue:
      'The main heading tells both visitors and Google what the page is about. Yours is missing or there are several competing ones, which muddies your message.',
    benefit:
      'What you gain if ArcWave fixes this: a focused page that ranks for the right searches and instantly tells visitors they are in the right place.',
  },
  'subheadings': {
    label: 'Section subheadings',
    pass: 'Your content is broken up with helpful subheadings.',
    issue:
      'Subheadings break content into scannable sections. With few or none, your page reads like a wall of text that visitors skim past.',
    benefit:
      'What you gain if ArcWave fixes this: easy-to-scan content that keeps visitors reading and helps Google understand your page.',
  },
  'canonical': {
    label: 'Duplicate-content safeguard',
    pass: 'Your page tells Google which version is the official one.',
    issue:
      'A canonical tag tells Google which version of a page is the “official” one. Without it, Google can split your ranking power across duplicate URLs.',
    benefit:
      'What you gain if ArcWave fixes this: all your ranking strength points at one page instead of being diluted — stronger positions.',
  },
  'word-count': {
    label: 'Amount of useful content',
    pass: 'Your page has enough content for Google to understand and rank it.',
    issue:
      'Thin pages give Google and customers little to work with. There is not enough content here to answer questions or rank competitively.',
    benefit:
      'What you gain if ArcWave fixes this: richer pages that answer real customer questions and rank for far more searches.',
  },
  'image-alt': {
    label: 'Image descriptions',
    pass: 'Most of your images have descriptive text.',
    issue:
      'Image descriptions (alt text) help Google understand your images and let you appear in image search — many of yours are missing.',
    benefit:
      'What you gain if ArcWave fixes this: extra visibility in Google Images and a more accessible site that reaches more customers.',
  },
  'readability': {
    label: 'Readability',
    pass: 'Your sentences are an easy, scannable length.',
    issue:
      'Long, dense sentences make visitors work harder and leave faster. Your average sentence runs longer than most readers comfortably follow.',
    benefit:
      'What you gain if ArcWave fixes this: clearer copy that keeps visitors engaged and moves more of them toward contacting you.',
  },
  'https': {
    label: 'Secure connection (HTTPS)',
    pass: 'Your site loads over a secure, encrypted connection.',
    issue:
      'Without HTTPS, browsers flag your site as “Not secure,” which scares away visitors and hurts rankings.',
    benefit:
      'What you gain if ArcWave fixes this: a trusted padlock in the address bar that protects conversions and rankings.',
  },
  'indexable': {
    label: 'Visible to Google',
    pass: 'This page is open for Google to index and rank.',
    issue:
      'This page is currently telling Google not to show it in search results. That means it earns zero organic traffic, no matter how good it is.',
    benefit:
      'What you gain if ArcWave fixes this: the page becomes eligible to rank and bring in visitors instead of being invisible.',
  },
  'viewport': {
    label: 'Mobile-friendly setup',
    pass: 'Your page is set up to display properly on phones.',
    issue:
      'Without a mobile viewport setting, your page can look broken on phones — where most of your visitors are.',
    benefit:
      'What you gain if ArcWave fixes this: a site that looks right on every phone, so mobile visitors stay and convert.',
  },
  'social-cards': {
    label: 'Social share preview',
    pass: 'Your links show a rich preview when shared on social media.',
    issue:
      'When someone shares your link on Facebook, LinkedIn or in messages, the right title, description and image are missing — so it looks plain and gets ignored.',
    benefit:
      'What you gain if ArcWave fixes this: eye-catching share previews that earn more clicks every time your link is posted.',
  },
  'structured-data': {
    label: 'Rich-result markup',
    pass: 'Your page includes structured data Google can use for rich results.',
    issue:
      'Structured data lets Google show stars, prices, FAQs and business info directly in search. Your page has none, so you miss those eye-catching extras.',
    benefit:
      'What you gain if ArcWave fixes this: enhanced listings (stars, FAQs, business details) that stand out and win more clicks.',
  },
  'internal-links': {
    label: 'Links between your pages',
    pass: 'Your page guides visitors to other pages on your site.',
    issue:
      'Internal links help visitors explore and help Google find your other pages. This page has very few, leaving visitors at a dead end.',
    benefit:
      'What you gain if ArcWave fixes this: visitors who explore more pages and spread ranking strength across your whole site.',
  },
  'outbound-links': {
    label: 'Links to trusted sources',
    pass: 'Your page references credible outside sources.',
    issue:
      'Linking to a few trusted sources signals credibility to Google and readers. Your page has none.',
    benefit:
      'What you gain if ArcWave fixes this: added trust and context that supports your rankings and your readers.',
  },
  'link-quality': {
    label: 'Healthy link setup',
    pass: 'Your links are well-formed and not stuffed.',
    issue:
      'Some links go nowhere or the page is crammed with too many links, which frustrates visitors and dilutes value.',
    benefit:
      'What you gain if ArcWave fixes this: a clean, trustworthy linking structure that improves both experience and rankings.',
  },

  // ---- AI Visibility ----
  'ai-robots-access': {
    label: 'AI crawler access',
    pass: 'AI search bots can crawl and index your site freely.',
    issue:
      'Your robots.txt is blocking one or more AI search bots (like ChatGPT, Perplexity, or Claude). These tools drive discovery for millions of users — blocking them means your business cannot appear in AI-powered answers.',
    benefit:
      'What you gain if ArcWave fixes this: your site becomes eligible to be cited and recommended by AI search tools, opening a fast-growing traffic channel.',
  },
  'ai-llms-txt': {
    label: 'AI content guidance (llms.txt)',
    pass: 'Your site has an llms.txt file that guides AI tools on what to read.',
    issue:
      'A llms.txt file is a new standard that tells AI assistants and crawlers exactly what your business does and which content matters most. Without one, AI tools have to guess — and often get it wrong.',
    benefit:
      'What you gain if ArcWave adds this: AI assistants get accurate, curated information about your business, making them far more likely to recommend you.',
  },
  'ai-faq-schema': {
    label: 'Q&A structured data',
    pass: 'Your page uses FAQ or HowTo schema that AI can parse directly.',
    issue:
      'FAQ and HowTo structured data let AI engines pull your answers directly into their responses. Without it, AI tools may miss your expertise even when you have the right content.',
    benefit:
      'What you gain if ArcWave adds this: your answers can be surfaced verbatim in AI search results and voice assistants — zero-click authority.',
  },
  'ai-author-markup': {
    label: 'Expert authorship signals',
    pass: 'Your content is attributed to a named author, signalling trust to AI systems.',
    issue:
      'AI systems and Google\'s quality algorithms favour content with clear authorship — it signals expertise and accountability. Your content currently has no named author attribution.',
    benefit:
      'What you gain if ArcWave fixes this: stronger E-E-A-T signals that help both AI and Google treat your content as authoritative.',
  },
  'ai-entity-clarity': {
    label: 'Business identity for AI',
    pass: 'Your page includes structured data that clearly identifies your business entity to AI.',
    issue:
      'AI systems build knowledge graphs from structured data. Without entity schema (Organization, LocalBusiness, Person, etc.), AI tools struggle to connect your content to a real, trustworthy business.',
    benefit:
      'What you gain if ArcWave adds this: a clear digital identity that AI systems can reliably reference, boosting your visibility in AI-generated answers.',
  },
};

export function copyFor(id: string): CheckCopy {
  return (
    CHECK_COPY[id] ?? {
      label: id,
      pass: 'This check looks good.',
      issue: 'This area needs attention.',
      benefit: 'What you gain if ArcWave fixes this: stronger SEO performance.',
    }
  );
}
