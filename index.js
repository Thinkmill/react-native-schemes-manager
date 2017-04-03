#!/usr/bin/env node
const yargs = require('yargs');

yargs
.usage('$0 command')
.command('all', 'run all bundled commands', yargs => {
	const operations = require('./src');

	for (const key of Object.keys(operations)) {
		operations[key](yargs.argv);
	}
})
.command('fix-libraries', 'add any missing build configurations to all xcode projects in node_modules', yargs => {
	require('./src/fix-libraries')(yargs.argv);
})
.command('fix-script', 'replace the react native ios bundler with our scheme aware one', yargs => {
	require('./src/fix-script')(yargs.argv);
})
.command('hide-library-schemes', `hide any schemes that come from your node modules directory so they don't clutter up the menu.`, yargs => {
	require('./src/hide-library-schemes')(yargs.argv);
})
.command('verify-config', `check the configuration and ensure we have both a postinstall script and xcodeSchemes configurations.`, yargs => {
	require('./src/verify-config')(yargs.argv);
})
.demand(1, 'must provide a valid command')
.help('h')
.alias('h', 'help')
.argv;
