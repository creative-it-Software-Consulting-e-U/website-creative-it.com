---
title: "Agentic Coding: Your Code Is Getting Worse Because…"
brief: "…you're NOT using it. People ask me a lot if code quality has declined since I switched fully to agentic coding. Spoiler: it's the opposite. Let me tell you why."
publishedAt: 2026-02-14
coverImage: "https://raw.githubusercontent.com/creative-it-Software-Consulting-e-U/public-content-assets/main/assets/blog/2026-02-14-refactoring/refactoring-wtf.jpg"
readTimeInMinutes: 3
tags:
  - AI
  - Productivity
  - refactoring
  - software development
ctaHeadline: "Want to Cure Your Refactophobia?"
service: "agentic-ai"
---

…you're NOT using it.

People ask me a lot if code quality has declined since I switched fully to agentic coding. Spoiler: it's the opposite. Let me tell you why.

## 35 Years of Watching Code Rot

Over the past 35 years of my coding life (I'm not joking — I am THAT old, and no, I didn't start at 5 years of age), I've seen many, many projects decline in code quality. Some started bad already. Some became too complex. Others were just badly maintained.

Most of them suffered from what I call **"refactophobia"** — they were just too scared to refactor all the bad stuff out, the kind that naturally accumulates in long-living or large-codebase projects.

![Strong correlation between organisational stupidness and bad code](https://raw.githubusercontent.com/creative-it-Software-Consulting-e-U/public-content-assets/main/assets/blog/2026-02-14-refactoring/refactoring-diagram.jpg)

*Strong correlation between organisational stupidness and bad code*

And to a certain extent, it was a good decision. The costs for refactoring are high, and the benefit for the customer or stakeholder is usually not measurable. "We spent 3 weeks making the code cleaner" doesn't exactly thrill a product owner.

So the debt piles up. And up. And up.

## Enter Agentic Coding

Now introduce agentic coding, where it costs you **almost nothing** to refactor the *beep* out of your project.

(Okay, "nothing" is not entirely correct — you pay the $20–35 in API costs for your model. But compare that to weeks of developer time.)

## The 80-Hour Refactoring

Before Christmas, I did a very large refactoring "manually" — no agentic coding in my life at that point (so sad). I touched over **1,300 files**, each of them in more than one location. It was a repetitive, exhausting task. Dumb work, really. Apply the same pattern over and over again, and hope to not make a mistake when copy-pasting like crazy, or using RegExp — you know, the syntax you can't remember when you come back from a quick detour to the bathroom.

It took me **over 80 hours**. You can guess the costs.

## The 20-Minute Experiment

I thought it might be a fun exercise to pull the version of the code from *before* I started the refactoring, and let Claude Code do it.

**It took 20 minutes and about $35** with Opus 4.6 using AWS Bedrock.

Twenty. Minutes.

And here's the kicker: it found and fixed **four severe errors** and **12 minor ones** in the code it touched. Without being asked. It just… noticed them while refactoring.

Let that sink in. The agent did in 20 minutes what took me 80+ hours, at a fraction of the cost, *and* it caught bugs I'd missed entirely.

## So, Is Your Code Getting Worse?

**Yes — if you're not using agentic coding RIGHT NOW.**

The economics of refactoring have fundamentally changed. All those decisions to "not refactor because it's too expensive"? That calculation is now wrong. The technical debt that everyone agreed was "too risky to touch"? An agent can clean it up for the price of a nice lunch.

Almost all of that technical debt — the kind that slowly makes your codebase harder to work with, that makes onboarding new developers painful, that adds friction to every single feature — can be fixed with an unbelievably small amount of money.

## The Real Shift

This isn't about AI replacing developers. It's about removing the economic barrier that kept us from writing better code.

We always *knew* the code should be cleaner. We always *wanted* to refactor that module everyone's afraid to touch. We just couldn't justify the cost.

Now we can. And if you're still carrying that technical debt because "refactoring is too expensive" — you're making a decision based on outdated math.

**Your code isn't getting worse because of AI. It's getting worse because you're not letting AI fix it.**

---

*Have you tried agentic refactoring on legacy code? I'd love to hear your experience — what worked, what didn't, and how it compared to doing it manually. Drop a comment below or find me on [X](https://x.com/guentherwieser) and [LinkedIn](https://www.linkedin.com/in/guentherwieser/).*
