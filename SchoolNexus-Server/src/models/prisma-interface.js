import { PrismaClient } from "@prisma/client";
import Chance from "chance";
const prisma = new PrismaClient();
const chance = new Chance();

import * as dotenv from "dotenv";
dotenv.config();

/** Create a new entry in a table
 * @param {string} table - The table to create the entry in
 * @param {object} fields - The fields to return the values of
 * @param {object} conditions - Additional conditions to select the entry
 * @param {boolean} returnArray - Return array of values of selected field instead of object
 *
 * @example
 * const schoolIds = await pint.find("school", { id: true }, null, true); // Returns array of all school IDs
 */
export async function find(
    table,
    fields = null,
    conditions = null,
    returnArray = false
) {
    // If returnArray is true and selectedFields has > 1 field, return error
    if (returnArray && fields !== null && Object.keys(fields).length > 1) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Cannot serialized multiple fields into array");
        }
        return false;
    }

    try {
        const query = {};
        if (fields !== null) {
            query.select = fields;
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

        if (returnArray && entries !== null && fields !== null) {
            return entries.map((entry) => entry[Object.keys(fields)[0]]);
        } else {
            return entries;
        }
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to find entries of " + table + ": " + error);
        }
        return false;
    }
}

/** Update value of a field of an entry in a table
 * @param {string} table - The table to update the entry in
 * @param {string} field - The field to update
 * @param {string} value - The new value of the field
 * @param {object} conditions - The conditions to select the entry to update. If null, update all entries of the table
 * @returns {array} - The ids of the updated entries
 */
export async function update(table, field, value, conditions = null) {
    if (field === null || field === undefined) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Invalid field name: " + field);
        }
        return null;
    }

    if (value.length === 0 || value === undefined) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Invalid value for field " +
                    field +
                    " of table " +
                    table +
                    ": " +
                    value
            );
        }
        return null;
    }

    const updatedEntryIds = [];

    try {
        const entryIds = await find(table, { id: true }, conditions, true);

        for (const id of entryIds) {
            const selectedValue = chance.pickone(value);

            await prisma[table].update({
                where: {
                    id: id,
                },
                data: {
                    [field]: selectedValue,
                },
            });

            updatedEntryIds.push(id);

            if (process.env.VERBOSITY >= 3) {
                console.log(
                    "Updated " +
                        table +
                        " " +
                        id +
                        " : " +
                        field +
                        " = " +
                        selectedValue
                );
            }
        }
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to update " + table + " entries : " + error);
        }
    } finally {
        return updatedEntryIds;
    }
}

/** Delete entries in a table
 * @param {string} table - The table to delete the entries in
 * @param {object} conditions - The conditions to select the entries to delete. If null, delete all entries of the table
 * @returns {array} - The ids of the deleted entries
 */
export async function del(table, conditions = null) {
    const deletedEntryIds = [];

    try {
        const ids = await find(table, { id: true }, conditions, true);
        if (ids === false) {
            return false;
        } else if (ids.length === 0) {
            if (process.env.VERBOSITY >= 2) {
                console.warn("Nothing to delete.");
            }
            return false;
        }

        for (const id of ids) {
            await prisma[table].delete({
                where: {
                    id: id,
                },
            });

            deletedEntryIds.push(id);
            if (process.env.VERBOSITY >= 3) {
                console.log("Deleted " + table + " " + id);
            }
        }
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error("Failed to delete " + table + " entries: " + error);
        }
    } finally {
        return deletedEntryIds;
    }
}

/**
 * Custom operation on table with query
 * @param {string} operation - The operation to perform on the table
 * @param {string} table - The table to perform the operation on
 * @param {object} query - The query to perform the operation with
 * @param {boolean} returnArray - Return array of values of selected field instead of object
 *
 * @example
 * const users = await pint.custom("findUnique", "user", {where: { id: args.id }}, false); // Returns user with ID = args.id as object
 */
export async function custom(operation, table, query, returnArray = false) {
    try {
        const result = await prisma[table][operation](query);
        if (process.env.VERBOSITY >= 3) {
            console.log(
                "Performed " +
                    operation +
                    " on " +
                    table +
                    " with query: " +
                    JSON.stringify(query)
            );
        }

        if (returnArray) {
            // Map the result to an array of strings of the values of selected field
            return result.map((entry) => entry[Object.keys(query.select)[0]]);
        } else {
            return result;
        }
    } catch (error) {
        if (process.env.VERBOSITY >= 1) {
            console.error(
                "Failed to perform " +
                    operation +
                    " on " +
                    table +
                    " entries: " +
                    error
            );
        }
        return false;
    }
}
