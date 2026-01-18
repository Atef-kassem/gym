# Photo and Video Permissions Declaration

## READ_MEDIA_IMAGES Permission

**Purpose**: This permission is required to allow users to select and upload profile pictures and images from their device gallery.

**Usage**: 
- Users can update their profile picture by selecting an image from their device gallery
- The app uses the `file_picker` package to provide a user-friendly image selection interface
- Images are only accessed when the user explicitly chooses to upload a profile picture
- The app does not access images without user interaction

**Frequency**: One-time or infrequent use - users typically update their profile picture once or very rarely

**User Benefit**: Allows users to personalize their profile with their own photos

---

## READ_MEDIA_VIDEO Permission

**Purpose**: This permission is required as part of the media access framework, but the app primarily focuses on image selection.

**Usage**:
- The permission is declared because the `file_picker` package requires it for comprehensive media access
- While the app primarily uses image selection, video access capability is included for future features
- Videos are only accessed when the user explicitly chooses to select a video file

**Frequency**: Rarely used - the app focuses on image selection for profile pictures

**User Benefit**: Provides flexibility for future features that may require video selection

---

## Technical Details

- The app uses `file_picker: ^8.0.6` package which requires these permissions
- All media access is user-initiated through explicit UI actions
- No background access to media files
- Images are processed locally and uploaded only when the user confirms

