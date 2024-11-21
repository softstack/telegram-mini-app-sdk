export interface PackageJson {
	name: string;
	version: string;
	private?: boolean;
	dependencies?: {
		[key: string]: string;
	};
}

export interface PackageView {
	name: string;
	version: string;
	'dist-tags': {
		latest: string;
	};
	versions: {
		[key: string]: string;
	};
	dist: {
		shasum: string;
	};
}

export interface PackagePack {
	name: string;
	version: string;
	shasum: string;
}

export interface Package {
	packagePath: string;
	packageJson: PackageJson;
	packageView: PackageView | undefined;
	packagePack: PackagePack | undefined;
}

export interface OutdatedDependency {
	dependentName: string;
	dependencyName: string;
	oldVersion: string;
	newVersion: string;
}
