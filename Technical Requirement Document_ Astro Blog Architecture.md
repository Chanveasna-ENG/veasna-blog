# **Technical Requirement Document: Scalable Astro Blog Architecture**

**Role:** Principal Technical Architect  
**Date:** 2026 February 18  
**Version:** 1.12.0  
**Status:** Approved for Implementation

## **1\. Executive Summary**

This architecture defines a high-performance, static-site generated (SSG) blog using **Astro**. The system prioritizes "Build-Time Logic" over "Run-Time Logic," ensuring 0ms server latency and maximum SEO performance. All content is file-system based (Markdown/MDX), utilizing strict schema validation to prevent data drift over time.  
**Key Constraints & Decisions:**

* **Hosting:** DigitalOcean App Platform (Static).  
* **Interactivity:** Client-side only (React/Svelte/Vue "Islands" where necessary).  
* **Taxonomy:** Single Collection Strategy with Discriminated Unions.  
* **URL Structure:** /posts/\[slug\] (Flat, Clean URLs).  
* **Scripting Language:** Typescript  
* **RSS Feed:** enabled for those want to get updated new feed  
* **Sitemap:** enabled for google and seo purpose  
* **Formatter:** Prettier  
* **Linter:** Eslint with Astro and Typescript

## **2\. Data Architecture (The Schema)**

We will utilize **Astro Content Collections** to enforce type safety. This is the most critical part of the system. If this schema is weak, the UI will break when content scales.

### **2.1 The Single Collection Strategy**

Instead of separating projects and blog into different folders, we use a single src/content/blog folder. We distinguish them via a category field in the frontmatter.

### **2.2 Zod Schema Definition**

We use a **Discriminated Union**. This allows the shape of the data to change based on the category.  
**File:** src/content/config.ts  
import { z, defineCollection } from 'astro:content';

const blogCollection \= defineCollection({  
  type: 'content',  
  schema: ({ image }) \=\> z.object({  
    // \--- Universal Fields (Applied to ALL types) \---  
    title: z.string().max(100, "Title too long"),  
    description: z.string().min(20, "Description too short for SEO"),  
      
    // Dates & Versioning  
    // Zod will parse ISO strings (2023-10-26T14:00:00.000+07:00) into Date objects  
    createdAt: z.date(),  
    lastModifiedAt: z.date().optional(),  
    version: z.string().default('1.0.0'), // Useful for tracking major rewrites  
    author: z.string().default('Your Name'),  
      
    // Taxonomy  
    tags: z.array(z.string()).default(\[\]),  
    draft: z.boolean().default(false),

    // Images  
    // strictly validates that the string path exists in src/assets or public  
    coverImage: image().optional(),  
    coverAlt: z.string().optional(),

    // \--- The Discriminator \---  
    category: z.enum(\['blog', 'project', 'participation', 'learning', 'random'\]),

    // \--- Type-Specific Fields (Optional but Typed) \---  
    // These are available on all, but logically belong to specific categories.  
    // We keep them optional to avoid strict build failures during drafting.  
    repoUrl: z.string().url().optional(),  
    demoUrl: z.string().url().optional(),  
      
    // Participation/Event Specifics  
    eventResult: z.string().optional(), // e.g. "Finalist", "Gold Medal"  
    eventLocation: z.string().optional(), // e.g. "Tokyo", "Remote"  
    eventDate: z.date().optional(),  
  }),  
});

export const collections \= {  
  'blog': blogCollection,  
};

### **2.3 Image Handling Strategy**

* **Inline Images (Visual Studio Code Flow):**  
  * **Workflow:** When writing in VS Code, paste your image (e.g., ui-diagram.png) directly next to your markdown file (colocation) or in a subfolder src/content/blog/images/.  
  * **Syntax:** Use standard markdown: \!\[Diagram of UI\](./images/ui-diagram.png).  
  * **Behavior:** Astro will detect this relative path, optimize the image (convert to WebP/Avif), and embed it. **This works by default.**  
* **Frontmatter Images:** We use the image() helper in Zod (seen above) for cover images.

### **2.4 Search Index JSON Schema**

