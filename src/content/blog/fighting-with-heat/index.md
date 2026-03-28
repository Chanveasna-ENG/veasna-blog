---
# --- Universal Fields (Applied to ALL types) ---

# The title of your post (Max 100 characters)
title: "Your Post Title Here"

# A comprehensive description of your post. It must be at least 20 characters long for SEO purposes.
description: "A comprehensive description of your post here. It must be at least 20 characters long."

# Creation Date
createdAt: 2026-03-22

# Optional: Last Modified Date
lastModifiedAt: 2026-03-22

# Version of the post
version: "1.0.0"

# Author of the post
author: "Chanveasna ENG"

# Tags for categorization
tags: ["markdown", "template", "example"]

# Set to true to hide this post from production builds (Useful for WIP)
draft: true


# --- Images ---

# Cover Image: place your image in the same folder as this file (e.g. `cover.png`) and uncomment the line below.
coverImage: "./cover.jpg"
coverAlt: "Description of the cover image"


# --- The Discriminator ---

# Category must exactly be one of: 'blog', 'project', 'participation', 'learning', 'random'
category: "blog"


# --- Type-Specific Fields (Optional but Typed) ---

# For 'project' category
repoUrl: "https://github.com/Chanveasna-ENG/your-repo"
demoUrl: "https://your-demo-url.com"

# For 'participation' category
eventResult: "1st Place / Participant"
eventLocation: "Phnom Penh, Cambodia"
eventDate: 2026-03-22
---

## Introduction

Write your post content here! 

Because this file (`index.md`) is located inside its own folder (`src/content/blog/example-template/`), you can place your images and other assets directly into this same folder.

When you add an image like `cover.png` inside this folder, you can simply reference it in the frontmatter above (e.g., `coverImage: "./cover.png"`) and inside your content below.

## Content Examples

You can use regular markdown here, or MDX if you name the file `index.mdx`. 

```javascript
// Example Code Block
const greeting = "Hello, world!";
console.log(greeting);
```
