---
layout: default
parent: Developers
title: Development Tasks
nav_order: 3
---
# Development Tasks
_Only applicable if experimenting with building cool stuff using the Fismo SDK. If you want to directly work on, test, or audit the Fismo protocol, you should visit the [Fismo Repo](https://github.com/cliffhall/Fismo)._

## NPM Scripts
Everything required to build, test, analyse, and deploy is available as an NPM script.
* Scripts are defined in [`package.json`](https://github.com/cliffhall/Fismo/blob/main/package.json#L31).
* Most late-model IDEs such as Webstorm have an NPM tab to let you view and launch these
tasks with a double-click.
* If you don't have an NPM launch window, you can run them from the command line.

### Build Contracts
This script creates the build artifacts for everything in the contracts folder. To create your own experiment, just add a new folder under `contracts/lab` with your guard and any other necessary smart contract code.

* ```npm run build:contracts```

### Clone Fismo
Deployment is expensive, cloning is cheap.

The script `scripts/deploy/clone-fismo.js` creates a clone of the official Fismo deployment (found in the SDK) for the specified network.

#### Polygon Mumbai Testnet
* ```npm run clone:fismo:poly:test```

#### Polygon Matic Mainnet
* ```npm run clone:fismo:poly:main```

#### Ethereum Rinkeby Testnet
* ```npm run clone:fismo:eth:test```

#### Ethereum Ropsten Testnet
* ```npm run clone:fismo:eth:test-2```

#### Ethereum Homsstead Mainnet
* ```npm run clone:fismo:eth:main```

### Deploy Lab Experiments
Once you have a Fismo clone and have an experiment built, the script `scripts/deploy/deploy-experiments.js` can be used to deploy experiments on the specified network.

* You describe experiments in `scripts/lab/experiments.js` and edit the list at the top of the deploy script to include only those experiments you wish to deploy.

* You must have configured the address of your Fismo clone in your `environments.js` file under the `deployments` node for the given network.

* If you have also defined an operator contract address in your `environments.js` file, it will be used as the operator for the deployed experiments. 

* Otherwise, it will clone a the official Operator instance and use that address. The log output will have the address of your new Operator, which you should add to your `environments.js` file for reuse on future deployments.

* Study the LockedDoor experiment for how initialization of an installed machine is done, should you need it.

#### Polygon Mumbai Testnet
* ```npm run deploy:labs:poly:test```

#### Polygon Matic Mainnet

* ```npm run deploy:labs:poly:main```

#### Ethereum Rinkeby Testnet
* ```npm run deploy:labs:eth:test```

#### Ethereum Ropsten Testnet
* ```npm run deploy:labs:eth:test-2```

#### Ethereum Homsstead Mainnet
* ```npm run deploy:labs:eth:main```


