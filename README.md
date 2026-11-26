# Kuwait eVisa status inquiry · single-file prototype

A dual-language (English / Arabic) demonstration of a visa-status inquiry page and a
staff console, built as one `index.html` with Tailwind CSS and vanilla JavaScript, powered
by **Firebase Firestore** for cloud persistence.

**This is a prototype for layout review and flow testing.** It is not connected to any
government system. Every emblem, seal, barcode, QR block and MRZ line is a labelled
placeholder, the download and print actions exist to check the printed look, and no real
applicant data belongs in it.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole application: markup, styles, storage, document renderer, admin console with Firebase SDK. |
| `firestore.rules` | Security rules for Firebase Firestore `kuwait_visas` collection. |
| `firebase.json` | Firebase configuration for hosting and Firestore rules. |
| `.firebaserc` | Firebase project target (`kuwait-e9964`). |
| `data/` | Bundled index and placeholder photo data. |

## Run it

Open `index.html` in a browser or serve the folder over HTTP:

```bash
# Using Python:
python -m http.server 8000
# then open http://localhost:8000/index.html

# Or using Node / npm:
npm start
```

## Two things to try first

1. **Check a reference.** The inquiry card accepts a six-character reference. Type
   `123456` or press *Use sample reference 123456* to see the electronic visa document.
2. **Open the staff console.** Navigate to `#admin` (or use the *Staff console* tab) and
   unlock it with the demo passcode `admin2026`. From there you can create, edit and
   delete records, and copy a share link for any of them.

## Links between people

Every document has a **Copy share link** action that produces:

```
https://your-host/index.html?code=XXXXXX
```

Opening that link verifies the reference automatically. `?visa=XXXXXX` works the same
way, so the link survives whatever a chat app does with the query string. When the
clipboard is blocked, the app falls back to a panel with the link already selected,
which is the path that works inside restricted in-app browsers.

## Database: Firebase Firestore

The application is connected to Firebase project **`kuwait-e9964`**:

- **Database:** Firebase Cloud Firestore
- **Collection:** `kuwait_visas`
- **Analytics:** Firebase Analytics enabled
- **Local Cache:** Fallback caching via `localStorage` ensures instantaneous UI responses and resilience.

### Firestore Rules Setup

To allow read and write operations for testing in your Firebase Console:

1. Open [Firebase Console](https://console.firebase.google.com/) -> Select **`kuwait-e9964`**.
2. Go to **Build** -> **Firestore Database** -> **Rules**.
3. Set the rules to allow prototype access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /kuwait_visas/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
4. Click **Publish**.

Or deploy rules using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

## What the console records

Reference (six characters, with a *Generate random six-digit code* action), full name in
English and Arabic, passport number, nationality, sex, date of birth, profession, visa
type, issue date, validity preset (30/60/90/180/365 days) with an editable expiry date,
and a photograph, either uploaded from the device or given as an image URL.

Nationality, profession and visa type each have a preset list that fills the English and
Arabic fields, and every filled value stays editable, so an unlisted nationality or
profession is just typed in. Professions carry a feminine Arabic form that follows the
sex field. Missing values print as `-` rather than being invented.

### Photographs

*Upload image* takes a JPG, PNG or WebP from the device, compresses it at 480 px, and stores
the image inside the record's `photo_url` field. Keeping the picture in the record means a share
link and cloud records carry the face with it without cross-origin blocks.
