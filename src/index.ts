import { readFileSync } from "fs";
import { Client, Message } from "discord.js";
import { Commands } from "./commands/Commands"

const client: Client = new Client({ intents: "MessageContent" })


async function startup() {
	const token = readFileSync("./assets/token").toString();
	client.on('ready', () => {
		console.log(`Logged in as ${client?.user?.tag}!`);
	  });	  
	await client.login(token);
	Commands.loadCommands();
	client.on("", (message) => {
		if (Commands.isCommand(message)) {
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