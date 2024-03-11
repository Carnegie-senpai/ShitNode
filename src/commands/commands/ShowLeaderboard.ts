import { Message } from "discord.js";
import { Leaderboard } from "../../helper/Leaderboard";
import { Command } from "../Command";
import { Logger } from "../../Logger";

const showLeaderLog = new Logger("ShowLeaderBoard/ShowLeaderBoard")
export class ShowLeaderboard implements Command {
	key = "leaderboard";
	help = "`uwu leaderboard`: Command is used to show the current \"blaze it\" reaction leaderboard"
	async cmd(message: Message) {
		showLeaderLog.info("Showing leaderboard")
		await message.reply(Leaderboard.stringify());
	}
}