import { Message } from "discord.js";
import { Command } from "../Command";
import { Logger } from "../../Logger";
import { Player } from "../../helper/Player";

const skipLog = new Logger("Skip/Skip");
export class Skip implements Command {
	key = "skip";
	help = "Used to skip the currently playing audio";
	async cmd(msg: Message) {
		skipLog.info("Skipping song");
		if (!Player.isValidUser(msg, true))
			return;

		if (!Player.isPlaying()) {
			await msg.reply("Cannot skip a song, nothing is playing");
			return;
		}

		// Should not need to init because something is already playing, as otherwise isPlaying would have stopped this
		await Player.skip();
	}
}