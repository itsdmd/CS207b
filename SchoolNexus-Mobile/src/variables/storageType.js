let storageType = "SS";

export function set(type) {
	storageType = type;
}

export function get() {
	return storageType;
}
