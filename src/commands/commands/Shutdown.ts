import { Message } from "discord.js";
import { Command } from "../Command";

export class Shutdown implements Command {
	key = "shutdown"
	async cmd(msg: Message) {
		await msg.reply("Shutting down...")
		msg.client.destroy();
	}
}