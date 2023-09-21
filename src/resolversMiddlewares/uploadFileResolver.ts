import accessNestedObject from "../helpers/accessNestedObject";
import deleteFromObject from "../helpers/deleteFromObject";
import storeUploads from "../helpers/storeUploads";

export default function uploadFileResolver(
  resolver: (parent: any, args: any, context: any, info: any) => any,
  fileKey = "file"
) {
  return async function (parent: any, args: any, context: any, info: any) {
    const uploadedFile = (await storeUploads(
      accessNestedObject(args, fileKey)
    )) as any;

    const splitedKey = fileKey.split(".");
    const key = splitedKey[splitedKey.length - 1];

    deleteFromObject(args, fileKey);

    return resolver(
      parent,
      {
        ...args,
        [key]: uploadedFile,
        [`${key}ID`]: uploadedFile?._id || null,
      },
      context,
      info
    );
  };
}
