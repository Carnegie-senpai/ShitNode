import { Message } from "discord.js";
import { Command } from "../Command";

export class Ping implements Command {
	key = "ping";

	async cmd(msg: Message) {
		await msg.reply("pong")
	}
}