import path from "path";
import fs from "fs";

import InternalServerError from "./../errors/InternalServerError";
import asyncHandler from "./asyncHandler.helper";

const getKeyData = async (keyFileName: string) => {
  const keysDirPath: string = path.join(__dirname, "..", "..", "..", "keys");

  const keys: string[] = [];

  const [keyFiles, error] = <[string[], any]>(
    await asyncHandler(fs.promises.readdir(keysDirPath))
  );

  const keyFileNames = keyFiles.map((file) => file.split(".key")[0]);

  if (error) {
    throw new InternalServerError(error.message);
  }

  keys.push(...keyFileNames);
  if (!keys.includes(keyFileName)) {
    throw new InternalServerError(`${keyFileName} is invalid key name`);
  }

  const [key, _error] = <[Buffer, any]>(
    await asyncHandler(
      fs.promises.readFile(path.join(keysDirPath, `${keyFileName}.key`))
    )
  );

  if (_error) {
    throw new InternalServerError(_error.message);
  }

  return key.toString();
};

export default getKeyData;
