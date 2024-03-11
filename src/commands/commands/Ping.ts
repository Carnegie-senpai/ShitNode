import { Message } from "discord.js";
import { Command } from "../Command";
import { Logger } from "../../Logger";

const pingLog = new Logger("Ping/Ping")
export class Ping implements Command {
	key = "ping";
	help = "`uwu ping`: Replies with \"pong\""
	async cmd(msg: Message) {
		pingLog.info("Ponging")
		await msg.reply("pong")
	}
}