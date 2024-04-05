import { Message } from "discord.js";
import { Command } from "../Command";
import { stream, getVideo, Video } from "../../helper/YoutubeStream";
import { CommandUtil } from "../CommandUtil";
import { StaticClient } from "../../Client";
import { joinVoiceChannel, AudioPlayer, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayerStatus } from "@discordjs/voice";
import { Logger } from "../../Logger";

// TODO better log in this command
const playLog = new Logger("Play/Play");
export class Play implements Command {
	key = "play";
	help = "`uwu play <VIDEO>`: When provided with a valid youtube url, search term, or playlist it will begin to play the video. If a video is already being played it will be added to the queue instead";
	static audioPlayer: AudioPlayer | null = null;
	static connection: VoiceConnection | null = null;
	static queue: Video[] = [];
	async cmd(msg: Message) {

		// --- START OF GATING --- 
		if (!msg.guildId)
			return;

		// Fetch video
		const url = CommandUtil.getContent(msg);
		const video = await getVideo(url);

		// Let user know we cannot find the video
		if (!video) {
			playLog.info('Could not find video');
			await msg.reply("Could not find a youtube video to play");
			return;
		}

		// Get info needed to join voice channel
		const guild = StaticClient.client.guilds.cache.get(msg.guildId);
		const member = guild?.members.cache.get(msg.author.id);
		const vc = member?.voice.channel;

		// Do not play if user is not in a voice channel
		if (!vc) {
			await msg.reply("You must be in a voice channel to play audio");
			return;
		}

		// Create player if it does not exist. Only do this once
		Play.createAudioPlayerIfDoesNotExist();

		if (!Play.audioPlayer) {
			playLog.error('Audio player not created when it should have been');
			return;
		}

		// --- END OF GATING --- 
		// after this point, everything should properly be in place to play audio. Add any future verification above this point

		// Queue up music if already playing a song
		if (Play.audioPlayer.state.status != "idle") {
			playLog.log("Already playing something, queuing video", Play.audioPlayer.state.status);
			Play.queue.push(video);
			playLog.log("Queue: ", Play.queue);
			return;
		}

		// Create connection if one does not exist
		if (guild?.id && vc?.id && !Play.connection) {
			Play.connection = joinVoiceChannel({
				guildId: guild.id,
				channelId: vc.id,
				adapterCreator: guild.voiceAdapterCreator
			});
		}

		try {
			const audioStream = stream(video);
			const audioResource = createAudioResource(audioStream);
			if (audioResource && Play.connection) {
				Play.connection.subscribe(Play.audioPlayer);
				Play.audioPlayer.play(audioResource);

			}
		} catch (e) {
			console.error("Error while attempting to play audio: ", e);
			Play.disconnect();
		}
	}

	static createAudioPlayerIfDoesNotExist() {
		if (!Play.audioPlayer) {
			Play.audioPlayer = createAudioPlayer();

			Play.audioPlayer.on("stateChange", async (oldState, newState) => {
				if (newState.status === AudioPlayerStatus.Idle && Play.audioPlayer) {
					if (Play.queue.length > 0) {
						let nextSong = Play.queue.splice(0, 1)[0];
						playLog.log(`Playing ${nextSong.name}`);
						const audioStream = stream(nextSong);
						const audioResource = createAudioResource(audioStream);
						Play.audioPlayer.play(audioResource);
					} else {
						Play.disconnect();
					}

				}
			});

			Play.audioPlayer.on("error", (error) => {
				playLog.error("Error in audio player: ", error);
				try {
					Play.queue = [];
					Play.audioPlayer?.stop(true);
				} catch (e) {
					playLog.error("Error stopping playback on error: ", e);
				}
				try {
					Play.disconnect();
				} catch (e) {
					playLog.error("Error disconnecting from voice channel on error: ", e);
				}
			});
		}
	}

	static disconnect() {
		if (Play.connection) {
			Play.connection.disconnect();
			Play.connection.destroy();
			Play.connection = null;
		}
	}
}