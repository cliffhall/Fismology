---
layout: default
title: Developers
nav_order: 7
has_children: true
has_toc: false
---
# Developers
#### Working in the Fismology Lab
> _Fismo is not your average protocol. It's straight-up weird. But so is protein folding, and that's why people show up to the lab every day to study it._

There is no specific set of steps for integrating Fismo into your project. It could be the core component around which the whole architecture hangs. Or it could just model a minor stateful mechanism in a much larger ecosystem of contracts. 

The Fismology Lab has been established as a place where we can explore the various possibilities, create some useful tools, and realize that potential together.

#### The General Approach
  * Clone the repo
  * Setup the environment
  * Clone Fismo on a supported chain
  * Conceive and configure a Fismo style state machine and experiment descriptor
  * Create a folder under `contracts/lab`
  * Add your contracts for guard, operator, or any other needed functionality
  * Deploy your experiment

The Fismology repo provides scripts for cloning Fismo and deploying experiments. 

It uses the SDK, which has the contract ABI, interfaces, self-validating domain entities, the offical deployments, and more more. All Javascript support for browsers and Node environments.

So put on your goggles, grab your lab coat, and clone or fork the [Fismology repo](https://github.com/cliffhall/Fismology), and get going:

* 📋 [`Environment Setup`](setup.md) - Setup your local development environment.
* 📋 [`Tasks`](tasks.md) - Common dev tasks implemented as NPM scripts.