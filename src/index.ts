import { CommandUtil } from "./commands/CommandUtil";
import { EventUtil } from "./events/EventUtil";
import { RecurrenceRule } from "node-schedule";
import { Leaderboard } from "./helper/Leaderboard";
import { StaticClient } from "./Client";
import { Logger } from "./Logger";
import { ScheduledJobCreator } from "./helper/ScheduledJobCreator";
import { GENERAL_CHANNEL_ID, OWNER_ID } from "./consts";
import { ChannelType } from "discord.js";


// Define loggers used in index
const startupLog = new Logger("index/startup");
const scheduledLog = new Logger("index/scheduled");
const interactionLog = new Logger("index/interaction");
const reactionLog = new Logger("index/reaction");
const messageLog = new Logger("index/message");
const shutdownLog = new Logger("index/shutdown");

export async function startup() {
	var fs = require('fs');

	if (!fs.existsSync('assets')) {
		fs.mkdirSync('assets');
	}
	require('dotenv').config();
	const token = process?.env?.TOKEN;
	if (!token) {
		startupLog.error("Token not present at startup");
		throw new Error("Token not present at startup");
	}

	Leaderboard.load();

	async function sendGeneralMessage(msg: string) {
		try {
			const channel = StaticClient.client.channels.cache.get(GENERAL_CHANNEL_ID);
			if (channel?.type == ChannelType.GuildText) {
				return await channel.send(msg)
			}
			throw new Error("Was not able to find channel to send message")
		} catch (e) {
			messageLog.error("Failed to send a message", e)
		}
	}

	StaticClient.client.on('ready', () => {
		startupLog.info(`Logged in as ${StaticClient.client?.user?.tag}!`);

	});

	await StaticClient.client.login(token);

	// message at 4:20 am
	const rule = new RecurrenceRule();
	rule.hour = 4;
	rule.minute = 20;
	ScheduledJobCreator.scheduleJob("blaze", rule, async () => {
		scheduledLog.info("4:20 am scheduled blaze-it called");
		Leaderboard.hasReacted = false;
		const message = await sendGeneralMessage("Blaze it");
		await message?.react("🔥");
	});

	// message at 4:20 pm
	const rule2 = new RecurrenceRule();
	rule2.hour = 16;
	rule2.minute = 20;
	ScheduledJobCreator.scheduleJob("blaze2", rule2, async () => {
		scheduledLog.info("4:20 pm scheduled blaze-it called");
		Leaderboard.hasReacted = false;
		const message = await sendGeneralMessage("Blaze it");
		await message?.react("🔥");
	});

	const rule3 = new RecurrenceRule();
	rule3.hour = 0;
	rule3.minute = 0;
	ScheduledJobCreator.scheduleJob("leaderboard", rule3, async () => {
		scheduledLog.info("Checking if it is a new month");
		if (Leaderboard.isNewMonth()) {
			try {
				const winner = Leaderboard.getFirst();
				if (winner) {
					await sendGeneralMessage(`Congratulations to ${winner?.name} they won the blaze-it race this month with a final score of ${winner?.score}`);
					await sendGeneralMessage(Leaderboard.stringify());
				}
			}
			catch (e) {
				scheduledLog.error("Experienced an error reporting leaderboard winner, will still reset leaderboard: ", e);
			}
			finally {
				Leaderboard.resetLeaderBoard();
			}
		}
	});

	StaticClient.client.on("interactionCreate", async (interaction) => {
		interactionLog.info("Handling and interaction");
		if (interaction.isChatInputCommand())
			if (interaction.commandName === "say") {
				let reply = interaction.options.getString("content");
				if (reply)
					await interaction.reply(reply);
			}
	});

	StaticClient.client.on("messageReactionAdd", async (reaction, user) => {
		reactionLog.info("Handling a reaction");
		if (
			reaction.message.author?.id === StaticClient.client.user?.id && // Message being reacted to is shit-chan's
			reaction.message.content === "Blaze it" && // Message text it Blaze it
			reaction.emoji.name === "🔥" && // Emoji is 🔥
			!user.bot // User is not a bot
		) {
			const timeDiff = process.hrtime.bigint() - Leaderboard.lastReactTimeStamp.timestamp
			if (!Leaderboard.hasReacted) {
				if (user.username) {
					Leaderboard.givePoint(user.username);
					Leaderboard.lastReactTimeStamp = { user, timestamp: process.hrtime.bigint() }
					Leaderboard.postMessageCB = setTimeout(async () => {
						await sendGeneralMessage(`${user.username} got the point`)
					}, 1100)
				}
			} else if (timeDiff < 1e9) {
				clearTimeout(Leaderboard.postMessageCB)
				const timeStr = timeDiff < 1e6 ? `${(timeDiff / BigInt(1e3)).toString()}µs` : `${(timeDiff / BigInt(1e6)).toString()}ms`
				await sendGeneralMessage(`${user.username} lost to ${Leaderboard.lastReactTimeStamp.user?.username} by ${timeStr}`)
			}

		}
	});

	StaticClient.client.on("messageCreate", async (message) => {
		messageLog.info(`Handling message: ${message?.author?.tag}: "${message?.content}"`);
		// Special shutdown handling to allow cancellation of jobs
		if (message.content === "uwu shutdown" && message.author.id === OWNER_ID) {
			messageLog.info("Received shutdown command");
			await gracefulShutdown();
			return;
		}
		// Only trigger if the message sender is not shit-chan
		if (message.author.id != StaticClient.client?.user?.id) {
			messageLog.info(`${message?.author?.tag}: "${message?.content}"`);

			// Maybe bad practice to swallow all errors that bubble up this far instead of fixing them? Probably shoould only have try catch at a lower level. If we 
			// made it this far without catching them thats probably a pretty bad sign
			// Process events
			try {
				await EventUtil.triggerAllMatchingEvents(message);
			} catch (e) {
				messageLog.error("Error leaked from event, this should've probably been handled earlier: ", e);
			}

			// Process commands
			try {
				await CommandUtil.callCommandIfCommand(message);
			} catch (e) {
				messageLog.error("Error leaked from command, this should've probably been handled earlier: ", e);
			}
		}
	});

	process.on('SIGTERM', async () => {
		shutdownLog.info("Handling a sigterm, will perform a graceful shutdown");
		await gracefulShutdown();
	});
}

async function gracefulShutdown() {
	shutdownLog.info("Performing a graceful shutdown");
	ScheduledJobCreator.cancelJobs();
	await StaticClient.client.destroy();
	process.exit(0);
}