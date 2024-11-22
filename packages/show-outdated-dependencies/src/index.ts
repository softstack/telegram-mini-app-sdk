import dotenv from 'dotenv';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { OutdatedDependentPackage, Package, PackagePack, PackageView } from './types';

dotenv.config();

const execute = (command: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout) => {
			if (error) {
				reject(error);
			}
			resolve(stdout);
		});
	});
};

const getOutdatedDependentPackages = (packages: Array<Package>): Array<OutdatedDependentPackage> => {
	const outdatedDependentPackages = new Array<OutdatedDependentPackage>();
	for (const { packageJson: dependent } of packages) {
		if (dependent.dependencies) {
			const outdatedDependentPackage: OutdatedDependentPackage = {
				dependentName: dependent.name,
				dependencies: [],
			};
			for (const { packageJson: workspacePackageJson } of packages) {
				for (const dependency of Object.entries(dependent.dependencies)) {
					const dependencyName = dependency[0];
					const dependencyVersion = dependency[1].replace('^', '');
					if (workspacePackageJson.name === dependencyName && workspacePackageJson.version !== dependencyVersion) {
						outdatedDependentPackage.dependencies.push({
							name: workspacePackageJson.name,
							oldVersion: dependencyVersion,
							newVersion: workspacePackageJson.version,
						});
					}
				}
			}
			if (outdatedDependentPackage.dependencies.length > 0) {
				outdatedDependentPackages.push(outdatedDependentPackage);
			}
		}
	}
	return outdatedDependentPackages;
};

const main = async (): Promise<void> => {
	try {
		const PACKAGES_PATH = process.env.PACKAGES_PATH;
		if (!PACKAGES_PATH) {
			throw new Error('PACKAGES_PATH is not defined');
		}

		// Get package paths
		const packagePaths = fs
			.readdirSync(PACKAGES_PATH)
			.map((packageDirectory) => path.join(PACKAGES_PATH, packageDirectory));

		// Get package information
		const packages = (
			await Promise.all(
				packagePaths.map(async (packagePath) => {
					const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
					if (packageJson.private) {
						return {
							packagePath,
							packageJson,
							packageView: undefined,
							packagePack: undefined,
						};
					} else {
						const packageView = JSON.parse(await execute(`npm view --json ${packageJson.name}`)) as PackageView;
						const packagePack = JSON.parse(
							await execute(`npm pack --json --dry-run --workspace ${packageJson.name}`),
						)[0] as PackagePack;
						return {
							packagePath,
							packageJson,
							packageView,
							packagePack,
						};
					}
				}),
			)
		).filter(Boolean) as Array<Package>;

		let exitCode = 0;

		// Show package versions that need to be updated
		let outputLines = new Array<string>();
		for (const { packageView, packagePack } of packages) {
			if (
				packageView &&
				packagePack &&
				packageView.version === packagePack.version &&
				packageView.dist.shasum !== packagePack.shasum
			) {
				outputLines.push(`${packagePack.name} ${packagePack.version} -> xxx`);
			}
		}
		if (outputLines.length === 0) {
			console.log('No package version needs to be updated');
		} else {
			exitCode = 1;
			console.log('Package versions that need to be updated:');
			for (const line of outputLines) {
				console.log(line);
			}
		}

		// Show outdated dependencies
		const outdatedDependencyPackages = getOutdatedDependentPackages(packages);
		outputLines = [];
		let fixOutput = '';
		for (const { dependentName, dependencies } of outdatedDependencyPackages) {
			outputLines.push(`${dependentName}`);
			for (const { name: dependencyName, oldVersion, newVersion } of dependencies) {
				outputLines.push(`\t${dependencyName} ${oldVersion} -> ${newVersion}`);
				if (fixOutput) {
					fixOutput += ' && ';
				}
				const tmpFix = `npm i ${dependencyName}@${newVersion} --workspace ${dependentName}`;
				fixOutput += `${tmpFix} && ${tmpFix}`;
			}
		}
		if (outputLines.length === 0) {
			console.log('\nNo outdated dependencies found');
		} else {
			exitCode = 1;
			console.log('\nOutdated dependencies:');
			for (const line of outputLines) {
				console.log(line);
			}
			console.log(`\n\tFix: ${fixOutput}`);
		}

		// Show packages that need to be published
		outputLines = [];
		fixOutput = '';
		for (const { packageView, packagePack } of packages) {
			if (packageView && packagePack && packageView.version !== packagePack.version) {
				outputLines.push(`${packagePack.name} ${packageView.version} -> ${packagePack.version}`);
				if (fixOutput) {
					fixOutput += ' && ';
				}
				fixOutput += `npm publish --workspace ${packagePack.name} && git tag ${packagePack.name.split('/')[1]}-v${packagePack.version}`;
			}
		}
		if (outputLines.length === 0) {
			console.log('\nNo package needs to be published');
		} else {
			exitCode = 1;
			console.log('\nPackages that need to be published:');
			for (const line of outputLines) {
				console.log(line);
			}
			console.log(`\n\tFix: ${fixOutput} && git push --tags`);
		}

		if (exitCode !== 0) {
			process.exit(exitCode); // eslint-disable-line unicorn/no-process-exit
		}
	} catch (error) {
		console.error(error);
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
};

main();
