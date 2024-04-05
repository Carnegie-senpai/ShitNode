import ytdl from "ytdl-core";
import ytsr from "ytsr";
import { Logger } from '../Logger';
export interface Video {
	name: string;
	url: string;
}

const youtubeLogger = new Logger('YoutubeStream/YoutubeStream');
export function stream(video: Video) {
	return ytdl(video.url, {
		filter: "audioonly",
		quality: "lowestaudio",
		highWaterMark: 1 << 62,
		liveBuffer: 1 << 62,
		dlChunkSize: 0
	});

}


/**
 * Returns the video information fetched from youtube, or undefined if it cannot be found
 * @param input 
 * @returns 
 */
export async function getVideo(input: string): Promise<Video | undefined> {
	youtubeLogger.info(`Fetching video for input "${input}"`);
	if (ytdl.validateURL(input)) {
		youtubeLogger.info(`Determined that was a valid youtube url`);
		const info = await ytdl.getBasicInfo(input);
		return {
			name: info.videoDetails.title,
			url: input
		};
	} else if (input.startsWith('http')) {
		youtubeLogger.warn('Attempted to play video from non-youtube url');
		return;
	}

	youtubeLogger.info('Attempting to search for input');
	const search = await ytsr(input, { limit: 10 });
	let resolvedUrl = "";
	let resolvedName = "";
	for (let result of search.items) {
		if (result.type == "video") {
			resolvedUrl = result.url;
			resolvedName = result.title;
			break;
		}
	}

	if (!resolvedUrl || !resolvedName) {
		youtubeLogger.warn('Could not find any videos for the search term');
		return;
	}

	return {
		name: resolvedName,
		url: resolvedUrl
	};
}