This JSON file (/search-index.json) is generated at build time. It is a lightweight representation of the Content Collection, designed specifically for the client-side Fuse.js search engine. It mirrors the Zod schema but excludes the heavy markdown body.  
**Schema Interface:**  
interface SearchIndexItem {  
  slug: string;       // The unique URL identifier  
  title: string;      // From frontmatter  
  description: string;// From frontmatter  
  category: 'blog' | 'project' | 'participation' | 'learning' | 'random';  
  tags: string\[\];  
  author: string;  
  date: string;       // ISO String (lastModifiedAt || createdAt) for sorting  
}

## **3\. URL Structure & Routing Logic**

We will implement a **Flat URL Structure**: domain.com/posts/\[slug\].

### **3.1 The "Global Uniqueness" Constraint**

**Constraint:** Since we removed \[category\] from the URL, the slug must be unique across the entire blog.

* *Conflict:* You cannot have a project named "setup" and a blog post named "setup".  
* *Validation:* Astro will warn you during the build if duplicate slugs are found.

### **3.2 Dynamic Routing Implementation**

We move the dynamic route to the root of the posts folder.  
**File:** src/pages/posts/\[slug\].astro  
\---  
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {  
  const posts \= await getCollection('blog');  
    
  return posts.map(post \=\> {  
    return {  
      params: {   
        // No category in the params anymore, just the slug  
        slug: post.slug   
      },   
      props: { post },  
    };  
  });  
}

const { post } \= Astro.props;  
const { Content, headings } \= await render(post); // Extract headings here  
\---

\<\!-- Pass headings to layout or TOC component \--\>  
\<Content /\>

## **4\. Component Architecture**

We strictly separate **Layouts** (HTML Shells), **Components** (UI Units), and **Pages** (Route Handlers).

### **4.1 Folder Structure**

/src  
├── /assets                \<-- Images here for optimization  
├── /components  
│   ├── /common  
│   │   ├── Navigation.astro \<--- Also, design as mobile first web application.   
│   │   ├── Footer.astro      \<-- The "Signature" of the site  
│   │   ├── MetaHead.astro \<--- Critical for SEO/Social Share  
│   │   ├── ContactButton.astro \<-- Reusable styled anchor button  
│   │   ├── ProfileCard.astro   \<-- Author bio/intro card (Vertical)  
│   │   └── HorizonProfileCard.astro \<-- Author bio/intro card (Horizontal)  
│   ├── /blog  
│   │   ├── BlogList.astro    \<-- Listing and Pagination Logic  
│   │   ├── BlogPreview.astro \<-- Individual Post Card  
│   │   ├── BlogContent.astro \<-- Standard Markdown Renderer  
│   │   ├── PostHeader.astro  \<-- Renders Title, Author, Date, Version  
│   │   ├── TableOfContent.astro \<-- Sticky Right Sidebar  
│   │   └── SimilarBlogList.astro \<-- Recommendation Engine  
│   └── /interactive  
│       ├── SearchBar.tsx     \<-- React component for search (Fuse.js)  
│       └── Filter.tsx        \<-- React component for Filtering & Sorting  
├── /content  
│   └── /blog                 \<-- All MD files live here  
│       ├── /images           \<-- Store your inline images here for easy referencing  
│       └── my-project.md  
├── /layouts  
│   └── BaseLayout.astro      \<-- \<html\>, \<body\>, global styles  
├── /pages  
│   ├── index.astro           \<-- Homepage (Main Blog Page)  
│   ├── rss.ts  
│   ├── sitemap.xml  
│   ├── /page  
│   │   └── /\[page\].astro     \<-- Paginated Blog Pages  
│   └── /posts  
│       └── /\[...slug\].astro  \<-- The Universal Post Handler (Moved up one level)  
└── /styles  
    └── global.css            \<-- Tailwind directives

### **4.2 Detailed Component Specifications**

This section defines the strict requirements for individual components.

#### **A. Navigation Bar**

* **File:** src/components/common/Navigation.astro  
* **Role:** Primary site navigation. Handles responsive states and routing.  
* **Design Principle:** Mobile-First.  
* **Layout Specifications:**  
  * **Container:** nav element, sticky top or fixed, with glassmorphism effect (backdrop-blur).  
  * **Left Section:**  
    * **Logo:** Text or SVG. Clicking it routes to /.  
  * **Middle Section (Desktop):**  
    * **Links:** "Home" (/) and "About Me" (/about).  
    * **Styling:** Centered flex container. Hidden on Mobile.  
  * **Right Section:**  
    * **CTA:** "Contact Me" button.  
    * **Action:** Anchor tag \<a\> with href="mailto:veasna@veasnaec.com".  
    * **Styling:** Distinct button style (e.g., solid primary color) to differentiate from nav links.  
  * **Mobile Behavior:**  
    * Middle links are hidden.  
    * A "Hamburger" menu icon appears on the Right (next to or replacing the Contact button depending on space).  
    * Opening menu reveals "Home" and "About Me" in a dropdown/drawer.

