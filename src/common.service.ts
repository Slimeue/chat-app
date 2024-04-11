import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UploadFile } from './common.types';
import { FileUpload } from 'graphql-upload';
import { FirebaseService } from './firebase/firebase.service';

@Injectable()
export class CommonService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadFile(file: FileUpload, userId: string): Promise<UploadFile> {
    const { createReadStream, filename, mimetype } = await file;

    const storage = await this.firebaseService.getStorageInstance();

    const bucket = storage.bucket();

    const fileName = `${userId}/${filename}`;
    const bucketFile = bucket.file(fileName);

    return new Promise(async (resolve, rejects) => {
      createReadStream()
        .pipe(bucketFile.createWriteStream())
        .on('finish', async () => {
          await bucket.file(fileName).makePublic();

          const downloadUrl =
            await this.firebaseService.getDownloadUrl(fileName);

          console.log(downloadUrl);

          resolve({
            url: `${downloadUrl}`,
            fileName,
            mimetype,
          });
        })
        .on('error', rejects);
    });
  }
}

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const generateSalt = async (rounds: number): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(rounds);
    return salt;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (err) {
    throw new Error(err.message);
  }
};
