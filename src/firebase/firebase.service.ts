import { Inject } from '@nestjs/common';
import { app, storage } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export class FirebaseService {
  private readonly storage = getStorage(this.firebaseApp);
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  async getStorageInstance(): Promise<storage.Storage> {
    return this.storage;
  }
}
