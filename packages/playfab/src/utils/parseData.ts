export function safeJSONParse(input: unknown) {
  let output = [];
  try {
    output = JSON.parse(typeof input === 'string' ? input : '');
  } catch (e) {
    if (e instanceof SyntaxError || e instanceof TypeError) {
      console.error(`Error parsing JSON: ${e.message}`);
    } else {
      console.error(`Unknown error: ${e}`);
    }
  }
  return output;
}

export const parseLinkedWalletResult = (data?: { [key: string]: PlayFabClientModels.UserDataRecord }): string[] => {
  return safeJSONParse(data?.LinkedWallets?.Value);
};
