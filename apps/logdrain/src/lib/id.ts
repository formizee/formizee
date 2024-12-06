export const makeid = (length: number): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
