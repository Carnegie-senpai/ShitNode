import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";


export class Help implements Command {
	key = "help";
	help = "`uwu help <COMMAND>`: Replies with how to use a given command";
	async cmd(msg: Message) {
		const content = CommandUtil.getContent(msg);
		let commands = Object.keys(CommandUtil.commands);
		for (let command of commands) {
			if (content == command) {
				await msg.reply(CommandUtil.commands[command].help);
				return;
			}
		}
		commands.sort();
		let response = this.help + "\n  ===> Available Commands <===  ";

		for (let command of commands) {
			response += `\n${command}`;
		}
		await msg.reply(response);
	}
}