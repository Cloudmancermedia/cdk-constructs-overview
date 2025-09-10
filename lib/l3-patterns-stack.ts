import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class L3PatternsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new Function(this, 'HelloFn', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.handler',
      code: Code.fromAsset('lambda'),
    });

    const api = new LambdaRestApi(this, 'HelloApi', {
      handler: fn,
      proxy: false,
    });

    const hello = api.root.addResource('hello');
    hello.addMethod('GET');

    new CfnOutput(this, 'L3Url', { value: api.urlForPath('/hello') });
  }
}
