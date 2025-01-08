/**
 * Repository for managing OTP Tokens in the database.
 * @implements TeqFw_Db_Back_Api_RDb_Repository
 */
export default class Fl64_Otp_Back_Store_RDb_Repo_Token {
    /**
     * @param {TeqFw_Db_Back_App_Crud} crud - CRUD engine for database operations.
     * @param {Fl64_Otp_Back_Store_RDb_Schema_Token} schema - Persistent DTO schema for OTP Token.
     */
    constructor(
        {
            TeqFw_Db_Back_App_Crud$: crud,
            Fl64_Otp_Back_Store_RDb_Schema_Token$: schema,
        }
    ) {
        /**
         * @param {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto} [dto]
         * @returns {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto}
         */
        this.createDto = schema.createDto;

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto} [params.dto]
         * @returns {Promise<{primaryKey: Object<string, string|number>}>}
         */
        this.createOne = async function ({trx, dto}) {
            return crud.createOne({schema, trx, dto});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.conditions
         * @returns {Promise<{deletedCount: number}>}
         */
        this.deleteMany = async function ({trx, conditions}) {
            return crud.deleteMany({schema, trx, conditions});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.key
         * @returns {Promise<{deletedCount: number}>}
         */
        this.deleteOne = async function ({trx, key}) {
            return crud.deleteOne({schema, trx, key});
        };

        /**
         * @returns {Fl64_Otp_Back_Store_RDb_Schema_Token}
         */
        this.getSchema = () => schema;

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.conditions
         * @param {Object<string, 'asc'|'desc'>} [params.sorting]
         * @param {{limit: number, offset: number}} [params.pagination]
         * @returns {Promise<{records: Array<Fl64_Otp_Back_Store_RDb_Schema_Token.Dto>}>}
         */
        this.readMany = async function ({trx, conditions, sorting, pagination}) {
            return crud.readMany({schema, trx, conditions, sorting, pagination});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.key
         * @param {Array<string>} [params.select]
         * @returns {Promise<{record: Fl64_Otp_Back_Store_RDb_Schema_Token.Dto|null}>}
         */
        this.readOne = async function ({trx, key, select}) {
            return crud.readOne({schema, trx, key, select});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.conditions
         * @param {Object} params.updates
         * @returns {Promise<{updatedCount: number}>}
         */
        this.updateMany = async function ({trx, conditions, updates}) {
            return crud.updateMany({schema, trx, conditions, updates});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.key
         * @param {Object} params.updates
         * @returns {Promise<{updatedCount: number}>}
         */
        this.updateOne = async function ({trx, key, updates}) {
            return crud.updateOne({schema, trx, key, updates});
        };
    }
}
