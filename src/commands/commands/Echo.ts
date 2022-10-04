import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";

export class Echo implements Command {
	key: string = "echo";
	help = "`uwu echo <STRING>`: Replies with the string provided echoed back to you" 
	async cmd(msg: Message) {
		const content = CommandUtil.getContent(msg)
		await msg.reply(content)
	}
}