---
title: "My First Blog: How everything started"
description: I will talk about why I'm creating this server, how it is all started and what I have on my HomeLab.
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

I have always wanted to convert an old laptop to a personal linux server that I can host variety of services for myself, friends and family. However, I have one issue that I only know how to solve it recently. That one issue was my home internet is hidden behind CGNAT (Carrier Grade Network Address Translation), this means that I don't have my own Public IP Address. So, I cannot do Port Forwarding and cannot accept any incoming network traffic which means I cannot make the service available on the internet. 

So, the old laptop has been sitting on the shelf for years. I don't know what to do with it. The only way I can access it from outside is to connect it via Tailscale (Private Mesh VPN Service). 

## Recently

A few months ago, the dream of having my own server started again when I was playing around with AWS EC2, Google Cloud Compute Engine and Oracle Cloud. When I learned that Google Cloud and Oracle Cloud has a forever free tier, I want to try it. I did try Google Cloud for a few weeks, and it works really well on a free server, it has 1 GB ram and 2 processors. 

The magic started when I tried to connect the google cloud IP Address to my domain name. When setting up the domain, port forwarding, and reverse proxies. I was asking AI about:

Me: "What should I use? Nginx or Caddy for reverse proxy and protect my resource and ssl certificate? How about Cloudflare? I have seen people using it for DDoS protection, bot protection... How to use it?"

AI: "... Cloudlare Tunnel Zero Trust Dashboard ..."

Me: "What is Cloudflare tunnel? How is it different from traditional reverse proxy like Nginx?"

...

Me: "Wait what? It creates outbound connection? That's mean I host anything from my laptop anywhere in the world as long as I have internet connection my services are all online? Wtf OMG"

My mind was blown at that moment. To think that something like that exist is incredible. The next thing I did after learning about it is to check cloudflare website and "destroy" google cloud instance. 

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