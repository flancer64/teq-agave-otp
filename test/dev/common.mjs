import 'dotenv/config';
import {join} from 'node:path';
import {initContainer, initPlugins, stopPlugins} from '@teqfw/core';
import {dirname} from 'path';
import {configDto} from '@teqfw/test';
import {existsSync} from 'node:fs';

// VARS
let container;

// MAIN
/**
 * Create a DI container then set up it to run in manual scenarios.
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createLocalContainer() {
    // compose path to the project root (plugin or app)
    const scriptPath = dirname(new URL(import.meta.url).pathname);
    let ROOT = join(scriptPath, '..', '..');
    while (!existsSync(join(ROOT, 'node_modules'))) {
        const parentPath = join(ROOT, '..');
        if (parentPath === ROOT) {
            throw new Error(`'./node_modules/' directory not found. Check the project structure.`);
        }
        ROOT = parentPath;
    }
    // Initialize the DI container, then add `AppTest_` namespace
    container = await initContainer(ROOT);
    const resolver = container.getResolver();
    const src = join(ROOT, 'test', 'dev', 'src');
    resolver.addNamespaceRoot('AppTest_', src, 'js');
    // load app configuration
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    config.init(configDto.pathToRoot, '0.0.0');
    // load teq plugins for the application
    await initPlugins(container, ROOT);
    return container;
}

/**
 * Stop all plugins in the app.
 * @returns {Promise<void>}
 */
export async function stopApp() {
    await stopPlugins(container);
}
