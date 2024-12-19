import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { Package, PackagePack, PackageView } from './types';
import { execute, getOutdatedDependentPackages, isValidVersionBump } from './utils';

dotenv.config();

const showPackages = (packages: Array<Package>): void => {
	const outputLines = new Array<string>();
	for (const { packageJson } of packages) {
		outputLines.push(
			`${packageJson.name} ${packageJson.version}` +
				(packageJson.private ? ' (private)' : '') +
				(packageJson.deprecated ? ' (deprecated)' : ''),
		);
	}
	if (outputLines.length === 0) {
		console.log('No packages found.');
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	} else {
		console.log('Packages:');
		for (const line of outputLines) {
			console.log(line);
		}
	}
};

const showInvalidVersionBumps = (packages: Array<Package>): void => {
	const outputLines = new Array<string>();
	for (const { packagePack, packageView } of packages) {
		if (
			packagePack &&
			packageView &&
			packagePack.version !== packageView.version &&
			!isValidVersionBump(packagePack, packageView)
		) {
			outputLines.push(`${packagePack.name} ${packageView.version} -> ${packagePack.version}`);
		}
	}
	if (outputLines.length === 0) {
		console.log('No invalid version bump.');
	} else {
		console.log('Invalid version bumps:');
		for (const line of outputLines) {
			console.log(line);
		}
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
};

const showPackageVersionsToUpdate = (packages: Array<Package>): void => {
	const outputLines = new Array<string>();
	for (const { packagePack, packageView } of packages) {
		if (
			packagePack &&
			packageView &&
			packagePack.version === packageView.version &&
			packagePack.shasum !== packageView.dist.shasum
		) {
			outputLines.push(`${packagePack.name} ${packagePack.version} -> xxx`);
		}
	}
	if (outputLines.length === 0) {
		console.log('No package version needs to be updated.');
	} else {
		console.log('Package versions that need to be updated:');
		for (const line of outputLines) {
			console.log(line);
		}
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
};

const showOutdatedDependencies = (packages: Array<Package>): void => {
	const outputLines = new Array<string>();
	let fixOutput = '';
	const outdatedDependencyPackages = getOutdatedDependentPackages(packages);
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
		console.log('No outdated dependencies found.');
	} else {
		console.log('Outdated dependencies:');
		for (const line of outputLines) {
			console.log(line);
		}
		console.log(`\n\tFix: ${fixOutput}`);
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
};

const showUncommitedFiles = async (): Promise<void> => {
	const uncommitedFiles = await execute('git status --porcelain');
	if (uncommitedFiles) {
		console.log('Uncommited files:');
		console.log(uncommitedFiles);
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	} else {
		console.log('No uncommited files found.');
	}
};

const showPackagesToPublish = (packages: Array<Package>): void => {
	const outputLines = new Array<string>();
	let fixOutput = '';
	for (const { packagePack, packageView } of packages) {
		if (packagePack && packageView && packagePack.version !== packageView.version) {
			outputLines.push(`${packagePack.name} ${packageView.version} -> ${packagePack.version}`);
			if (fixOutput) {
				fixOutput += ' && ';
			}
			fixOutput += `npm publish --workspace ${packagePack.name} && git tag ${packagePack.name.split('/')[1]}-v${packagePack.version}`;
		}
	}
	if (outputLines.length === 0) {
		console.log('No package needs to be published.');
	} else {
		console.log('Packages that need to be published:');
		for (const line of outputLines) {
			console.log(line);
		}
		console.log(`\n\tFix: ${fixOutput} && git push --tags`);
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
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
							packagePack: undefined,
							packageView: undefined,
						};
					} else {
						let packageView: PackageView | undefined;
						try {
							packageView = JSON.parse(await execute(`npm view --json ${packageJson.name}`)) as PackageView;
						} catch (error) {
							if (error instanceof Error && error.message.includes('npm error code E404')) {
								console.error(error.message);
							} else {
								throw error;
							}
						}
						const packagePack = JSON.parse(
							await execute(`npm pack --json --dry-run --workspace ${packageJson.name}`),
						)[0] as PackagePack;
						return {
							packagePath,
							packageJson,
							packagePack,
							packageView,
						};
					}
				}),
			)
		).filter(Boolean) as Array<Package>;

		showPackages(packages);
		console.log('');
		showInvalidVersionBumps(packages);
		console.log('');
		showPackageVersionsToUpdate(packages);
		console.log('');
		showOutdatedDependencies(packages);
		console.log('');
		await showUncommitedFiles();
		console.log('');
		showPackagesToPublish(packages);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(error);
		}
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
};

main();
