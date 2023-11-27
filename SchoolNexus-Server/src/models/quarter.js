import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createQuarter(quarterObj = {}) {
	// quarterObj has only 1 field called `id` with the following format: "2023-03"
	// Each school year has 4 quarters: 1st quarter (September - November), 2nd quarter (December - February), 3rd quarter (next year's March - May), 4th quarter (next year's June - August). This means that "2023-03" is the 3rd quarter of the 2023-2024 school year, which translates to March 2024 - May 2024.
	// By default the schema will handle the creation of the id field.

	if (quarterObj.id === "" || quarterObj.id === undefined) {
		try {
			await prisma.quarter.create();
			console.log("Created quarter " + quarterObj.id);
			return true;
		} catch (error) {
			console.error("Failed to create quarter: " + error);
			return false;
		}
	} else {
		try {
			await prisma.quarter.create({
				data: quarterObj,
			});
			console.log("Created quarter " + quarterObj.id);
			return true;
		} catch (error) {
			console.error("Failed to create quarter: " + error);
			return false;
		}
	}
}

export async function createQuarters(startYear = new Date().getFullYear(), endYear = new Date().getFullYear() + 5) {
	for (let year = startYear; year < endYear; year++) {
		for (let quarter = 1; quarter <= 4; quarter++) {
			await createQuarter({ id: year + "-" + quarter.toString().padStart(2, "0") });
		}
	}
}
