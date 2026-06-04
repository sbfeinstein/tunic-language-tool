export const supportsFileSystemAccess = () =>
  typeof window !== 'undefined' && 'showSaveFilePicker' in window
