---
# --- Universal Fields (Applied to ALL types) ---

# The title of your post (Max 100 characters)
title: "How I Populated 2000 Blog Posts on Squarespace"

# A comprehensive description of your post. It must be at least 20 characters long for SEO purposes.
description: "Squarespace offered no API for bulk blog creation. Here is how I engineered a parallel Python and Selenium automation pipeline to populate 2,000 archival posts in 3 days."

# Creation Date
createdAt: 2026-04-21

# Optional: Last Modified Date
lastModifiedAt: 2026-04-21

# Version of the post
version: "1.0.0"

# Author of the post
author: "Chanveasna ENG"

# Tags for categorization
tags: ["Squarespace", "Upwork", "Freelancing", "Selenium", "Python", "Scripting", "Automation"]

# Set to true to hide this post from production builds (Useful for WIP)
draft: false

# --- Images ---

# Cover Image: place your image in the same folder as this file (e.g. `cover.png`) and uncomment the line below.
coverImage: "./cover.png"
coverAlt: "Comic Shop News Automation."


# --- The Discriminator ---

# Category must exactly be one of: 'blog', 'project', 'participation', 'learning', 'random'
category: "blog"
---

## Introduction

An archival publishing client on Upwork needed to digitize a legacy print publication dating back to 1986. Every week for nearly four decades, they published print issues cataloging comic releases. Over 35 years of continuous publication, they had accumulated an archive of roughly 2,000 physical issues.

The initial engagement began with a small pilot: migrating 50 posts into Squarespace. After delivering that batch ahead of schedule, the client presented the real challenge: migrate the entire 2,000-issue print archive into a searchable digital repository so subscribers could access any edition from 1986 to the present.

The obstacle? Squarespace offered zero API support for programmatic blog post creation.

## Problem

1. **Massive Volume**: 2,000 distinct archive entries, each requiring custom dates, issue numbers, cover artwork, and downloadable PDF assets.
2. **Platform Constraints**: Squarespace is a closed, UI-driven CMS. Without a REST API for blog content, every post had to be composed through the browser editor.
3. **Prohibitive Manual Cost**: Manual copy-paste entry would take an estimated 3 to 5 months of full-time repetitive labor and exceed $5,000 in agency hours.

## Solution

Since manual labor was slow and error-prone, programmatic browser automation was the natural answer. I built an end-to-end automation pipeline in Python using `Selenium` to drive headless browser sessions through the Squarespace publishing interface.

### How Selenium works

Selenium runs a browser in automated testing mode, executing commands directly against DOM elements. Every button click, text input, file upload, and date picker interaction was codified into reproducible Python workflows.

Rather than relying on brittle CSS class names that change across Squarespace builds, I utilized XPath selectors targeted to persistent UI labels. This allowed the script to interact with the interface deterministically: find the "New Post" trigger, inject issue metadata, attach media, and publish.

### Challenge 1: Memory Leaks and Client Session Timeouts

Squarespace runs a heavy Single Page Application (SPA). During extended headless sessions, the browser accumulated memory leaks and eventually stalled after processing several dozen sequential posts.

To guarantee zero downtime and reliable runs:
- **Explicit Waits**: Replaced fixed sleep intervals with condition-based explicit waits, verifying DOM readiness before triggering clicks.
- **Auto-Recovery**: Built retry handlers that captured screenshots and reloaded the page if an upload modal failed.
- **Session Recycling**: Automatically terminated and spawned a fresh browser instance every 25 posts to reclaim memory.
- **Audit Logging**: Recorded every transaction in structured JSON logs to immediately isolate skipped issues.

### Challenge 2: Throughput Optimization

With error handling and explicit waits in place, a single-threaded run averaged 5–7 minutes per post. While faster than human entry, processing 2,000 posts sequentially would still take over a week of continuous compute.

To speed up delivery, I scaled the architecture across three parallel cloud droplets on DigitalOcean, dividing the 2,000 issues into concurrent batches. I also connected a Telegram Bot webhook to stream real-time progress updates and flag any batch anomalies instantly to my phone.

With parallel execution, the entire 2,000-post archive completed in roughly 3 days.

### Challenge 3: Edge Case Resolution

Real-world archival data has anomalies—occasional missing cover images or non-standard naming conventions from 1980s issues. The structured error logs allowed me to filter out the few dozen edge cases that failed automated checks, inspect them, and resolve the remaining items manually.

## Result

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/YFSLkLNvbkE?si=VwxoY6LQxGz7Gp6e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Business Impact & Results

- **Turnaround Time**: 12 days total from initial script architecture to final QA, compared to an estimated 3–5 months of manual data entry.
- **Cost Reduction**: Saved the client over 80% compared to traditional data entry staffing costs.
- **Data Integrity**: 2,000 historical issues successfully published and categorized with zero broken links or corrupted media.
- **Long-term Collaboration**: Impressed by the speed and reliability, the client retained me for multiple follow-up engineering initiatives, including custom search filters and interactive store locators.

When platform APIs fall short, custom browser automation bridges the gap—saving hundreds of hours while preserving complete data integrity across thousands of records.

## Other Projects for this Client

The automation project was the biggest challenge, but I also helped the client with several other technical tasks. Since they were smaller, I didn't write full articles for them, but here is a quick look at the workflow:

### Comic Shop Map: Similar Concept but Different Layout

<iframe width="560" height="315" src="https://www.youtube.com/embed/2RY5OKs5F50?si=6iDqhooTijC45c_T" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Comic Shop News Archive Custom Search and Filter Function

<iframe width="560" height="315" src="https://www.youtube.com/embed/nA-GqzWmwSc?si=FqrjcfG3Y6GHO0ja" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

