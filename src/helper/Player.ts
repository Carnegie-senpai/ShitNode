import { AudioPlayer, AudioPlayerStatus, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";
import { CommandUtil } from "../commands/CommandUtil";
import { Video, getVideo, stream } from "./YoutubeStream";
import { Logger } from "../Logger";
import { User } from "./User";

const playLogger = new Logger('Player/Player');
export class Player {
    private static _queue: Video[] = [];
    private static _audioPlayer: AudioPlayer = Player.createAudioPlayer();
    private static _connection: VoiceConnection | undefined = undefined;



    /**
     * Determines if user is valid to play audio and responds accordingly
     * @param msg Message that provides the context for this command
     * @param respond Whether to reply to the user with information about result
     */
    static async isValidUser(msg: Message, respond?: boolean): Promise<boolean> {
        try {
            const user = User.getUser(msg);

            if (!user.member.voice.channel) {
                playLogger.error("User was not in a voice channel");
                if (respond)
                    await msg.reply("You must be in a voice channel to control audio"); // Honestly this whoe respond concept is silly but it saves space
                return false;
            }

            if (Player._connection && user.member.voice.channel.id !== Player._connection.joinConfig.channelId) {
                if (respond)
                    await msg.reply("You must be in the same voice channel as the bot to control audio");
                return false;
            }

            return true;
        } catch (e) {
            playLogger.error("Error while checking if user is valid, returning invalid: ", e);
            if (respond)
                await msg.reply("Failed to initialize player");
            return false;
        }
    }

    /**
     * Creates a player if that is necessary. Should be called at the beginning of any public functions to ensure that the player can play
     * @param msg Message that provides the context for this command
     * @param respond Whether to reply to the user with information about result
     */
    static async init(msg: Message, respond?: boolean) {
        try {
            if (!Player._connection) {
                const user = User.getUserInVoice(msg);
                Player._queue = [];
                Player._connection = joinVoiceChannel({
                    guildId: user.guild.id,
                    channelId: user.vc.id,
                    adapterCreator: user.guild.voiceAdapterCreator
                });

                if (!Player._connection.subscribe(Player._audioPlayer)) {
                    throw new Error("Could not subscribe to voice channel");
                }
            }
        } catch (e) {
            playLogger.error("Failed to init player, cleaning up: ", e);
            if (respond)
                await msg.reply("Failed to initialize player");
            Player.kill();
            throw e;
        }
    }

    private static createAudioPlayer() {
        const audioPlayer = createAudioPlayer();
        audioPlayer.on("stateChange", async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle) {
                let nextSong = Player.popQueue();
                if (!nextSong) {
                    playLogger.info("No more songs to play, stopping");
                    Player.kill();
                    return;
                }
                playLogger.log(`Playing ${nextSong.name}`);
                await Player.playVideo(nextSong);

            }
        });

        audioPlayer.on("error", (error) => {
            playLogger.error("Error in audio player: ", error);
            Player.kill();
        });
        return audioPlayer;
    }

    /**
     * Creates the message which is necessary if any for the video
     * @param msg Provides context for video
     * @returns 
     */
    static async fetchVideo(msg: Message) {
        const url = CommandUtil.getContent(msg);
        const video = await getVideo(url);
        return video;
    }

    /**
     * Adds element to the queue
     */
    static pushQueue(video: Video) {
        Player._queue.push(video);
    }

    /**
     * Returns the first element from the queue and removes it from the queue
     */
    static popQueue(): Video | undefined {
        if (Player._queue.length > 0)
            return Player._queue.splice(0, 1)[0];
    }


    /**
     * Removes element from the queue at the specified index and returns its video object
     * @param index 
     * @returns 
     */
    static removeFromQueue(index: number): Video | undefined {
        if (Player._queue[index])
            return Player._queue.splice(index, 1)[0];
    }

    /**
     * Prints the contents of the queue as a human readable string. If the queue length
     */
    static printQueue(): string {
        let response = "  ===> Queue <===  ";
        for (let i = 0; i < Player._queue.length; i++) {
            response += `\n${i}: ${Player._queue[i].name}`;
        }
        return response;
    }

    static get queue() {
        return Player._queue;
    }


    static async playVideo(video: Video) {
        if (Player.isPlaying()) {
            playLogger.warn(`Not playing video "${video.name}" because the player was already playing audio`);
            return;
        }
        const audioStream = stream(video);
        const audioResource = createAudioResource(audioStream);
        Player._audioPlayer.play(audioResource);
    }

    static async skip() {
        const nextSong = Player.popQueue();
        if (!nextSong) {
            Player.kill();
            return;
        }
        // Only stop playback of current video then move on to play popped song
        Player._audioPlayer.stop();
        Player.playVideo(nextSong);
    }

    /**
     * Attempts to stop the player, including clearing the queue, does not require context and can be called in any state to end playback
     */
    static kill() {
        try {
            playLogger.info('Stopping the player');
            Player._audioPlayer.stop(true);
            Player.clearQueue();
            if (Player._connection) {
                Player._connection.disconnect();
                Player._connection.destroy();
                Player._connection = undefined;
            }
        } catch (e) {
            playLogger.error("Encountered an error stopping player, trying to perform at least basic state cleanup");
            Player._queue = [];
            const tempConnection = Player._connection;
            Player._connection = undefined;
            tempConnection?.destroy();
            throw e;
        }
    }

    /**
     * Determines whether the player is currently playing anything based on the state of the connection and whether audio is playing
     * @returns @boolean
     */
    static isPlaying() {
        return !!Player._connection && Player._audioPlayer.state.status !== AudioPlayerStatus.Idle;
    }

    /**
     * Barebones right now but function exists to perform any/all logic necessary to clear queue
     */
    private static clearQueue() {
        Player._queue = [];
    }
}