import { readFileSync } from "fs";
import { Client } from "discord.js";
import { CommandUtil } from "./commands/CommandUtil";
import { EventUtil } from "./events/EventUtil";
import { scheduleJob, RecurrenceRule } from "node-schedule";

const client: Client = new Client({ intents: ["DirectMessageReactions", "DirectMessageTyping", "DirectMessages", "GuildBans", "GuildEmojisAndStickers", "GuildIntegrations", "GuildInvites", "GuildMembers", "GuildMessageReactions", "GuildMessageTyping", "GuildMessages", "GuildPresences", "GuildScheduledEvents", "GuildVoiceStates", "GuildWebhooks", "Guilds", "MessageContent"] });


export async function startup() {
	const token = readFileSync("./assets/token").toString();
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
			const message = await channel.send("Blaze it");
			await message.react("🔥");
		}
	});

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
			await EventUtil.triggerAllMatchingEvents(message);

			// Process commands
			await CommandUtil.callCommandIfCommand(message);
		}
	});


}