export const phoneValidator = (_: any, { valid }: any) => {
    if (valid) {
      return Promise.resolve();
    }
    return Promise.reject("Numéro de téléphone invalide");
  };