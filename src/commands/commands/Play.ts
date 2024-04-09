import { Message } from "discord.js";
import { Command } from "../Command";
import { Logger } from "../../Logger";
import { Player } from "../../helper/Player";

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

		// Check if user is allowed to run this command
		if (!await Player.isValidUser(msg, true))
			return;

		// Initialize the player
		await Player.init(msg, true);

		if (Player.isPlaying()) {
			Player.pushQueue(video);
		} else {
			await Player.playVideo(video);
		}
	}
}