---
layout: default
parent: Developers
title: Environment Setup
nav_order: 2
---
# Environment Setup
_Only applicable if experimenting with building cool stuff using the Fismo SDK. If you want to directly work on, test, or audit the Fismo protocol, you should visit the [Fismo Repo](https://github.com/cliffhall/Fismo)._

### Stack
For the Fismology project, the stack is a simple one:
* Solidity
* JavaScript
* Node/NPM
* HardHat
* Ethers

### Download or clone the Fismology repository
* [Download a zip file](https://github.com/cliffhall/Fismology/archive/refs/heads/main.zip) of the head of branch `main`.
* Or clone the repo using `git`:

```shell
git clone https://github.com/cliffhall/Fismology.git
```

### Install Node (also installs NPM)
* Use the latest [LTS (long term support) version](https://nodejs.org/en/download/).

### Install required Node modules
* All NPM modules are project local. No global installs required.

```shell
cd path/to/Fismology
npm install
```

### Configure Environment
- Copy [environments_template.js](../../environments_template.js) to `environments.js` and edit to suit.
- API keys are only needed for deploying to public networks.
- `environments.js` is included in `.gitignore` and will not be committed to the repo.
- For your target Ethereum network environment, set:
    * `txNode`: the endpoint for sending ethereum transactions
    * `mnemonic`: a valid ethereum HD wallet seed phrase (first wallet is used as deployer)
    * `deployments.Fismo`: your clone of the official Fismo deployment
    * `deployments.Operator`: your clone of the official Fismo deployment
- For verifying code and running the gas reporter, set:
    * `apiKey.block_explorer`: your etherscan/poloygonscan/etc API key