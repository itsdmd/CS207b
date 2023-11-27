import { PrismaClient } from "@prisma/client";
import * as pint from "./prisma-interface.js";

const prisma = new PrismaClient();

export async function createScheduleEntry(scheduleEntry = {}) {}

export async function createScheduleEntries(scheduleEntries = []) {}
