---
# --- Universal Fields (Applied to ALL types) ---

# The title of your post (Max 100 characters)
title: "How I Populated 2000 Blog Posts on Squarespace"

# A comprehensive description of your post. It must be at least 20 characters long for SEO purposes.
description: "Squarespace offers no API for updating content, so I had to get creative. This is how I used Python and Selenium to automate 2000 blog posts for my first Upwork client."

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

Around two years ago, when I had a lot of free time, I started freelancing on Upwork. I set up my account as a professional Squarespace Web Designer, and that's when I met my first client. The first job wasn't even about designing a website; I just needed to help him publish around 50 blog posts for his newspaper business on Squarespace. Since I had the time, I knocked it out in just a few days. He was so surprised and happy that he even called me "A Machine."

A week later, he came back with something much more ambitious. His company, which had been running since 1986, was in the process of moving physical assets to digital. Every week since '86, they released a newspaper about new comic releases (similar to Weekly Shounen Jump in Japan). By that point, he had accumulated around 2,000 issues. He wanted to create a digital archive on Squarespace so subscribers could download any newspaper from 1986 to the present.

How did we solve this?

## Problem

1. Volume: He wanted to create blog posts for every single issue—roughly 2,000 posts in total.
2. Platform Limits: Squarespace is a "low-code" platform. At the time, it didn't have API support for editing or creating blog content. Everything had to be done manually via drag-and-drop.
3. Cost & Time: Doing this manually, like the first job, would be incredibly slow. I estimated it would take 3–5 months of solo work and cost over $5,000.

## Solution

Since manual labor was too expensive and slow, I had to figure out how to let a machine do the work. My solution was `Web Automation`. I had been writing Python scripts to automate `boring` work for a while, so I decided to use `Selenium`—a popular library for web automation and scraping.

### How Selenium works

Selenium works by running a browser in "testing mode," allowing us to execute scripts directly on the browser instance. I recorded every button click and configuration that was predictable and turned them into a Python script.

While there are many ways for Selenium to find elements (CSS classes, HTML IDs, etc.), I found that the easiest way was using XPath. XPath allowed me to select elements based on their text labels. It allowed the script to act like a human: "Read the label that says 'New Post' and click it."

### Challenge 1: Memory Leak and Client site error

Using Selenium was the best option, but Squarespace is a complex, heavy website. Sometimes elements wouldn't load properly, or the browser would suffer from memory leaks and crash after a few posts.

To fix this, I had to debug and test the script rigorously:
- Wait Times: I added "explicit waits" to ensure the browser loaded all elements before the script tried to click them.
- Error Handling: I built logic to retry and reload the site if something went wrong.
- Refresh Strategy: After every few posts, the script would restart the entire browser to clear the memory.
- Logging: I logged every click so I could see exactly which posts were skipped and why.

### Challenge 2: Slowness

The script worked perfectly, but it was slow. Because of the necessary wait times and retries, it took about 5–7 minutes per post. It was still better than doing it manually, but since it was a script, I wanted more speed.

The Solution? Scaling. I created three cloud instances on Digital Ocean to run the script in parallel, dividing the 2,000 posts between them. I also set up a Telegram Bot to notify me every time a post was completed or if an instance hit a major error.

With three instances running simultaneously, the entire 2,000-post archive was finished in about 3 days.

### Challenge 3: Fixing error

No script is 100% perfect. Sometimes an element was missing, or a post was skipped because an image was formatted incorrectly. This was unavoidable. The final step was going through my logs, identifying the failed posts, and fixing those specific issues manually.

## Result

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/YFSLkLNvbkE?si=VwxoY6LQxGz7Gp6e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Aftermath

The client was thrilled. I spent about a week writing and testing the script, and another three days running it. The entire project took 12 days. Later, he offered me similar jobs for image cropping and other Squarespace tasks. He was the best first client I could have asked for, and thanks to him, I earned my first real money online.

I eventually stopped freelancing to focus on my schoolwork, but now that I'm nearing the end of my degree, I might try doing it again.

Thank you for reading this far!

## Other Projects for this Client

The automation project was the biggest challenge, but I also helped the client with several other technical tasks. Since they were smaller, I didn't write full articles for them, but here is a quick look at the workflow:

### Comic Shop Map: Similar Concept but Different Layout

<iframe width="560" height="315" src="https://www.youtube.com/embed/2RY5OKs5F50?si=6iDqhooTijC45c_T" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Comic Shop New Archive Custom Search and Filter Function

<iframe width="560" height="315" src="https://www.youtube.com/embed/nA-GqzWmwSc?si=FqrjcfG3Y6GHO0ja" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

