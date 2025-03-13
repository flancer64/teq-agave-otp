/**
 * An action that removes expired tokens from the system.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Fl64_Otp_Back_Act_Clean {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Otp_Back_Store_RDb_Repo_Token} repoToken
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Otp_Back_Store_RDb_Repo_Token$: repoToken,
        }
    ) {
        // VARS
        const A_TOKEN = repoToken.getSchema().getAttributes();

        // MAIN
        /**
         * Executes the cleanup process for expired tokens.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional transaction object.
         * @returns {Promise<Object>}
         */
        this.run = async function ({trx: trxOuter} = {}) {
            logger.info('Initiating expired token cleanup.');

            await trxWrapper.execute(trxOuter, async (trx) => {
                const now = new Date();
                const conditions = {[A_TOKEN.DATE_EXPIRES]: ['<', now]};
                const {deletedCount} = await repoToken.deleteMany({trx, conditions});

                if (deletedCount) {
                    logger.info(`Successfully removed ${deletedCount} expired token(s).`);
                }
            });

            logger.info('Expired token cleanup completed.');
        };

    }
}
