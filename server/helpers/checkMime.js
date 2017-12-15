/**
 * check the mime-type of encoded base64 string.
 *
 * @param {string} data - the data encoded
 * @returns {boolean}
 */
export function checkMime(data) {
  const mime = data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if ((mime && mime.length) && (mime[1] === 'image/png'
      || mime[1] === 'image/jpeg' || mime[1] === 'image/tiff')) {
    return true;
  }
  return false;
}
