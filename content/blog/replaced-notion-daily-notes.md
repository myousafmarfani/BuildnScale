---
title: "I replaced Notion with local-first Markdown notes"
category: "Tools"
date: "2026-05-14"
readTime: 8
excerpt: "After three years of daily Notion use, I switched to local Markdown files synced via Git. Here's what I gained and what I lost."
---

For three years, I was a power Notion user. Databases, templates, linked pages—the works. But something kept nagging at me: **latency.** Every action took 400ms to render. Every search required a round trip to the cloud. And when I needed to jot down a quick thought while my train went through a tunnel, Notion was useless.

## The breaking point

Last December, I was in the middle of debugging a production incident. I opened Notion to check my runbook and got a spinning skeleton loader for eight seconds. By the time the page loaded, I had already fixed the issue from memory. That's when I realized: my "productivity system" was adding friction, not removing it.

I decided to move everything to local Markdown files. No cloud dependency. No loading spinners. Just `Cmd+N`, type, `Cmd+S`.

## The migration

Moving from Notion to Markdown wasn't a direct export. I had to rethink my entire note-taking taxonomy:

- **Databases became folders.** Each Notion database got a directory. Items became files.
- **Linked pages became relative paths.** `[Reference](./project/design-doc.md)` replaces cryptic UUID links.
- **Templates became snippets.** I use VS Code snippets instead of Notion's template buttons.

The migration took about six hours spread over a weekend. I wrote a quick Python script to export Notion pages to Markdown (Notion's native export is surprisingly good). Then I manually reorganized the output folder by folder.

## What I gained

The switch wasn't just about speed. Local Markdown files unlocked capabilities I didn't have with Notion:

- **Full-text search via ripgrep** is faster than any SaaS search I've used. Results in under 100ms even across thousands of files.
- **Version history via Git** gives me diffs. I can see exactly what I changed in a note three weeks ago.
- **Offline-first by default.** No internet? No problem. My notes are always available.
- **Future-proof format.** Markdown isn't going anywhere. My notes won't be trapped in a proprietary database.

> "The best notes are the ones you can actually access. 100% uptime requires 0% cloud dependency."

## What I lost

To be fair, there are things I miss about Notion:

- **Inline databases** were genuinely useful for tracking projects with multiple status fields.
- **Collaboration** is harder with Git than with Notion's share button. My partner still uses Notion for shared grocery lists.
- **Mobile editing** isn't as polished. Working Copy on iOS works, but it's not Notion-smooth.

## My setup now

If you're considering the switch, here's the stack I landed on:

1. **Obsidian** for daily note-taking and graph view (I don't use the sync service)
2. **VS Code** for writing and editing Markdown files with formatting
3. **iA Writer** for distraction-free writing of longer posts
4. **Git + GitHub** for backup and version history across machines
5. **buildnscale Markdown Notes** for quick capture during work hours

```bash
# Quick grep across all notes
rg -l "incident-response" ~/notes/
```

The setup isn't as visually polished as Notion, but it's dramatically faster. And after three months, I can confidently say: I'm never going back.
