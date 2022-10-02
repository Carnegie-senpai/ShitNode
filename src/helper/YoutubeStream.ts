import ytdl from "ytdl-core";
import { createWriteStream} from "fs"

export function stream(url: string) {
	let stream = ytdl(url, {filter: "audioonly", quality: "highestaudio"});
	return stream
}