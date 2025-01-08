import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Otp_Back_Store_RDb_Repo_Token} */
const repoToken = await container.get('Fl64_Otp_Back_Store_RDb_Repo_Token$');
const ATTR = repoToken.getSchema().getAttributes();

// TEST CONSTANTS
const CODE = 'otp_code';
const TYPE = 'verification';
const DATE_CREATED = new Date();
const DATE_EXPIRES = new Date(new Date().getTime() + 3600000); // 1 hour later
let TOKEN_ID, USER_REF;

// Test Suite for Token Repository
describe('Fl64_Otp_Back_Store_RDb_Repo_Token', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new token entry', async () => {
        /** @type {Fl64_Otp_Back_Store_RDb_Schema_Token.Dto} */
        const dto = repoToken.createDto();
        dto.code = CODE;
        dto.type = TYPE;
        dto.date_created = DATE_CREATED;
        dto.date_expires = DATE_EXPIRES;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoToken.createOne({dto});
        TOKEN_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Token should be created');
    });

    it('should read an existing token by ID', async () => {
        const {record} = await repoToken.readOne({key: {id: TOKEN_ID}});

        assert.ok(record, 'Token should exist');
        assert.strictEqual(record.id, TOKEN_ID, 'Token ID should match');
    });

    it('should list all tokens', async () => {
        const tokens = await repoToken.readMany({});

        assert.ok(tokens.records.length > 0, 'There should be at least one token');
    });

    it('should update an existing token', async () => {
        const {record} = await repoToken.readOne({key: {id: TOKEN_ID}});
        record.type = 'updated_type';

        const {updatedCount} = await repoToken.updateOne({key: {id: TOKEN_ID}, updates: {type: 'updated_type'}});

        assert.strictEqual(updatedCount, 1, 'One token should be updated');
        const {record: updated} = await repoToken.readOne({key: {id: TOKEN_ID}});
        assert.strictEqual(updated.type, 'updated_type', 'Token type should be updated');
    });

    it('should delete an existing token', async () => {
        const {deletedCount} = await repoToken.deleteOne({key: {id: TOKEN_ID}});

        assert.strictEqual(deletedCount, 1, 'One token should be deleted');
    });
});
