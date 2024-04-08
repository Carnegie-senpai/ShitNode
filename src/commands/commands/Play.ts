import { Message } from "discord.js";
import { Command } from "../Command";
import { stream, getVideo, Video } from "../../helper/YoutubeStream";
import { CommandUtil } from "../CommandUtil";
import { StaticClient } from "../../Client";
import { joinVoiceChannel, AudioPlayer, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayerStatus } from "@discordjs/voice";
import { Logger } from "../../Logger";
import { Player, PlayerInitializationStatus } from "../../helper/Player";

// TODO better log in this command
const playLog = new Logger("Play/Play");
export class Play implements Command {
	key = "play";
	help = "`uwu play <VIDEO>`: When provided with a valid youtube url, search term, or playlist it will begin to play the video. If a video is already being played it will be added to the queue instead";
	async cmd(msg: Message) {

		// No point in initializing the player if we cannot find the video that is being requested to play
		const video = await Player.fetchVideo(msg);
		// Let user know we cannot find the video
		if (!video) {
			playLog.info('Could not find video');
			await msg.reply("Could not find a youtube video to play");
			return;
		}

		// Initialize the player
		const initResult = Player.initAudio(msg);
		switch (initResult) {
			case PlayerInitializationStatus.SUCCESS:
				break;
			case PlayerInitializationStatus.ALREADY_ALIVE:
				break;
			case PlayerInitializationStatus.NO_VOICE_CHANNEL:
				await msg.reply("You must be in a voice channel to play audio");
				return;
			default:
				playLog.error(`Failed to iniitialize player, received status: ${initResult}`);
				await msg.reply("Encountered an error initializing the player");
				Player.kill()
				return;
		}

		if (Player.isPlaying()) {
			Player.pushQueue(video)
		} else {
			await Player.playVideo(video)
		}
	}
}