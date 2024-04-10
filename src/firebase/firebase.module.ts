import { Module } from '@nestjs/common';
import {
  AUTH_PROVIDER_X509_CERT_URL,
  AUTH_URI,
  CLIENT_EMAIL,
  CLIENT_ID,
  CLIENT_X509_CERT_URL,
  PRIVATE_KEY,
  PRIVATE_KEY_ID,
  PROJECT_ID,
  TOKEN_URI,
  TYPE,
  UNIVERSE_DOMAIN,
} from 'src/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';
const { privateKey } = JSON.parse(PRIVATE_KEY);
export const firebaseProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () => {
    const firebaseConfig = {
      type: TYPE,
      project_id: PROJECT_ID,
      private_key_id: PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: CLIENT_EMAIL,
      client_id: CLIENT_ID,
      auth_uri: AUTH_URI,
      token_uri: TOKEN_URI,
      auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: CLIENT_X509_CERT_URL,
      universe_domain: UNIVERSE_DOMAIN,
    } as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: `gs://${PROJECT_ID}.appspot.com`,
    });
  },
};
@Module({
  imports: [],
  providers: [firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
