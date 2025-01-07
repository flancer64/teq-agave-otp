/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl64_Otp_Back_Defaults {

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
