import { CommandUtil } from "./commands/CommandUtil";
import { EventUtil } from "./events/EventUtil";
import { scheduleJob, RecurrenceRule } from "node-schedule";
import { Leaderboard } from "./helper/Leaderboard";
import { StaticClient } from "./Client";
import { Logger } from "./Logger";


// Define loggers used in index
const startupLog = new Logger("index/startup")
const blazeItLog = new Logger("index/blaze-it")
const interactionLog = new Logger("index/interaction")
const reactionLog = new Logger("index/reaction")
const messageLog = new Logger("index/message")


export async function startup() {
	require('dotenv').config()
	const token = process?.env?.TOKEN
	if (!token) {
		startupLog.error("Token not present at startup")
		throw new Error("Token not present at startup")
	}

	Leaderboard.load();

	StaticClient.client.on('ready', () => {
		startupLog.info(`Logged in as ${StaticClient.client?.user?.tag}!`);

	});

	await StaticClient.client.login(token);

	// message at 4:20 am
	const rule = new RecurrenceRule();
	rule.hour = 4;
	rule.minute = 20;
	const job = scheduleJob("blaze", rule, async () => {
		blazeItLog.info("4:20 am scheduled blaze-it called")
		const channel = StaticClient.client.channels.cache.get("236745934128676865");
		if (channel?.isTextBased()) {
			Leaderboard.hasReacted = false;
			const message = await channel.send("Blaze it");
			await message.react("🔥");
		}
	});

	// message at 4:20 pm
	const rule2 = new RecurrenceRule();
	rule2.hour = 16;
	rule2.minute = 20;
	const job2 = scheduleJob("blaze2", rule2, async () => {
		blazeItLog.info("4:20 pm scheduled blaze-it called")
		const channel = StaticClient.client.channels.cache.get("236745934128676865");
		if (channel?.isTextBased()) {
			Leaderboard.hasReacted = false;
			const message = await channel.send("Blaze it");
			await message.react("🔥");
		}
	});

	StaticClient.client.on("interactionCreate", async (interaction) => {
		interactionLog.info("Handling and interaction")
		if (interaction.isChatInputCommand())
			if (interaction.commandName === "say") {
				let reply = interaction.options.getString("content")
				if (reply)
					await interaction.reply(reply)
			}
	})

	StaticClient.client.on("messageReactionAdd", async (reaction, user) => {
		reactionLog.info("Handling a reaction")
		if (
			reaction.message.author?.id === StaticClient.client.user?.id && // Message being reacted to is shit-chan's
			reaction.message.content === "Blaze it" && // Message text it Blaze it
			reaction.emoji.name === "🔥" && // Emoji is 🔥
			!user.bot && // User is not a bot
			!Leaderboard.hasReacted // User is first
		) {
			if (user.username) {
				Leaderboard.hasReacted = true;
				if (!Leaderboard.cache[user.username])
					Leaderboard.cache[user.username] = 1;
				else
					Leaderboard.cache[user.username] += 1;
				Leaderboard.save();
			}

		}
	})

	StaticClient.client.on("messageCreate", async (message) => {
		messageLog.info(`Handling message: ${message?.author?.tag}: "${message?.content}"`)
		// Special shutdown handling to allow cancellation of jobs
		if (message.content === "uwu shutdown" && message.author.id === "236949806386380801") {
			messageLog.info("Received shutdown command")
			StaticClient.client.destroy();
			job.cancel();
			job2.cancel();
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
				messageLog.error("Error leaked from event, this should've probably been handled earlier: ", e)
			}

			// Process commands
			try {
				await CommandUtil.callCommandIfCommand(message);
			} catch (e) {
				messageLog.error("Error leaked from command, this should've probably been handled earlier: ", e)
			}
		}
	});


}