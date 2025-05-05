import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/stacks/infrastructure-stack';

import {
  DISCORD_APPLICATION_ID,
  DISCORD_BOT_NAME,
  DISCORD_BOT_TOKEN_ID,
  DISCORD_PUBLIC_KEY,
  LAMBDA_ROUTER_ACCESS_ROLE_NAME,
} from './constants/constants';
import { BotApiStack } from './stacks/bot-api-stack';

const app = new cdk.App();

const infrastructureStack = new InfrastructureStack(app, 'DiscordInfraStack', {
  discordApplicationId: DISCORD_APPLICATION_ID,
  discordBotName: DISCORD_BOT_NAME,
  discordPublicKey: DISCORD_PUBLIC_KEY,
  discordBotTokenId: DISCORD_BOT_TOKEN_ID,
  discordLambdaRouterAccessRoleName: LAMBDA_ROUTER_ACCESS_ROLE_NAME,
});

const botApiStack = new BotApiStack(app, 'DiscordBotApiStack', {
  discordApplicationId: DISCORD_APPLICATION_ID,
  discordBotName: DISCORD_BOT_NAME,
  discordLambdaRouterAccessRoleName: LAMBDA_ROUTER_ACCESS_ROLE_NAME,
});

botApiStack.addDependency(infrastructureStack);
