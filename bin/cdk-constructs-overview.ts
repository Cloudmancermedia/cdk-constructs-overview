#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { L1RawStack } from '../lib/l1-raw-stack';
import { L2ServicesStack } from '../lib/l2-services-stack';
import { L3PatternsStack } from '../lib/l3-patterns-stack';

const app = new App();

// Comment/uncomment as you present:
new L3PatternsStack(app, 'L3PatternsStack');
new L2ServicesStack(app, 'L2ServicesStack');
new L1RawStack(app, 'L1RawStack');
