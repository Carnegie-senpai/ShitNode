import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";
import { Logger } from "../../Logger";

const echoLog = new Logger("Echo/Echo")
export class Echo implements Command {
	key: string = "echo";
	help = "`uwu echo <STRING>`: Replies with the string provided echoed back to you" 
	async cmd(msg: Message) {
		echoLog.log("Echoing string")
		const content = CommandUtil.getContent(msg)
		await msg.reply(content)
	}
}