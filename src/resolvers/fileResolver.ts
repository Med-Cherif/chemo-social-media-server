import { GraphQLUpload } from "graphql-upload-minimal";
import storeUploads from "../helpers/storeUploads";
import uploadFileResolver from "../resolversMiddlewares/uploadFileResolver";

export default {
  Upload: GraphQLUpload,
  // uploadFile: (_: any, { file }: any) => {
  //   //   console.log(file);
  //   return "Hello world";
  //   // const uploadedFile = await storeUploads(file);

  //   // return uploadedFile;
  // },
  Mutation: {
    uploadFile: uploadFileResolver((parent, { file }) => {
      return;
    }),
  },
};
