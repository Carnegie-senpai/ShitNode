import { Job, JobCallback, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit, scheduleJob } from "node-schedule";
import { Logger } from "../Logger";

const scheduledLog = new Logger("ScheduledJobCreator/callback");
export class ScheduledJobCreator {
    static jobs: Job[] = [];

    static scheduleJob(name: string, rule: RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number, callback: JobCallback) {
        const wrappedCallback: JobCallback = async (fireDate: Date) => {
            try {
                scheduledLog.info(`Executing the scheduled job "${name}"`);
                await callback(fireDate)
            } catch (e) {
                scheduledLog.error(`Caught an error executing the scheduled job "${name}": `, e);
            }
        };
        const job = scheduleJob(name, rule, wrappedCallback);
        ScheduledJobCreator.jobs.push(job);
    }

    static cancelJobs() {
        for (let job of ScheduledJobCreator.jobs) {
            job.cancel();
        }
    }
}