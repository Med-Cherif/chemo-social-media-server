import { model, Schema } from "mongoose";

const FileSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: {
      transform(doc, ret, options) {
        const url = doc.url;
        // ret.url = `${"test.com"}/${url}`;
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret, options) {
        const url = doc.url;
        // ret.url = `${"test.com"}/${url}`;
        return ret;
      },
    },
    versionKey: false,
  }
);

const FileModel = model("File", FileSchema, "files");

export default FileModel;
