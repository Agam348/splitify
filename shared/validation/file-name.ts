const unsafeFileNamePattern = /[<>:"/\\|?*]/
const reservedFileNamePattern = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i

export function isSafeProjectName(projectName: string) {
  const hasControlCharacter = Array.from(projectName).some(
    (character) => character.charCodeAt(0) < 32,
  )

  return (
    projectName.length > 0 &&
    projectName.length <= 120 &&
    !hasControlCharacter &&
    !unsafeFileNamePattern.test(projectName) &&
    !reservedFileNamePattern.test(projectName) &&
    !/[. ]$/.test(projectName)
  )
}
