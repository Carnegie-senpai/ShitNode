import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";
import { Play } from "./Play";
import { Logger } from "../../Logger"

const queueLog = new Logger("Queue/Queue")

export class Queue implements Command {
	key: string = "queue";
	help = "`uwu queue`: Command is used to display the current queue to be played\n \
			`uwu queue <NUMBER>`: Command is used to remove an entry from the queue at the given index"
	async cmd(msg: Message) {
		queueLog.info('Getting queue')
		const content = CommandUtil.getContent(msg);
		if (content == "") {
			let response = "  ===> Queue <===  ";
			for (let i = 0; i < Play.queue.length; i++) {
				response += `\n${i}: ${Play.queue[i].name}`;
			}
			await msg.reply(response);
		} else {
			let index = parseInt(content);
			if (Number.isNaN(index)) {
				await msg.reply(`"${content}" is not a valid index`);
				return;
			}
				
			let removed = Play.queue.splice(index, 1);
			await msg.reply(`Removed "${removed[0].name}" from the queue`);
		}
	}
}