import { Message } from "discord.js";
import { randomInsult } from "../../helper/RandomInsult";
import { Command } from "../Command";


export class Insult implements Command {
	key = "insult"

	async cmd(msg: Message) {
		await msg.reply(`<@${msg.author.id}> is a ${randomInsult()}`)
	}
}