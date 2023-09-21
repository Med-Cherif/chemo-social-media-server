import FileModel from "../models/FileModel";

const fileService = {
  insertFile(file: any) {
    return FileModel.create(file);
  },
};

export default fileService;
