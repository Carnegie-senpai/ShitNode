import { Job, JobCallback, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit, scheduleJob } from "node-schedule";


export class ScheduledJobCreator {
    static jobs: Job[] = [];

    static scheduleJob(name: string, rule: RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string | number, callback: JobCallback) {
        const job = scheduleJob(name, rule, callback);
        ScheduledJobCreator.jobs.push(job);
    }

    static cancelJobs() {
        for (let job of ScheduledJobCreator.jobs) {
            job.cancel();
        }
    }
}