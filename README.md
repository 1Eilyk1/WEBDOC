WEBDOC VALIDATION + UNIFIED BACKUP UPDATE

FILES TO REPLACE
1) GitHub repository WEBDOC:
   - dashboard.html
   - BALIDASHUN.html
   Keep your existing webdoc-features.js and all other frontend files unchanged.
2) Vercel repository acer-cloud-backend:
   - api/index.js

DATABASE
- No database reset is required.
- The API creates webdoc_validation_data automatically after an authenticated request.
- Existing app_users, user_documentation, activity_logs, webdoc_backups, and announcements are preserved.

WHAT THIS ADDS
- Validation page requires an existing WebDoc login session; it uses webdoc_token/webdoc_user.
- Save Validation Record to Cloud and Cloud Records list, plus JSON export of saved records.
- Per-user cloud records, templates/folders, Pre-Quote drafts, and pricing rules.
- Team template libraries are merged into each user's view and are read-only when owned by another user. Users can duplicate them into their own folders.
- Existing local templates, folders, quote drafts and price rules are imported on first cloud sync without clearing localStorage.
- Admin backups now snapshot every user's Call Documentation plus validation records, template/folder library, Pre-Quote drafts and price rules. Restore handles the new unified format and legacy documentation-only snapshots.
- Password-change-required accounts are blocked from module APIs until password change is completed.

IMPORTANT EVIDENCE-FILE LIMITATION
- Validation records currently save evidence filenames/status/rotation metadata and captured screenshot names, not the actual image/video/PDF bytes.
- The unified DB backup therefore does NOT yet contain the actual uploaded evidence files. Actual file backup requires object storage (for example Vercel Blob) and a configured storage token. Do not assume evidence files are protected by this database backup yet.

DEPLOY
1) Replace the two frontend files in WEBDOC and push to GitHub Pages.
2) Replace api/index.js in acer-cloud-backend and deploy to Vercel.
3) Do not delete or reset Neon data.
4) Sign in to WebDoc, open POP Validation, and wait for the cloud connection message. Existing local templates/folders/Pre-Quote drafts will sync to that user's cloud library.
5) Save a test validation record, export a test records JSON, then create a Unified Backup from Admin Dashboard.

TESTING NOTE
- JavaScript syntax checks passed for the backend and inline frontend scripts.
- Live Neon/Vercel/browser testing was not available here. Verify with a test account before relying on restore for production data.
