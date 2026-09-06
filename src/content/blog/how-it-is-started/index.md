---
title: "My First Blog: How everything started"
description: "How I converted an old laptop into a production home server behind CGNAT using Cloudflare Tunnels, Docker, and Linux."
createdAt: 2026-03-28
lastModifiedAt: 2026-03-28
version: 1.0.0
author: Chanveasna ENG
tags:
  - HomeLab
  - Server
  - Linux
  - Blog
  - Networking
  - Cloudflare
draft: false
coverImage: ./cover.jpg
coverAlt: My Old Laptop Internal Hardware
category: project
repoUrl: https://github.com/Chanveasna-ENG/veasna-blog
demoUrl: https://www.veasnaec.com
---

## The Past

I had long wanted to convert an older laptop into a dedicated Linux home server to host personal tools and internal services. However, I ran into a persistent obstacle: my home internet connection is behind Carrier-Grade NAT (CGNAT). Because my ISP shares public IP addresses across multiple subscribers, traditional router port forwarding was impossible, preventing incoming traffic from reaching the machine.

As a result, the laptop sat idle on a shelf for months. The only way to access it remotely was through a private mesh VPN like Tailscale.

## Finding the Missing Piece

A few months later, I revisited self-hosting while experimenting with AWS EC2, Google Cloud Compute Engine, and Oracle Cloud Always Free tiers. Running minimal cloud VMs worked well, but I wanted to keep sensitive workloads and persistent containers on local hardware without recurring cloud costs.

While configuring reverse proxies and domain routing, I evaluated edge security options:

Me: "What should I use? Nginx or Caddy for reverse proxy and protect my resource and ssl certificate? How about Cloudflare? I have seen people using it for DDoS protection, bot protection... How to use it?"

AI: "... Cloudflare Tunnel Zero Trust Dashboard ..."

Me: "What is Cloudflare tunnel? How is it different from traditional reverse proxy like Nginx?"

...

Me: "Wait what? It creates an outbound connection? That means I can host services from my laptop anywhere in the world without an open port or public IP?"

It clicked immediately: an outbound tunnel bypassed CGNAT entirely. No port forwarding, no static public IP, and no risk of exposing router ports to the open internet. The next thing I did was decommission the cloud VM and move the workloads on-premise to the laptop. 

As of now, I have a few services running inside my old laptop, such as:
- N8N
- Jenkins
- This Blog Website
- Stirling PDF
- Pi Hole
- PostgreSQL
- Cloudflare
- My custom backend server
- Kokoro-TTS

That’s how the old laptop finally came off the shelf. In my next post, I’ll dive into the 'nitty-gritty'—how I’m managing heat issues on consumer hardware and the specific Docker setup keeping these services alive.