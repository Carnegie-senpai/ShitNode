import { readFileSync } from "fs";
import { Client } from "discord.js";
import { CommandUtil } from "./commands/CommandUtil";
import { EventUtil } from "./events/EventUtil";
import { scheduleJob, RecurrenceRule } from "node-schedule";
import { Leaderboard } from "./helper/Leaderboard";

const client: Client = new Client({ intents: ["DirectMessageReactions", "DirectMessageTyping", "DirectMessages", "GuildBans", "GuildEmojisAndStickers", "GuildIntegrations", "GuildInvites", "GuildMembers", "GuildMessageReactions", "GuildMessageTyping", "GuildMessages", "GuildPresences", "GuildScheduledEvents", "GuildVoiceStates", "GuildWebhooks", "Guilds", "MessageContent"] });


export async function startup() {
	
	const token = readFileSync("./assets/token").toString();
	Leaderboard.load();
	
	client.on('ready', () => {
		console.log(`Logged in as ${client?.user?.tag}!`);

	});
	
	await client.login(token);

	// message at 4:20 am
	const rule = new RecurrenceRule();
	rule.hour = 4;
	rule.minute = 20;
	const job = scheduleJob("blaze", rule, async () => {
		const channel = client.channels.cache.get("236745934128676865");
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
		const channel = client.channels.cache.get("236745934128676865");
		if (channel?.isTextBased()) {
			Leaderboard.hasReacted = false;
			const message = await channel.send("Blaze it");
			await message.react("🔥");
		}
	});

	client.on("messageReactionAdd", async (reaction, user) => {
		if (
			// reaction.message.author?.id === client.user?.id && // Message being reacted to is shit-chan's
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

	client.on("messageCreate", async (message) => {
		// Special shutdown handling to allow cancellation of jobs
		if (message.content === "uwu shutdown" && message.author.id === "236949806386380801") {
			client.destroy();
			job.cancel();
			job2.cancel();
			return;
		}
		// Only trigger if the message sender is not shit-chan
		if (message.author.id != client?.user?.id) {
			console.log(`${message?.author?.tag}: "${message?.content}"`);

			// Process events
			EventUtil.triggerAllMatchingEvents(message);

			// Process commands
			CommandUtil.callCommandIfCommand(message);
		}
	});


}