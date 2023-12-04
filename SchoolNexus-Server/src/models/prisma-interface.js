import { PrismaClient } from "@prisma/client";
import Chance from "chance";
const prisma = new PrismaClient();
const chance = new Chance();

export async function find(table, selectedFields = null, conditions = null, returnArray = false) {
	// If returnArray is true and selectedFields has > 1 field, return error
	if (returnArray && selectedFields !== null && Object.keys(selectedFields).length > 1) {
		console.error("Cannot serialized multiple fields into array");
		return false;
	}

	try {
		const query = {};
		if (selectedFields !== null) {
			query.select = selectedFields;
		}
		if (conditions !== null) {
			query.where = conditions;
		}

		let entries = null;
		if (query.select !== undefined || query.where !== undefined) {
			entries = await prisma[table].findMany(query);
		} else {
			entries = await prisma[table].findMany();
		}

		// Else return array of strings of values of that field
		if (returnArray && entries !== null) {
			return entries.map((entry) => entry[Object.keys(selectedFields)[0]]);
		} else {
			return entries;
		}
	} catch (error) {
		console.error("Failed to find entries of " + table + ": " + error);
		return false;
	}
}

export async function update(table, dataField, data, conditions = null) {
	if (dataField === "" || dataField === undefined) {
		console.error("Invalid dataField: " + dataField);
		return null;
	}

	if (data.length === 0 || data === undefined) {
		console.error("Invalid data: " + data);
		return null;
	}

	const updatedEntryIds = [];

	try {
		const entryIds = await find(table, { id: true }, conditions, true);

		for (const id of entryIds) {
			const selectedValue = chance.pickone(data);

			await prisma[table].update({
				where: {
					id: id,
				},
				data: {
					[dataField]: selectedValue,
				},
			});

			updatedEntryIds.push(id);
			console.log("Updated " + table + " " + id + " : " + dataField + " = " + selectedValue);
		}
	} catch (error) {
		console.error("Failed to update " + table + " entries : " + error);
	} finally {
		return updatedEntryIds;
	}
}

export async function del(table, conditions = null) {
	const deletedEntryIds = [];

	try {
		const ids = await find(table, { id: true }, conditions, true);
		if (ids === false) {
			return false;
		} else if (ids.length === 0) {
			console.error("Nothing to delete.");
			return false;
		}

		for (const id of ids) {
			await prisma[table].delete({
				where: {
					id: id,
				},
			});

			deletedEntryIds.push(id);
			console.log("Deleted " + table + " " + id);
		}
	} catch (error) {
		console.error("Failed to delete " + table + " entries: " + error);
	} finally {
		return deletedEntryIds;
	}
}

export async function custom(operation, table, query, returnArray = false) {
	if (returnArray && selectedFields !== null && Object.keys(selectedFields).length > 1) {
		console.error("Cannot serialized multiple fields into array");
		return false;
	}

	try {
		const result = await prisma[table][operation](query);
		console.log("Performed " + operation + " on " + table + " with query: " + JSON.stringify(query));

		if (returnArray) {
			return result.map((entry) => entry[Object.keys(query.select)[0]]);
		} else {
			return result;
		}
	} catch (error) {
		console.error("Failed to perform " + operation + " on " + table + " entries: " + error);
		return false;
	}
}
