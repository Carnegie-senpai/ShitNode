import { Message } from "discord.js";
import { Leaderboard } from "../../helper/Leaderboard";
import { Command } from "../Command";

export class ShowLeaderboard implements Command {
	key = "leaderboard";

	async cmd(message: Message) {
		await message.reply(Leaderboard.stringify());
	}
}