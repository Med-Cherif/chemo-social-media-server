import { Stream } from "stream";

export interface TUpload {
  fieldName: string;
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
