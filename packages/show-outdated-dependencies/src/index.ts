import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { OutdatedDependency, Package, PackagePack, PackageView } from './types';

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

const getOutdatedDependencies = (packages: Array<Package>): Array<OutdatedDependency> => {
	const outdatedDependencies = new Array<OutdatedDependency>();
	for (const { packageJson: dependency } of packages) {
		for (const { packageJson: dependent } of packages) {
			if (dependent.dependencies) {
				for (const [packageName, version] of Object.entries(dependent.dependencies)) {
					const cleanVersion = version.replace('^', '');
					if (dependency.name === packageName && dependency.version !== cleanVersion) {
						outdatedDependencies.push({
							dependentName: dependent.name,
							dependencyName: dependency.name,
							oldVersion: cleanVersion,
							newVersion: dependency.version,
						});
					}
				}
			}
		}
	}
	return outdatedDependencies;
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
					if (!packageJson.private) {
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
		let output = new Array<string>();
		for (const { packageView, packagePack } of packages) {
			if (packageView.version === packagePack.version && packageView.dist.shasum !== packagePack.shasum) {
				output.push(`${packagePack.name} ${packagePack.version} -> xxx`);
			}
		}
		if (output.length === 0) {
			console.log('No package version needs to be updated');
		} else {
			exitCode = 1;
			console.log('Package versions that need to be updated:');
			for (const line of output) {
				console.log(line);
			}
		}

		// Show outdated dependencies
		const outdatedDependencies = getOutdatedDependencies(packages);
		output = [];
		for (const { dependentName, dependencyName, oldVersion, newVersion } of outdatedDependencies) {
			output.push(
				`${dependentName} ${dependencyName}@${oldVersion} -> ${dependencyName}@${newVersion}`,
				`\tFix: "npm i ${dependencyName}@${newVersion} --workspace ${dependentName}"`,
			);
		}
		if (output.length === 0) {
			console.log('\nNo outdated dependencies found');
		} else {
			exitCode = 1;
			console.log('\nOutdated dependencies:');
			for (const line of output) {
				console.log(line);
			}
		}

		// Show packages that need to be published
		output = [];
		for (const { packageView, packagePack } of packages) {
			if (packageView.version !== packagePack.version) {
				output.push(
					`${packagePack.name} ${packageView.version} -> ${packagePack.version}`,
					`\tFix: npm publish --workspace ${packagePack.name}`,
					`\tTag: git tag ${packagePack.name.split('/')[1]}-v${packagePack.version}`,
				);
			}
		}
		if (output.length === 0) {
			console.log('\nNo package needs to be published');
		} else {
			exitCode = 1;
			console.log('\nPackages that need to be published:');
			for (const line of output) {
				console.log(line);
			}
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
