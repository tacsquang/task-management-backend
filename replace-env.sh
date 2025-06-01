#!/bin/sh

# Replace placeholders in firebase-config.js
sed -i "s|\"FIREBASE_API_KEY\"|\"$FIREBASE_API_KEY\"|g" firebase-config.js
sed -i "s|\"FIREBASE_AUTH_DOMAIN\"|\"$FIREBASE_AUTH_DOMAIN\"|g" firebase-config.js
sed -i "s|\"FIREBASE_PROJECT_ID\"|\"$FIREBASE_PROJECT_ID\"|g" firebase-config.js
sed -i "s|\"FIREBASE_MESSAGING_SENDER_ID\"|\"$FIREBASE_MESSAGING_SENDER_ID\"|g" firebase-config.js
sed -i "s|\"FIREBASE_APP_ID\"|\"$FIREBASE_APP_ID\"|g" firebase-config.js
sed -i "s|\"FIREBASE_VAPID_KEY\"|\"$FIREBASE_VAPID_KEY\"|g" firebase-config.js

# Replace placeholders in firebase-messaging-sw.js
sed -i "s|process.env.FIREBASE_API_KEY|\"$FIREBASE_API_KEY\"|g" firebase-messaging-sw.js
sed -i "s|process.env.FIREBASE_AUTH_DOMAIN|\"$FIREBASE_AUTH_DOMAIN\"|g" firebase-messaging-sw.js
sed -i "s|process.env.FIREBASE_PROJECT_ID|\"$FIREBASE_PROJECT_ID\"|g" firebase-messaging-sw.js
sed -i "s|process.env.FIREBASE_MESSAGING_SENDER_ID|\"$FIREBASE_MESSAGING_SENDER_ID\"|g" firebase-messaging-sw.js
sed -i "s|process.env.FIREBASE_APP_ID|\"$FIREBASE_APP_ID\"|g" firebase-messaging-sw.js 