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
            if (args.length > 0)
                console.info(formattedMessage, args)
            else
                console.info(formattedMessage)
        } catch (e) {
            console.error("Logger encountered an error, continuing: ", e)
        }
    }

    warn(message: string, ...args) {
        try {
            const now = moment().format("MM/DD/YYYY HH:mm:ss.SSS")
            const formattedMessage = `[${now}][${this.callerLocation}][warn] ${message}`
            if (args.length > 0)
                console.warn(formattedMessage, args)
            else
                console.warn(formattedMessage)
        } catch (e) {
            console.error("Logger encountered an error, continuing: ", e)
        }
    }

    error(message: string, ...args) {
        try {
            const now = moment().format("MM/DD/YYYY HH:mm:ss.SSS")
            const formattedMessage = `[${now}][${this.callerLocation}][error] ${message}`
            if (args.length > 0)
                console.error(formattedMessage, args)
            else
                console.error(formattedMessage)
        } catch (e) {
            console.error("Logger encountered an error, continuing: ", e)
        }
    }
}