#### **B. SearchBar**

* **File:** src/components/interactive/SearchBar.tsx  
* **Role:** Client-side search interface.  
* **Framework:** React (utilizing client:load directive in Astro).  
* **Dependencies:** fuse.js (for fuzzy logic), swr or fetch (to load index).  
* **Data Source:** /search-index.json (generated at build time).  
* **Search Logic:**  
  * **Keys:** \['title', 'description'\]  
  * **Threshold:** 0.3 (Fuzzy tolerance).  
* **UI/UX Specifications:**  
  * **Visual Style:** "Google Result Page" aesthetic. Minimalist.  
  * **Input:** Rounded pill shape or clean line, shadow on focus.  
  * **Behavior:**  
    * Input field is prominent.  
    * Results appear in a dropdown/popover immediately as the user types (preventing layout shift).  
    * Clicking a result navigates to /posts/\[slug\].

#### **C. Filter & Sort Bar**

* **File:** src/components/interactive/Filter.tsx  
* **Role:** Filters the post list by attributes and controls sorting order.  
* **Framework:** React (likely shared state with a PostList wrapper or context).  
* **UI Layout:** A simple row of Dropdowns (Selects) placed **below** the Search Bar.  
* **Filtering Logic:**  
  * **Category Filter:** Dropdown. Options: All (Default), Project, Learning, Participation, Blog, Random.  
  * **Tag Filter:** Dropdown. Options: All (Default), plus a dynamically generated list of **Unique Tags** from all posts.  
* **Sorting Logic:**  
  * **Sort By:** Dropdown.  
  * **Options:**  
    1. Date: Newest First (Default).  
    2. Date: Oldest First.  
    3. Title: A-Z (Ascending).  
    4. Title: Z-A (Descending).  
  * **Date Definition:** Uses lastModifiedAt if available, otherwise createdAt.  
* **Interaction:** Changing any dropdown updates the displayed list of posts immediately (Client-side).

#### **D. Blog List & Pagination**

* **File:** src/components/blog/BlogList.astro  
* **Role:** Server-side iteration and display of posts.  
* **Pagination Logic:**  
  * **Limit:** 10 Posts per page.  
  * **Route:** /posts/page/\[page\].  
* **UI Layout:**  
  * A vertical stack of **Blog Preview** components.  
  * **Pagination Controls (Bottom):**  
    * Symbols: \<\< (First), \< (Prev), 1 2 3 ..., \> (Next), \>\> (Last).  
    * Behavior: Standard Astro page.url.prev and page.url.next logic.

#### **E. Blog Preview Card**

* **File:** src/components/blog/BlogPreview.astro  
* **Role:** Represents a single post in a list (used by BlogList and Search Results).  
* **Data Source:** Takes a CollectionEntry\<'blog'\> or a matching JSON object.  
* **Visual Specifications:**  
  * **Title:** Large, clickable (H2 or H3).  
  * **Description:** Truncated text (2-3 lines).  
  * **Meta Row:**  
    * **Author:** "Author: \[Name\]"  
    * **Date:** "Last Modified: \[Date\]" (uses strict ICT timezone formatter).  
    * **Category:** Badge/Pill style (e.g., "Project").  
    * **Tags:** Row of small text tags.

#### **F. Contact Button**

