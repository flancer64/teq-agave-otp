/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl64_Otp_Back_Defaults {

    LIFETIME_SEC = 3600; // 1 hour

    NAME;

    /** @type {Fl64_Otp_Shared_Defaults} */
    SHARED;

    constructor(
        {
            Fl64_Otp_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
