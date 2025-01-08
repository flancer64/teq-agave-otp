/**
 * Persistent DTO with metadata for the RDB entity: OTP Token.
 * @namespace Fl64_Otp_Back_Store_RDb_Schema_Token
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/otp/token';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_Otp_Back_Store_RDb_Schema_Token
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_CREATED: 'date_created',
    DATE_EXPIRES: 'date_expires',
    ID: 'id',
    TYPE: 'type',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OTP Token entity.
 * @memberOf Fl64_Otp_Back_Store_RDb_Schema_Token
 */
class Dto {
    /**
     * One-time code generated for the specified activity.
     *
     * @type {string}
     */
    code;

    /**
     * Timestamp of when the token was generated.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Timestamp of when the token will expire.
     *
     * @type {Date}
     */
    date_expires;

    /**
     * Internal numeric identifier for the token.
     *
     * @type {number}
     */
    id;

    /**
     * Type of activity for which the token is generated, defined at the project level.
     *
     * @type {string}
     */
    type;

    /**
     * Reference to the GPT user for whom this token is generated.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the OTP Token entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Fl64_Otp_Back_Store_RDb_Schema_Token {
    /**
     * Constructor for the OTP Token persistent DTO class.
     *
     * @param {Fl64_Otp_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            Fl64_Otp_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto|Object} [data]
         * @returns {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.code = cast.string(data?.code);
                res.date_created = cast.date(data?.date_created);
                res.date_expires = cast.date(data?.date_expires);
                res.id = cast.int(data?.id);
                res.type = cast.string(data?.type);
                res.user_ref = cast.int(data?.user_ref);
            }
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {Object}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         *
         * @returns {string}
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         *
         * @returns {Array<string>}
         */
        this.getPrimaryKey = () => [ATTR.ID];
    }
}
