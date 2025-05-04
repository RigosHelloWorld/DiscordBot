import * as dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/stacks/infrastructure-stack';

dotenv.config();

const app = new cdk.App();

new InfrastructureStack(app, 'DiscordInfraStack', {
  discordApplicationId: process.env.APPLICATION_ID!,
  discordBotName: process.env.BOT_NAME!,
});
