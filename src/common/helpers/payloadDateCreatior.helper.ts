export const payloadDateCreator = (date: number): string => new Date(date * 1000).toISOString();
