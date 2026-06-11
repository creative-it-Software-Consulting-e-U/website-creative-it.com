---
title: "Empowering Users with a Smart In-App Assistant: A Journey with Claude Code"
brief: "Today, I worked on GeoHook, and what I achieved within an hour of coding using Claude Code is truly impressive. The first feature was adding BLE-support for triggering webhooks - what that means is that a specific BLE devices has to be near the phone when the trigger fires, or the webhook won't be called."
publishedAt: 2026-01-30
coverImage: "/blog-covers/empowering-users-with-a-smart-in-app-assistant-a-j.jpg"
readTimeInMinutes: 4
tags:
  - ClaudeCode
  - AWS Bedrock
  - claude-code
  - AI assistant
ctaHeadline: "Want a Smart Assistant for Your App?"
service: "agentic-ai"
---

Today, I worked on [GeoHook](https://apps.creative-it.com), and what I achieved within an hour of coding using Claude Code is truly impressive.

The first feature was adding BLE-support for triggering webhooks - what that means is that a specific BLE devices has to be near the phone when the trigger fires, or the webhook won't be called. This is useful in scenarios like opening your garage door when you arrive at home, but only if you drive with your car and not when walking the dog or riding the bike.

As a lot of cars do not yet have BLE devices installed (it's mostly those cars who support your phone as a key, like Teslas, but there are many others nowadays, too). You can simply drop a cheap BLE beacon, often advertised as "key finder", in the car instead. And nope, you can't use Apple AirTags, because they are so safe (and I do mean this) that they rotate the UUID of the BLE part of the AirTag which basically makes it a new BLE beacon every other day. And you cannot access the API in iOS which would handle AirTags correctly (for security reasons - it would make this rotation useless to avoid tracking an AirTag from outside).

So how do you communicate such a complex situation to your maybe-not-so-technical audience? You would need to write a lot of clear and precise documentation, in all supported languages. And you need to keep this documentation up to date!

So I thought, well, let's give LLM-based chatbots a chance! I planned this feature with Claude Code, and as I was already using AWS Bedrock for a customer with high data protection needs, it was obvious to use this as it provides to many different models.

Claude Code created everything:

* the backend which is a Lambda function injecting the general prompt and the specific question/prompt from the user's chat, including an HTTP API Gateway and all the IAM policies

* the CDK setup to deploy this into all environments

* the general prompt which describes the purpose of the agent, what to do and what not to do, and what GeoHook does, how it works, etc. - it generated that by itself from the logic in the code and the claude.md files!

* the AI chatbot user interface

So how large is the general prompt, which gives the agent the context? It's about 250 lines of markdown (so a lot of empty lines), less than 10k of text, containing human readable instructions and knowledge! That's all it takes!

![Excerpt from the general prompt used to tell the agent how to interact and what to provide.](https://cdn.hashnode.com/res/hashnode/image/upload/v1769747706283/9d6d4924-39f3-4f07-9857-027c908da1ef.png)

And the best thing is: this agent handles not only your app's specific logic, it does so in the context of the data that is stored in the LLM! For example, if you type in your car model and ask if this can be used with the app, the model has this knowledge already built-in and can answer it, even though your specific car model has never been mentioned in the general prompt that creates the context!

It's fantastic: the user gets a really helpful AI agent specific to the application, but in the context of the world surrounding it. It can help with connections problems, not only from the app perspective, but general iOS solutions, and problems specific to the type of BLE device (OBD-II adapter, BLE beacon, actual car key module, etc.).

If specific topics pop up, simply add a FAQ-style section in to the general prompt, deploy it to the backend, and all users benefit from the new knowledge.

If a new feature is added, let Claude Code add it to the general prompt, or add it by yourself.

The costs? For 1,000 chat messages from users (of course including the response), we estimate about $1, or about $0.001 per interaction with a user.

Ah, and by the way, the model we use is Anthropic Claude Haiku 3.0 - this is a very sophisticated model for a chatbot already.

Did I mention that this setup is 100% GDPR compliant? All data is transiational data, no chat history is stored, no data is used for training, no data leaves the EU. Thanks, AWS Bedrock!

In conclusion, the integration of a smart in-app assistant using Claude Code has significantly enhanced the user experience for GeoHook. By leveraging advanced AI models like Anthropic Claude Haiku 3.0, users benefit from a highly contextual and responsive chatbot that not only understands the app's specific functionalities but also provides solutions within the broader context of the user's environment. This setup is not only cost-effective, with minimal expenses per interaction, but also ensures compliance with GDPR, safeguarding user data. The ability to easily update the assistant with new features or FAQs ensures that it remains a dynamic and valuable tool for users, empowering them with timely and relevant assistance.
