import { Message } from "discord.js";
import { randomInsult } from "../../helper/RandomInsult";
import { Command } from "../Command";
import { Logger } from "../../Logger";


const insultLog = new Logger("Insult/Insult")
export class Insult implements Command {
	key = "insult"
	help = "`uwu insult`: Replies with a randomly selected insult"
	async cmd(msg: Message) {
		insultLog.info("Insulting a user")
		await msg.reply(`<@${msg.author.id}> is a ${randomInsult()}`)
	}
}