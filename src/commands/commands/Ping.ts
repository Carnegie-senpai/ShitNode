import { Message } from "discord.js";
import { Command } from "../Command";

export class Ping implements Command {
	key = "ping";
	help = "`uwu ping`: Replies with \"pong\""
	async cmd(msg: Message) {
		await msg.reply("pong")
	}
}