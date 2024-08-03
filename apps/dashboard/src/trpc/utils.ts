export function parseTrpcError(error: {message: string}): string {
  const messages = JSON.parse(error.message) as Array<{message: string}>;
  return (
    messages.at(0)?.message ??
    'Unknown error, please contact support@formizee.com'
  );
}
