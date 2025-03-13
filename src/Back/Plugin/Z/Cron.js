/**
 * Manages the scheduling of events upon application start and stop.
 */
export default class Fl64_Otp_Back_Plugin_Z_Cron {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl64_Otp_Back_Act_Clean} actClean
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Otp_Back_Act_Clean$: actClean,
        }
    ) {
        // VARS
        const DAY_MS = 86400000; // 24 hours in milliseconds
        const MIN_10_MS = 600000; // 10 minutes in milliseconds
        const MIN_20_MS = 1200000; // 20 minutes in milliseconds

        let intervalClean = null;
        let timeoutClean = null;
        let timeoutNextRun = null;

        // MAIN
        /**
         * Starts the scheduled execution of `actClean`.
         */
        this.start = function () {
            // Generate a random delay between 10 and 20 minutes
            const randomDelay = Math.floor(Math.random() * (MIN_20_MS - MIN_10_MS + 1)) + MIN_10_MS;

            logger.info(`The 'actClean' process will start after a random delay of ${randomDelay} ms.`);

            // Schedule the first execution after the random delay
            timeoutClean = setTimeout(async () => {
                try {
                    await actClean.run();
                    logger.info(`First 'actClean' execution completed after a ${randomDelay} ms delay.`);
                } catch (error) {
                    logger.exception(error);
                }

                // Schedule daily execution at 03:10 UTC
                const now = new Date();
                const nextRun = new Date(now);
                nextRun.setUTCHours(3, 10, 0, 0); // 03:10 UTC
                if (now > nextRun) {
                    nextRun.setUTCDate(nextRun.getUTCDate() + 1); // Move to the next day if already past 03:10 UTC
                }

                const timeUntilNextRun = nextRun.getTime() - now.getTime();

                logger.info(`Next 'actClean' execution scheduled for ${nextRun.toUTCString()}.`);

                // Schedule execution at the calculated time
                timeoutNextRun = setTimeout(async () => {
                    try {
                        await actClean.run();
                        logger.info(`'actClean' is now running daily at 03:10 UTC.`);
                    } catch (error) {
                        logger.exception(error);
                    }

                    // Set interval for daily execution
                    intervalClean = setInterval(() => {
                        actClean.run().catch(logger.exception);
                    }, DAY_MS);
                }, timeUntilNextRun);
            }, randomDelay);
        };

        /**
         * Stops all scheduled executions of `actClean`.
         */
        this.stop = function () {
            if (intervalClean) {
                clearInterval(intervalClean);
                logger.info(`'actClean' daily execution has been stopped.`);
            }
            if (timeoutClean) {
                clearTimeout(timeoutClean);
                logger.info(`Initial 'actClean' execution (random delay) has been stopped.`);
            }
            if (timeoutNextRun) {
                clearTimeout(timeoutNextRun);
                logger.info(`Scheduled execution of 'actClean' at 03:10 UTC has been stopped.`);
            }
        };
    }
}
