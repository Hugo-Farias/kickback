export function deleteFromObject(keyPart: string, obj: object) {
  for (const k in obj) {
    if (~k.indexOf(keyPart)) {
      delete obj[k];
    }
  }
}
