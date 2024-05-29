import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://luto-storage.appspot.com',
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

export { db, bucket }