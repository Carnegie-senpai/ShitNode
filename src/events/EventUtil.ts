import { Message } from "discord.js";
import { Event } from "./Event";
import * as events from "./index";
import { Logger } from "../Logger";

const eventUtilLog = new Logger("EventUtil/EventUtil")
export class EventUtil {
	static events: Event[] = EventUtil.loadEvents();

	/**
	 * 
	 * @returns all events present in the events index
	 */
	private static loadEvents() {
		eventUtilLog.info("Loading events")
		let allEvents: Event[] = [];
		Object.values(events).forEach((event) => {
			const eventInstance: Event = new event();
			allEvents.push(eventInstance);
		});
		eventUtilLog.info(`Loaded ${allEvents.length} events`)
		return allEvents;
	}
	/**
	 * Triggers all events which have a regex expression match for the content of the message
	 */
	static async triggerAllMatchingEvents(msg: Message) {
		eventUtilLog.info("Processing an event")
		for (const event of EventUtil.events) {
			if (await event.trigger(msg)) {
				try {
					eventUtilLog.info('Calling event ')
					await event.event(msg);
				} catch (e: any) {
					eventUtilLog.error("Caught error while executing event", e)
					await msg.reply(`There was an error while executing this event: ${e.message}`)
				}
			}
		}
	}
}