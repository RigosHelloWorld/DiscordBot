import * as dotenv from 'dotenv';
dotenv.config();

export const DISCORD_APPLICATION_ID = process.env.APPLICATION_ID!;
export const DISCORD_BOT_NAME = process.env.BOT_NAME!;
export const DISCORD_BOT_TOKEN_ID = process.env.BOT_TOKEN_ID!;
export const DISCORD_PUBLIC_KEY = process.env.PUBLIC_KEY!;
export const LAMBDA_ROUTER_ACCESS_ROLE_NAME = 'DiscordLambdaRouterRole';
