import ytdl from "ytdl-core";
import ytsr from "ytsr";

export interface Video {
	name: string;
	url: string;
}

export function stream(video: Video) {
	return ytdl(video.url, { 
		filter: "audioonly", 
		quality: "lowestaudio",
		highWaterMark: 1 << 62,
		liveBuffer: 1 << 62,
		dlChunkSize: 0
	});
	
}

export async function getVideo(input: string): Promise<Video> {
	if (input.includes("https://")) {
		const info = await ytdl.getBasicInfo(input)
		return {
			name: info.videoDetails.title,
			url: input
		}
	}

	const search = await ytsr(input, {limit: 10});
	let resolvedUrl = "";
	let resolvedName = "";
	for (let result of search.items) {
		if (result.type == "video") {
			resolvedUrl = result.url;
			resolvedName = result.title;
			break;
		}
	}

	if (!resolvedUrl || !resolvedName)
		throw new Error(`Could not find a video for input: ${input}`)
	
	return {
		name: resolvedName,
		url :resolvedUrl
	}
}