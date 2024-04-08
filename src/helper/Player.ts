import { AudioPlayer, AudioPlayerStatus, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";
import { StaticClient } from "../Client";
import { CommandUtil } from "../commands/CommandUtil";
import { Video, getVideo, stream } from "./YoutubeStream";
import { Logger } from "../Logger";


export enum PlayerInitializationStatus {
    SUCCESS,
    ALREADY_ALIVE,

    // Connection Failures
    NO_GUILD_ID,
    NO_AUTHOR_ID,
    NO_GUILD_IN_CACHE,
    NO_MEMBER_IN_CACHE,
    NO_VOICE_CHANNEL,

    // Subscription Failures
    COULD_NOT_SUBSCRIBE
}

const playLogger = new Logger('Player/Player');
export class Player {
    private static _queue: Video[] = [];
    private static _audioPlayer: AudioPlayer = Player.createAudioPlayer();
    private static _connection: VoiceConnection | undefined = undefined;

    /**
     * Creates a player if that is necessary. Should be called at the beginning of any public functions to ensure that the player can play
     * @param msg Message which provides context for this interaction with the player
     */
    static initAudio(msg: Message) {
        if (!Player._connection) {
            Player._queue = [];
            if (!msg?.guildId)
                return PlayerInitializationStatus.NO_GUILD_ID;

            if (!msg?.author?.id)
                return PlayerInitializationStatus.NO_AUTHOR_ID;


            const guild = StaticClient.client.guilds.cache.get(msg.guildId);
            const member = guild?.members.cache.get(msg.author.id);
            const vc = member?.voice.channel;

            if (!guild)
                return PlayerInitializationStatus.NO_GUILD_IN_CACHE;

            if (!member)
                return PlayerInitializationStatus.NO_MEMBER_IN_CACHE;

            if (!vc)
                return PlayerInitializationStatus.NO_VOICE_CHANNEL;

            Player._connection = joinVoiceChannel({
                guildId: guild.id,
                channelId: vc.id,
                adapterCreator: guild.voiceAdapterCreator
            });

            if (!Player._connection.subscribe(Player._audioPlayer))
                return PlayerInitializationStatus.COULD_NOT_SUBSCRIBE;

            return PlayerInitializationStatus.SUCCESS;
        }
        return PlayerInitializationStatus.ALREADY_ALIVE;
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
        return response
    }

    static get queue() {
        return Player._queue
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
        return Player._connection && Player._audioPlayer.state.status !== AudioPlayerStatus.Idle;
    }

    /**
     * Barebones right now but function exists to perform any/all logic necessary to clear queue
     */
    private static clearQueue() {
        Player._queue = [];
    }
}