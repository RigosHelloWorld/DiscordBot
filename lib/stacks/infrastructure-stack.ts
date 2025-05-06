import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_ssm as ssm, aws_iam as iam } from 'aws-cdk-lib';

export interface InfrastructureStackProps extends cdk.StackProps {
  discordApplicationId: string;
  discordBotName: string;
  discordBotTokenId: string;
  discordPublicKey: string;
  discordLambdaRouterAccessRoleName: string;
}

export class InfrastructureStack extends cdk.Stack {
  private readonly props: InfrastructureStackProps;

  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);
    this.props = props;

    this.createDiscordSSMParameters();
    this.createLambdaRouterAccessRole();
  }

  private createDiscordSSMParameters() {
    new ssm.StringParameter(this, 'DiscordSSMApplicationId', {
      stringValue: this.props.discordApplicationId,
      parameterName: `/Discord/${this.props.discordBotName}/ApplicationId`,
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, 'DiscordSSMBotName', {
      stringValue: this.props.discordBotName,
      parameterName: `/Discord/${this.props.discordBotName}`,
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, 'DiscordSSMBotTokenId', {
      stringValue: this.props.discordBotTokenId,
      parameterName: `/Discord/${this.props.discordBotName}/TokenId`,
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, 'DiscordSSMPublicKey', {
      stringValue: this.props.discordPublicKey,
      parameterName: `/Discord/${this.props.discordBotName}/PublicKey`,
      tier: ssm.ParameterTier.STANDARD,
    });
  }

  private createLambdaRouterAccessRole() {
    new iam.Role(this, 'LambdaRouterAccessRole', {
      roleName: this.props.discordLambdaRouterAccessRoleName,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Iam Role for Discord router lambdas',
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
      inlinePolicies: {
        AllowSSMRead: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['ssm:GetParameter'],
              resources: [`arn:${this.partition}:ssm:${this.region}:${this.account}:parameter/Discord/*`], //todo follow least privilege
            }),
          ],
        }),
      },
    });
  }
}
