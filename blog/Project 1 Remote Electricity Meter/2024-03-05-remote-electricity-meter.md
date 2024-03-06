---
slug: first-project
title: Remote Electricity Meter
date: 2024-03-05T09:00:00.000Z
authors: samuli
tags: [LDR, CanSat NeXT]
---

In this first project, I'll be using CanSat NeXT board to add a real-time remote reading feature to the the electricity meter in my house. Most modern electricity meters have a pulse LED, which blinks once per measured watt-hour of electricity. My idea is to use the light-dependant resistor (LDR) on the CanSat NeXT board to monitor this LED, and use that to calculate the real time power consumption of my home.