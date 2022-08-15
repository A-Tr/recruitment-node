export function getErrorMessage(error: any) {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === 'object') {
    let message: string;
    try {
      message = JSON.stringify(error);
    } catch (parseError) {
      message = `Error parsing error`;
    }
    return message;
  }

  return error as string;
}
