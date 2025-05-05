import * as cdk from 'aws-cdk-lib';
import { aws_iam as iam, aws_lambda as lambda, aws_apigateway as api_gateway, aws_ssm as ssm } from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';

export interface BotApiStackProps extends cdk.StackProps {
  discordApplicationId: string;
  discordBotName: string;
  discordLambdaRouterAccessRoleName: string;
}

export class BotApiStack extends cdk.Stack {
  private readonly props: BotApiStackProps;

  constructor(scope: Construct, id: string, props: BotApiStackProps) {
    super(scope, id);
    this.props = props;

    //todo add throttling and rate limits
    const api = new api_gateway.LambdaRestApi(this, 'DiscordBotApiGateway', {
      handler: this.getLambdaRouter(),
      proxy: false,
      description: 'API Gateway endpoint to receive Discord interaction events and route them to the bot Lambda.',
    });

    const interactions = api.root.addResource('interactions');
    interactions.addMethod('POST');

    new ssm.StringParameter(this, 'DiscordSSMApiUrlParam', {
      stringValue: `${api.url}interactions`,
      parameterName: `/Discord/${props.discordBotName}/ApiUrl`,
      tier: ssm.ParameterTier.STANDARD,
    });
  }

  private getLambdaRouter() {
    return new lambda.Function(this, 'DiscordRouterLambda', {
      runtime: lambda.Runtime.PYTHON_3_10,
      architecture: lambda.Architecture.X86_64,
      handler: 'handlers/router.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/')),
      role: this.getLambdaRouterRole(),
      environment: {
        DISCORD_SSM_PUBLIC_KEY: `/Discord/${this.props.discordBotName}/PublicKey`,
      },
    });
  }

  private getLambdaRouterRole() {
    return iam.Role.fromRoleName(this, 'LambdaRouterRole', this.props.discordLambdaRouterAccessRoleName, {
      mutable: false,
    });
  }
}
