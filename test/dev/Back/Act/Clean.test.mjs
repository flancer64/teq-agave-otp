import {strict as assert} from 'assert';
import {createLocalContainer, stopApp} from '../../common.mjs';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS
// const HOST = process.env.HOST || 'localhost';

// Get runtime environment
/** @type {Fl64_Otp_Back_Act_Clean} */
const action = await container.get('Fl64_Otp_Back_Act_Clean$');


describe('Fl64_Otp_Back_Act_Clean', function () {
    this.timeout(100000);

    before(async function () { });

    after(async function () {
        await stopApp();
    });

    it('should perform the action', async function () {
        await action.run({});
        assert.ok(true, 'The action is done.');
    });


});
