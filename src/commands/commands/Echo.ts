import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";

export class Echo implements Command {
	key: string = "echo";
	async cmd(msg: Message) {
		const content = CommandUtil.getContent(msg)
		await msg.reply(content)
	}
}