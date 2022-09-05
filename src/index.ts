import { readFileSync } from "fs";
import { Client, Message, GatewayIntentsString } from "discord.js";
import { Commands } from "./commands/Commands"

const client: Client = new Client({ intents: ["DirectMessageReactions", "DirectMessageTyping", "DirectMessages", "GuildBans", "GuildEmojisAndStickers", "GuildIntegrations", "GuildInvites", "GuildMembers", "GuildMessageReactions", "GuildMessageTyping", "GuildMessages", "GuildPresences", "GuildScheduledEvents", "GuildVoiceStates", "GuildWebhooks", "Guilds", "MessageContent"]  })


async function startup() {
	const token = readFileSync("./assets/token").toString();
	client.on('ready', () => {
		console.log(`Logged in as ${client?.user?.tag}!`);
	  });	  
	await client.login(token);
	Commands.loadCommands();
	client.on("messageCreate", (message) => {
		console.log("Recieved message")
		console.log(message.content)
		if (message.author.id != client?.user?.id && Commands.isCommand(message)) {
			const command = Commands.getCommand(message)
			if (command) {
				command(message).catch((reason)=>{
					console.error("Error executing command: ", reason)
				})
			} else {
				message.reply("Invalid command")
			}
		}
	})
}


startup()