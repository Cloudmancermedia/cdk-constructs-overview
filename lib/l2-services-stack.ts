// lib/l2-services-stack.ts
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import {
  RestApi,
  Cors,
  LambdaIntegration,
} from 'aws-cdk-lib/aws-apigateway';

export class L2ServicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new Function(this, 'HelloFn', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.handler',
      code: Code.fromAsset('lambda'),
      environment: { STAGE: this.stackName },
    });

    const api = new RestApi(this, 'HelloApi', {
      deployOptions: { stageName: 'prod' },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET'],
      },
    });

    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new LambdaIntegration(fn, { proxy: true }));

    new CfnOutput(this, 'L2Url', { value: api.urlForPath('/hello') });
  }
}
