/**
 * Model for managing OTP tokens in the backend.
 */
export default class Fl64_Otp_Back_Mod_Token {
    /**
     * @param {typeof import('node:crypto')} crypto
     * @param {Fl64_Otp_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Otp_Back_Store_RDb_Repo_Token} repoToken
     */
    constructor(
        {
            'node:crypto': crypto,
            Fl64_Otp_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Otp_Back_Store_RDb_Repo_Token$: repoToken,
        }
    ) {
        // VARS
        const {randomUUID} = crypto;

        const ATTR = repoToken.getSchema().getAttributes();

        /**
         * Generate a new OTP token.
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Transaction context.
         * @param {number} params.userId
         * @param {string} params.type
         * @param {number} [params.lifetime] - Token lifetime in seconds.
         * @returns {Promise<{token: string, tokenId:number}>}
         * @throws {Error} If required arguments are missing or unique token generation fails.
         */
        this.create = async function ({trx: trxOuter, userId, type, lifetime}) {
            if (!userId) throw new Error('User ID is required.');
            if (!type) throw new Error('Token type is required.');
            const normLifetime = lifetime ?? DEF.LIFETIME_SEC;

            /**
             * Generate a unique token and store it.
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @returns {Promise<{token: string, tokenId:number}>}
             * @throws {Error} If a unique token cannot be generated.
             */
            const operation = async (trx) => {
                let token, exists, attempts = 0;
                const maxAttempts = 5;

                do {
                    if (attempts++ >= maxAttempts) {
                        throw new Error('Failed to generate a unique token after maximum attempts.');
                    }
                    token = randomUUID();
                    const key = {[ATTR.CODE]: token};
                    const {record} = await repoToken.readOne({trx, key});
                    exists = !!record;
                } while (exists);

                const dto = repoToken.createDto();
                dto.code = token;
                dto.date_created = new Date();
                dto.date_expires = new Date(Date.now() + normLifetime * 1000);
                dto.type = type;
                dto.user_ref = userId;

                const {primaryKey} = await repoToken.createOne({trx, dto});
                const tokenId = primaryKey[ATTR.ID];
                logger.info(`OTP token generated for user ${userId} (id: ${tokenId}, type: ${type}, lifetime: ${normLifetime}).`);

                return {token, tokenId};
            };

            return trxWrapper.execute(trxOuter, operation);
        };

        /**
         * Deletes a token record from the database.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {number} [params.id]
         * @param {string} [params.token]
         * @returns {Promise<{deletedCount: number}>}
         */
        this.delete = async function ({trx: trxOuter, id, token}) {
            if (!id && !token) throw new Error('ID or token is required.');
            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @returns {Promise<{deletedCount: number}>}
             * @throws {Error}
             */
            const operation = async (trx) => {
                const key = (id) ? {[ATTR.ID]: id} : {[ATTR.CODE]: token};
                return repoToken.deleteOne({trx, key});
            };
            return trxWrapper.execute(trxOuter, operation);
        };

        /**
         * Reads token data by token code.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {string} params.token - The code of the token to be retrieved.
         * @returns {Promise<{dto: Fl64_Otp_Back_Store_RDb_Schema_Token.Dto}>}
         */
        this.read = async function ({trx: trxOuter, token}) {
            if (!token) throw new Error('User ID is required.');
            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @returns {Promise<{dto: Fl64_Otp_Back_Store_RDb_Schema_Token.Dto}>}
             * @throws {Error}
             */
            const operation = async (trx) => {
                /** @type {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto} */
                let dto;
                const key = {[ATTR.CODE]: token};
                const {record} = await repoToken.readOne({trx, key});
                if (record) {
                    if (record.date_expires.getTime() > (new Date()).getTime()) {
                        logger.info(`Token entry read successfully (id: ${record.id}).`);
                        dto = record;
                    } else {
                        logger.info(`Token entry is expired and will be deleted (id: ${record.id}).`);
                        await repoToken.deleteOne({trx, key});
                    }
                } else {
                    logger.info(`Token entry not found for code: ${token}.`);
                }
                return {dto};
            };
            return trxWrapper.execute(trxOuter, operation);
        };
    }
}
