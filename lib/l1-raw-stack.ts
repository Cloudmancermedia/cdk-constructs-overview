import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnRole } from 'aws-cdk-lib/aws-iam';
import { CfnFunction, CfnPermission, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import {
  CfnRestApi,
  CfnResource,
  CfnMethod,
  CfnDeployment,
  CfnStage,
} from 'aws-cdk-lib/aws-apigateway';

export class L1RawStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const codeAsset = new Asset(this, 'HelloAsset', {
      path: 'lambda',
    });

    const role = new CfnRole(this, 'HelloRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { Service: 'lambda.amazonaws.com' },
            Action: 'sts:AssumeRole',
          },
        ],
      },
      policies: [
        {
          policyName: 'basic-exec',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                ],
                Resource: '*',
              },
            ],
          },
        },
      ],
    });

    const fn = new CfnFunction(this, 'HelloFn', {
      runtime: Runtime.NODEJS_18_X.name,
      handler: 'hello.handler',
      role: role.attrArn,
      code: {
        s3Bucket: codeAsset.s3BucketName,
        s3Key: codeAsset.s3ObjectKey,
      },
      environment: {
        variables: { STAGE: this.stackName },
      },
    });

    const restApi = new CfnRestApi(this, 'HelloApi', {
      name: 'HelloRawApi',
    });

    const rootResourceId = restApi.attrRootResourceId;

    const helloRes = new CfnResource(this, 'HelloResource', {
      parentId: rootResourceId,
      pathPart: 'hello',
      restApiId: restApi.ref,
    });

    const getMethod = new CfnMethod(this, 'HelloGet', {
      httpMethod: 'GET',
      resourceId: helloRes.ref,
      restApiId: restApi.ref,
      authorizationType: 'NONE',
      integration: {
        type: 'AWS_PROXY',
        integrationHttpMethod: 'POST',
        uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${fn.attrArn}/invocations`,
      },
    });

    new CfnPermission(this, 'InvokePermission', {
      action: 'lambda:InvokeFunction',
      functionName: fn.ref,
      principal: 'apigateway.amazonaws.com',
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${restApi.ref}/*/GET/hello`,
    });

    const deployment = new CfnDeployment(this, 'Deployment', {
      restApiId: restApi.ref,
    });
    deployment.addDependency(getMethod);

    const stage = new CfnStage(this, 'ProdStage', {
      restApiId: restApi.ref,
      stageName: 'prod',
      deploymentId: deployment.ref,
    });

    new CfnOutput(this, 'L1Url', {
      value: `https://${restApi.ref}.execute-api.${this.region}.amazonaws.com/${stage.stageName}/hello`,
    });
  }
}
