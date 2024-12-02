import { exec } from 'node:child_process';
import { OutdatedDependentPackage, Package, PackagePack, PackageView, Version } from './types';

export const execute = (command: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout) => {
			if (error) {
				reject(error);
			}
			resolve(stdout);
		});
	});
};

export const parseVersion = (version: string): Version => {
	const [major, minor, patch] = version.split('.').map(BigInt);
	return { major, minor, patch };
};

export const isValidVersionBump = (packagePack: PackagePack, packageView: PackageView): boolean => {
	const packagePackVersion = parseVersion(packagePack.version);
	const packageViewVersion = parseVersion(packageView.version);
	return (
		(packagePackVersion.major === packageViewVersion.major + 1n &&
			packagePackVersion.minor === 0n &&
			packagePackVersion.patch === 0n) ||
		(packagePackVersion.minor === packageViewVersion.minor + 1n &&
			packagePackVersion.major === packageViewVersion.major &&
			packagePackVersion.patch === 0n) ||
		(packagePackVersion.patch === packageViewVersion.patch + 1n &&
			packagePackVersion.major === packageViewVersion.major &&
			packagePackVersion.minor === packageViewVersion.minor)
	);
};

export const getOutdatedDependentPackages = (packages: Array<Package>): Array<OutdatedDependentPackage> => {
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
