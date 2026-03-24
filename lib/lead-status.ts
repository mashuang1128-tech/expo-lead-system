export const leadStatuses = [
  "New",
  "Contacted",
  "Quoted",
  "Won",
  "Lost"
] as const;

export type LeadStatus = (typeof leadStatuses)[number];
