import moment from "moment"

/**
 * A helper logger class that try/catches logging statements to stop crashes from logging and adds some metadata like callerLocation and timeStamp
 */
export class Logger {
    private callerLocation: string
    /**
     * 
     * @param callerLocation formatted FileName/Purpose
     */
    constructor(callerLocation: string) {
        this.callerLocation = callerLocation
    }

    log(message: string, ...args) {
        this.info(message, args)
    }

    info(message: string, ...args) {
        try {
            const now = moment().format("MM-DD-YYYY HH:mm:ss.SSS")
            const formattedMessage = `[${now}][${this.callerLocation}][info] ${message}`
            console.info(formattedMessage, args)
        } catch (e) {
            console.error("Logger encountered an error, continuing: ", e)
        }
    }

    warn(message: string, ...args) {
        try {
            const now = moment().format("MM/DD/YYYY HH:mm:ss.SSS")
            const formattedMessage = `[${now}][${this.callerLocation}][warn] ${message}`
            console.warn(formattedMessage, args)
        } catch (e) {
            console.error("Logger encountered an error, continuing: ", e)
        }
    }

    error(message: string, ...args) {
        try {
            const now = moment().format("MM/DD/YYYY HH:mm:ss.SSS")
            const formattedMessage = `[${now}][${this.callerLocation}][error] ${message}`
            console.error(formattedMessage, args)
        } catch (e) {
            console.error("Logger encountered an error, continuing: ", e)
        }
    }
}
