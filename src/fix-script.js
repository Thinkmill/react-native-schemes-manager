const chalk = require('chalk');
const path = require('path');

const utilities = require('./utilities');

function updateProject (project, argv) {
	console.log(path.dirname(path.relative(process.cwd(), project.filepath)));

	const section = project.hash.project.objects.PBXShellScriptBuildPhase;

	for (const key of Object.keys(section)) {
        // Look for the React native script.
		const step = section[key];

		if (step && step.shellScript && step.shellScript.indexOf('react-native-xcode.sh') >= 0) {
            // Found it!
            // Need to add our actual mappings to the project.
			const configurations = (utilities.getMappings().Debug || []).join('|');
			const devConfigs = `${configurations}${configurations.length ? '|' : ''}Debug`;
			const bundledDebugSchemes = utilities.getBundledMappings(argv.iosProjectDir).join('|');
			const newScript = `"export NODE_BINARY=node\\nexport DEVELOPMENT_BUILD_CONFIGURATIONS=\\"${devConfigs}\\"\\nexport BUNDLED_DEVELOPMENT_BUILD_CONFIGURATIONS=\\"${bundledDebugSchemes}\\"\\n../node_modules/react-native-schemes-manager/lib/react-native-xcode.sh"`;

			if (step.shellScript === newScript) {
                // It's already up to date.
				console.log(chalk.gray(` - [fix-script]: ${path.dirname(path.relative(process.cwd(), project.filepath))} skipped`));
				return false;
			} else {
				step.shellScript = newScript;

				console.log(chalk.gray(` ${chalk.green('✔')} [fix-script]: ${path.dirname(path.relative(process.cwd(), project.filepath))} ${chalk.green('fixed')}`));
				return true;
			}
		}
	}
}

module.exports = function findAndFix (argv) {
	// Find all of the pbxproj files we care about.
	const pattern = './ios/*.xcodeproj/project.pbxproj';

	utilities.updateProjectsMatchingGlob(pattern, argv.iosProjectDir, (err, project) => {
		if (err) {
			return console.error(chalk.red(`⃠ [fix-script]: Error!`, err));
		}

		return updateProject(project, argv);
	});
};
