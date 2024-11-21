import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

interface PackageJson {
	name: string;
	version: string;
	dependencies?: {
		[key: string]: string;
	};
}

interface OutdatedDependency {
	dependentName: string;
	dependencyName: string;
	oldVersion: string;
	newVersion: string;
}

const getOutdatedDependencies = (packageJsons: Array<PackageJson>): Array<OutdatedDependency> => {
	const outdatedDependencies = new Array<OutdatedDependency>();
	for (const dependency of packageJsons) {
		for (const dependent of packageJsons) {
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

const main = (): void => {
	try {
		const PACKAGES_PATH = process.env.PACKAGES_PATH;
		if (!PACKAGES_PATH) {
			throw new Error('PACKAGES_PATH is not defined');
		}
		const packageJsonPaths = fs
			.readdirSync(PACKAGES_PATH)
			.map((packageDirectory) => path.join(PACKAGES_PATH, packageDirectory, 'package.json'));
		const packageJsons = new Array<PackageJson>();
		for (const packageJsonPath of packageJsonPaths) {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
			packageJsons.push(packageJson);
		}
		let exitCode = 0;
		for (const dependency of packageJsons) {
			for (const dependent of packageJsons) {
				if (dependent.dependencies) {
					for (const [packageName, version] of Object.entries(dependent.dependencies)) {
						const cleanVersion = version.replace('^', '');
						if (dependency.name === packageName && dependency.version !== cleanVersion) {
							exitCode = 1;
							console.log(
								`${dependent.name} has outdated dependency ${packageName} ${cleanVersion} -> ${dependency.version} Fix: "npm i ${dependency.name}@${dependency.version}"`,
							);
						}
					}
				}
			}
		}
		process.exit(exitCode); // eslint-disable-line unicorn/no-process-exit
	} catch (error) {
		console.error(error);
	}
};

main();
