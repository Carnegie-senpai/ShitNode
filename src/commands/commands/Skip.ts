import { Message } from "discord.js";
import { Command } from "../Command";
import { Play } from "./Play";
import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { stream } from "../../helper/YoutubeStream";
import { Logger } from "../../Logger";
import { Player, PlayerInitializationStatus } from "../../helper/Player";

const skipLog = new Logger("Skip/Skip");
export class Skip implements Command {
	key = "skip";
	help = "Used to skip the currently playing audio";
	async cmd(msg: Message) {
		skipLog.info("Skipping song");
		if (!Player.isPlaying()) {
			await msg.reply("Cannot skip a song, nothing is playing");
			return;
		}

		const initResult = Player.initAudio(msg);

		if (initResult !== PlayerInitializationStatus.ALREADY_ALIVE) {
			skipLog.error("Player should not have been playing but it was");
			return;
		}

		await Player.skip()
	}
}