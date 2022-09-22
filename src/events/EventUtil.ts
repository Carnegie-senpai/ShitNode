import { Message } from "discord.js";
import { Event } from "./Event";
import * as events from "./index";

export class EventUtil {
	static events: Event[] = EventUtil.loadEvents();

	/**
	 * 
	 * @returns all events present in the events index
	 */
	private static loadEvents() {
		let allEvents: Event[] = [];
		Object.values(events).forEach((event) => {
			const eventInstance: Event = new event();
			allEvents.push(eventInstance);
		});
		return allEvents;
	}
	/**
	 * Triggers all events which have a regex expression match for the content of the message
	 */
	static async triggerAllMatchingEvents(msg: Message) {
		for (const event of EventUtil.events) {
			let result = msg.content.match(event.trigger)
			if (result) {
				try {
					await event.event(msg);
				} catch (e: any) {
					console.error("Caught error while executing event", e)
					await msg.reply(`There was an error while executing this event: ${e.message}`)
				}
			}
		}
	}
}