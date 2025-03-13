export default class Fl64_Otp_Back_Plugin_Stop {
    /**
     * @param {Fl64_Otp_Back_Plugin_Z_Cron} zCron
     */
    constructor(
        {
            Fl64_Otp_Back_Plugin_Z_Cron$: zCron,
        }
    ) {
        return function () {
            zCron.stop();
        };
    }
}
