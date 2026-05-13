# Security Specification - An-Nur Quran

## 1. Data Invariants
- A user can only access their own profile, settings, bookmarks, and notes.
- `userId` must be immutable and match `request.auth.uid`.
- Timestamps must be server-generated.
- String sizes must be strictly bounded to prevent resource exhaustion.
- Enums (themes, bookmark types) must be strictly validated.

## 2. The "Dirty Dozen" Payloads (Deny Examples)
1. **Identity Spoofing**: Attempting to write a `User` doc with `userId` different from `request.auth.uid`.
2. **PII Leak**: Non-owner attempting to read another user's profile which might contain email.
3. **Ghost Field Injection**: Adding `isVerified: true` to a user profile to bypass system checks.
4. **ID Poisoning**: Using a 1MB string as a `bookmarkId`.
5. **Timestamp Backdating**: Providing a `createdAt` in the past instead of `request.time`.
6. **State Hijacking**: Updating `totalAyahsRead` with an extremely large negative number.
7. **Cross-User Note Read**: Authenticated user 'A' attempting to read a private Note belonging to user 'B'.
8. **Invalid Enum**: Setting `settings.theme` to "comic-sans".
9. **Massive Content**: Writing a 500KB string to a Note's `content`.
10. **Orphaned Bookmark**: Creating a bookmark for a non-existent Surah number (e.g., 200).
11. **Shadow Deletion**: Deleting another user's bookmark.
12. **Blind List Querying**: Attempting to list all bookmarks in the system without filtering by `userId`.

## 3. The Test Runner Plan
I will implement rules that ensure all the above fail.

---

# Firestore Rules Primitives

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 0. Global Safety Net
    match /{document=**} {
      allow read, write: if false;
    }

    // Primitives
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    function incoming() { return request.resource.data; }
    function existing() { return resource.data; }
    function isValidId(id) { return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); }
    function isVerified() { return isSignedIn() && request.auth.token.email_verified == true; }

    function isValidUser(data) {
      return data.keys().hasAll(['userId']) && 
             data.userId == request.auth.uid &&
             (!('email' in data) || (data.email is string && data.email.size() <= 256)) &&
             (!('displayName' in data) || (data.displayName is string && data.displayName.size() <= 100)) &&
             (!('photoURL' in data) || (data.photoURL is string && data.photoURL.size() <= 512));
    }

    function isValidBookmark(data) {
      return data.keys().hasAll(['bookmarkId', 'userId', 'type']) &&
             data.bookmarkId == request.resource.id &&
             data.userId == request.auth.uid &&
             data.type in ['ayah', 'page'] &&
             (!('surahNumber' in data) || (data.surahNumber is int && data.surahNumber >= 1 && data.surahNumber <= 114)) &&
             (!('ayahNumber' in data) || (data.ayahNumber is int)) &&
             (!('pageNumber' in data) || (data.pageNumber is int)) &&
             data.createdAt == request.time;
    }

    function isValidNote(data) {
      return data.keys().hasAll(['noteId', 'userId', 'surahNumber', 'ayahNumber', 'content', 'createdAt']) &&
             data.noteId == request.resource.id &&
             data.userId == request.auth.uid &&
             data.surahNumber is int && data.surahNumber >= 1 && data.surahNumber <= 114 &&
             data.ayahNumber is int &&
             data.content is string && data.content.size() <= 5000 &&
             data.createdAt == request.time;
    }

    // Match Blocks
    match /users/{userId} {
      allow get: if isOwner(userId);
      allow create: if isOwner(userId) && isValidUser(incoming());
      allow update: if isOwner(userId) && isValidUser(incoming()) && 
                    incoming().userId == existing().userId;
      
      match /bookmarks/{bookmarkId} {
        allow list: if isOwner(userId);
        allow get: if isOwner(userId);
        allow create: if isOwner(userId) && isValidId(bookmarkId) && isValidBookmark(incoming());
        allow update: if false; // Bookmarks are typically immutable in this app's logic
        allow delete: if isOwner(userId);
      }

      match /notes/{noteId} {
        allow list: if isOwner(userId);
        allow get: if isOwner(userId);
        allow create: if isOwner(userId) && isValidId(noteId) && isValidNote(incoming());
        allow update: if isOwner(userId) && isValidNote(incoming()) && 
                      incoming().createdAt == existing().createdAt;
        allow delete: if isOwner(userId);
      }
    }
  }
}
```
