import { Message } from "discord.js";
import { Command } from "../Command";
import { Play } from "./Play"
import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { stream } from "../../helper/YoutubeStream";
import { Logger } from "../../Logger";

const skipLog = new Logger("Skip/Skip")
export class Skip implements Command {
	key = "skip";
	help = "Used to skip the currently playing audio"
	async cmd (msg: Message) {
		skipLog.info("Skipping song")
		if (Play.audioPlayer && Play.audioPlayer.state && Play.audioPlayer.state.status !== AudioPlayerStatus.Idle) {
			if (Play.queue.length > 0) {
				Play.audioPlayer.stop();
				let nextSong = Play.queue.splice(0,1)[0];
				console.log(`Playing ${nextSong.name}`);
				const audioStream = stream(nextSong);
				const audioResource = createAudioResource(audioStream);
				Play.audioPlayer.play(audioResource);
			} else {
				Play.audioPlayer.stop(true);
				Play.disconnect();
			}
		}
	}
}