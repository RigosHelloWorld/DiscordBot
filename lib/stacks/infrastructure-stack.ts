import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
export interface InfrastructureStackProps extends cdk.StackProps {
  discordApplicationId: string;
  discordBotName: string;
}

export class InfrastructureStack extends cdk.Stack {
  private readonly props: InfrastructureStackProps;

  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);
    this.props = props;

    this.createDiscordSSMParameters();
  }

  private createDiscordSSMParameters() {
    new ssm.StringParameter(this, 'DiscordSSMApplicationId', {
      stringValue: this.props.discordApplicationId,
      parameterName: `/Discord/${this.props.discordBotName}/${this.props.discordApplicationId}`,
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, 'DiscordSSMBotName', {
      stringValue: this.props.discordBotName,
      parameterName: `/Discord/${this.props.discordBotName}`,
      tier: ssm.ParameterTier.STANDARD,
    });
  }
}
