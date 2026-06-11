---
title: "The Rise of Agentic Coding: Moving Beyond Electron and React Native"
brief: "I remember, about 10 years ago, we wrote our first \"mobile\" application, we bundled our web application into an iOS and Android wrapper and were proud like gods! It was actually a nightmare as we were using BLE and other native functionality, but it was still better than writing our own native implementation of the web-based UI."
publishedAt: 2026-01-27
coverImage: "/blog-covers/the-rise-of-agentic-coding-moving-beyond-electron-.jpg"
readTimeInMinutes: 3
tags:
  - claude-code
  - agentic-coding
ctaHeadline: "Ready to Go Native — Without the Pain?"
service: "agentic-ai"
---

I remember, about 10 years ago, we wrote our first "mobile" application, we bundled our web application into an iOS and Android wrapper and were proud like gods! It was actually a nightmare as we were using BLE and other native functionality, but it was still better than writing our own native implementation of the web-based UI.

A few weeks ago I had similar requirements: for one of our customers, we have built a quite complex IoT platform, with a complex UI. It was never meant to go mobile. But now we have the requirement for manual input for power meters which do not have any kind of network access. So they need an app for their work phones where they can enter the values from the power meters. Small QR codes will be put on the power meters to tell the device which power meter this is, and then they will enter the value they read.

I never found this solution appealing, and it was not our task to implement this app (as the UI is actually provided by someone else). But over Christmas, I fully emerged into #AgenticCoding…

So, I vibe-coded like crazy, and much sooner than I thought I had an iOS version up and running: QR-Code Scanning, Value-Scanning (from all kinds of displays like 7-digit-LCDs to Multi-Pixel-LCDs and classic rotating counters, etc.), an integrated web view of our existing web-based UI, with token/cookie injection of the existing authentication from within the iOS app, FaceId/biometric authentication, and lots of other features. Wow! I couldn't believe what I saw, it was just working, and when it failed, it was so easy to fix the problems with the help of #ClaudeCode. I didn't write a single line of code! It also changed the web-based UI to make the cookie injection work, and fixed some bugs in state management at the same time.

But that was just the first part of this journey. I knew we need an Android app, too. So the iOS App became one piece of a monorepo, and the second piece was the Android app. The claude.md file (bascially a human readable, and thus, LLM-readable document which describes the purpose and key findings of an a project for Claude Code) contained the information that both iOS and Android app have to have feature-parity at all times. As the iOS app was already in a fine state, Claude Code had to make a plan how to build the Android app - and it did it! It was just the core of the application, with the main functionality, but it was working! A few iterations later, the Android app was on the same feature level.

From this point onwards, whenever I requested a feature, it was always implemented by Claude Code in BOTH platforms. With native code!

Why would I ever go back to those clunky frameworks to build multi-platform applications?

Ah, by the way, the last feature I implemented, which was adding our new, web-based Operations UI into the native applications? **I "implemented" it while I was walking our dog**: I prompted it into Claude's iOS app which also has Claude Code in it, and runs Claude Code in their servers, connected to my repos. At the time I came home from the walk, the application had this new feature, in both Android and iOS applications.

This is so crazy, I might soon wake up from this wonderful dream!
