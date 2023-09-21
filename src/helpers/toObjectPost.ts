export const toObjectPost = (doc: any, userID: string | undefined | null) => {
  return doc?.toObject?.({ userID }) || null;
};
