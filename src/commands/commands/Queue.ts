import { Message } from "discord.js";
import { Command } from "../Command";
import { CommandUtil } from "../CommandUtil";
import { Logger } from "../../Logger"
import { Player } from "../../helper/Player";

const queueLog = new Logger("Queue/Queue")

export class Queue implements Command {
	key: string = "queue";
	help = "`uwu queue`: Command is used to display the current queue to be played\n \
			`uwu queue <NUMBER>`: Command is used to remove an entry from the queue at the given index"
	async cmd(msg: Message) {
		queueLog.info('Getting queue')
		const content = CommandUtil.getContent(msg);
		if (content == "") {
			const queueContent = Player.printQueue()
			await msg.reply(queueContent);
		} else {
			const index = parseInt(content);
			if (Number.isNaN(index) || !Number.isInteger(index) || index < 0 || index >= Player.queue.length) {
				await msg.reply(`"${content}" is not a valid index`);
				return;
			}
				
			let removed = Player.removeFromQueue(index)
			if (removed)
				await msg.reply(`Removed "${removed.name}" from the queue`);
		}
	}
}