* **File:** src/components/common/ContactButton.astro  
* **Role:** A reusable, styled anchor component for external or internal links.  
* **Props:**  
  * href: Target URL (e.g., mailto:... or https://...).  
  * icon: SVG or Icon name (optional).  
  * text: Button label.  
* **Visuals:** Styled distinctively (e.g., primary color background, rounded corners) to stand out as a CTA.

#### **G. Profile Card**

* **File:** src/components/common/ProfileCard.astro  
* **Role:** Author introduction card (Vertical), typically used in sidebars.  
* **Structure:**  
  1. **Image:** Circular crop of the author's photo.  
  2. **Name:** Prominent text below the image.  
  3. **Introduction:** Brief bio text/paragraph.  
  4. **Action:** Instance of ContactButton.astro linking to email.

#### **H. Footer**

* **File:** src/components/common/Footer.astro  
* **Role:** Site signature and functional endpoint.  
* **Design Specs:**  
  * **Background:** Lighter gray (\#3D3D3D) to visually separate from main content.  
  * **Layout:** Three distinct columns/sections.  
* **Content Structure:**  
  1. **The Identity (Left):**  
     * **Brand Name:** "Veasna." (Signature Gold Color).  
     * **Mission:** "Building solutions for repetitive tasks".  
  2. **The Map (Right):**  
     * **Links:** "Home", "About Me", "Contact Me" (Clean row).  
     * **Purpose:** Safety net navigation.  
  3. **The Copyright (Bottom Center):**  
     * **Text:** "© 2026 ENG Chanveasna".  
     * **Style:** Small, muted text.

#### **I. Blog Content Renderer**

* **File:** src/components/blog/BlogContent.astro  
* **Role:** The visual renderer for the markdown body.  
* **Dependencies:** @tailwindcss/typography (Tailwind Prose plugin).  
* **Specifications:**  
  * **Standard Markdown Support:** Must strictly render all standard Markdown elements (Headings H1-H6, Tables, Blockquotes, Lists, Images, Horizontal Rules).  
  * **Styling:** Wraps the \<Content /\> component in a prose (Tailwind Typography) container to ensure raw HTML output is styled beautifully and consistently without manual CSS for every tag.

#### **J. Table of Content**

* **File:** src/components/blog/TableOfContent.astro  
* **Role:** Displays the auto-generated heading hierarchy.  
* **Mechanism:** Receives headings array (from Astro's render()) as a prop.  
* **UI Behavior:**  
  * **Desktop:** Fixed/Sticky column on the **Right** side.  
    * **Scrolling:** Independent scrollbar if content exceeds viewport (max-height: 100vh; overflow-y: auto).  
  * **Smartphone:** Placed at the **top** of the page (under title/cover).  
    * **Scrolling:** Standard scroll behavior (no viewport constraint).

#### **K. Horizontal Profile Card**

* **File:** src/components/common/HorizonProfileCard.astro  
* **Role:** A wide-format author introduction card, suitable for the bottom of posts or wider content areas.  
* **Layout Logic:** Flex row or Grid (Image Left | Content Right).  
* **Structure:**  
  1. **Left Side:** Large circular author image.  
  2. **Right Side:**  
     * **Name:** Heading text.  
     * **Introduction:** Descriptive text/bio.  
     * **Action:** Instance of ContactButton.astro.

#### **L. Similar Blog List**

* **File:** src/components/blog/SimilarBlogList.astro  
* **Role:** Recommendation engine to reduce bounce rate.  
* **Mechanism:**  
  * **Build-Time Analysis:** During the build, the component calculates similarity scores between the *current* post and *all other* posts.  
  * **Algorithm:** Uses **TF-IDF** (Term Frequency-Inverse Document Frequency) on tags, title, and description, or a Vector Space Model.  
* **Logic:**  
  1. Extract text tokens from current post.  
  2. Calculate similarity vector against all other posts.  
  3. Sort by score (Highest first).  
  4. Slice top 3\.  
* **Composition:** Renders 3 instances of BlogPreview.astro.

### **4.3 Page Specifications**

This section defines the composition of the main route pages.

#### **1\. Main Blog Page**

* **Route:** /  
* **File:** src/pages/index.astro  
* **Composition:**  
  * **Header:** Navigation.astro.  
  * **Body (Grid Layout):**  
    * **Left Column (70%):**  
      1. SearchBar.tsx (Client interactive).  
      2. Filter.tsx (Client interactive).  
      3. BlogList.astro (Displays first 10 posts).  
    * **Right Column (30%):**  
      1. ProfileCard.astro.  
  * **Footer:** Footer.astro.

#### **2\. Paginated Page**

* **Route:** /page/\[page\]  
* **File:** src/pages/page/\[page\].astro  
* **Composition:** Identical to Main Blog Page, but BlogList.astro receives the paginated dataset for the current page number.  
  * **Header:** Navigation.astro.  
  * **Body (Grid Layout):**  
    * **Left Column (70%):**  
      1. SearchBar.tsx.  
      2. Filter.tsx.  
      3. BlogList.astro (Displays posts 11-20, 21-30, etc.).  
    * **Right Column (30%):**  
      1. ProfileCard.astro.  
  * **Footer:** Footer.astro.

#### **3\. Blog Post Page**

* **Route:** /posts/\[slug\]  
* **File:** src/pages/posts/\[slug\].astro  
* **Composition:**  
  * **Header:** Navigation.astro.  
  * **Body (Grid Layout):**  
    * **Left Column (70%):**  
      1. BlogContent.astro (Main Markdown Content).  
      2. HorizonProfileCard.astro (Author Bio \- Bottom of content).  
      3. SimilarBlogList.astro (Recommendations).  
    * **Right Column (30%):**  
      1. TableOfContent.astro (Sticky Sidebar).  
  * **Footer:** Footer.astro.

## **5\. Functional Specifications**

### **5.1 Sorting & Grouping**

Since we use a Single Collection, grouping is a simple array filter.

* **Projects Page:** posts.filter(p \=\> p.data.category \=== 'project')  
* **Participation Page:** posts.filter(p \=\> p.data.category \=== 'participation')

### **5.2 Date Handling (Strict ICT Timezone)**

* **Requirement:** "Full date: Year Month Date Hour Minute Seconds (Timezone: ICT Phnom Penh)"  
* **Implementation:** We will create a robust formatDate utility to prevent hydration mismatches.

// src/utils/date.js

export function formatDateICT(dateInput) {  
  const date \= new Date(dateInput);  
    
  return new Intl.DateTimeFormat('en-GB', {  
    timeZone: 'Asia/Phnom\_Penh',  
    year: 'numeric',  
    month: 'long', // "October"  
    day: '2-digit',  
    hour: '2-digit',  
    minute: '2-digit',  
    second: '2-digit',  
    hour12: false // 24-hour format  
  }).format(date);  
}  
// Output Example: "26 October 2023 at 14:05:30"

* **Frontmatter Rule:** You must enter dates in ISO format with offset (e.g., 2023-10-26T14:00:00+07:00) or standard format, and the utility will force the display to Phnom Penh time.

### **5.3 Interactive Elements (Client-Side)**

* **Search/Filter:** Since the dataset is small (\<1000 posts), we will load a lightweight JSON index of all posts into the client browser.  
* **Framework:** Use **Preact** or **Svelte** for the search bar (smaller bundle size than React) to filter the list of posts instantly without page reloads.

### **5.4 RSS Feed**

* **RSS Feed:** must be generated for those who need

### **5.5 Sitemap**

* **Sitemap:** must generated for seo purpose

### **5.6 Table of Contents (TOC)**

* **Requirement:** Auto-generated heading hierarchy stickied to the **right** side of the post.  
* **Mechanism:** Astro's render() function returns a headings array (text, slug, depth). We pass this to the TableOfContent component.  
* **UI Behavior:**  
  * **Desktop:** Fixed/Sticky column on the **Right**.  
  * **Scrolling:** Independent scrollbar if the TOC exceeds viewport height (max-height: 100vh; overflow-y: auto).  
  * **Layout Logic:** The post layout will utilize a Grid or Flex approach: \[ Content (Center) | TOC (Right) \].  
  * **Smartphone:** It is placed on the **top** of each page, under the title and cover images. In smartphone view, it must be scrollable without caring if the TOC exceeds the viewport height (unlike Desktop).

## **6\. Deployment Workflow (DigitalOcean)**

1. **Repo:** Push code to GitHub (Private or Public).  
2. **DigitalOcean App Platform:**  
   * Connect GitHub Repo.  
   * **Build Command:** npm run build  
   * **Output Directory:** dist  
   * **Route:** /  
3. **Environment:** Ensure Node.js version matches local (LTS recommended).

## **7\. Migration & Scalability Plan**

* **Step 1 (Now):** Build standard Markdown files.  
* **Step 2 (Future \- Complexity Spike):** If you need to embed live code snippets or interactive charts inside a blog post, upgrade file extension from .md to .mdx. Astro supports this natively.  
* **Step 3 (Future \- Search):** When posts \> 1000, move from Client-Side Search to Pagefind (static search library) to avoid bloating the JavaScript bundle.