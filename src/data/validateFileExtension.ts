import { ACCEPTED_EXTENSIONS } from '../config/fileFormat'

export function hasAcceptedExtension(fileName: string): boolean {
  const lowerName = fileName.toLowerCase()
  return ACCEPTED_EXTENSIONS.some((extension) => lowerName.endsWith(extension))
}
