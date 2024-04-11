import { Inject } from '@nestjs/common';
import { app, storage } from 'firebase-admin';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

export class FirebaseService {
  private readonly storage = getStorage(this.firebaseApp);
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  async getStorageInstance(): Promise<storage.Storage> {
    return this.storage;
  }

  async getDownloadUrl(fileName: string): Promise<string> {
    const bucket = this.storage.bucket();

    const ref = bucket.file(fileName);
    const downloadUrl = await getDownloadURL(ref);

    return downloadUrl;
  }
}
