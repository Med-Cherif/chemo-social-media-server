import { createWriteStream, unlinkSync } from "fs";
import path from "path";
import fileServices from "../services/fileService";
import { TUpload } from "../types/upload";

export default async function storeUploads(upload: Promise<TUpload> | null) {
  if (!upload) {
    return null;
  }

  const { createReadStream, filename } = await upload;
  const stream = createReadStream();
  const storedFileName = `${Date.now()}-${filename}`;
  const storedFileUrl = path.resolve("storage", storedFileName);
  const storedFilePath = `/storage/${storedFileName}`;
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(storedFileUrl);

    writeStream.on("error", (error) => {
      reject(error);
    });

    writeStream.on("finish", async () => {
      try {
        const file = await fileServices.insertFile({
          originalName: filename,
          name: storedFileName,
          url: storedFilePath,
          size: 0,
        });
        resolve(file);
      } catch (error) {
        unlinkSync(storedFileUrl);
        reject(error);
      }
    });

    writeStream.on("error", (error) => {
      unlinkSync(storedFileUrl);
      reject(error);
    });

    stream.on("error", (error) => writeStream.destroy(error));

    stream.pipe(writeStream);
  });
}
