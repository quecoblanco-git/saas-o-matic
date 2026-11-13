const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function validateSpanishDni(dni: string): boolean {
  // Check the DNI format: 8 digits followed by 1 letter
  if (!/^\d{8}[A-Z]$/.test(dni)) {
    return false;
  }

  // Extract the numeric part
  const number = Number(dni.slice(0, 8));

  // Calculate the expected control letter
  const expectedLetter = DNI_LETTERS[number % 23];

  // Compare the expected letter with the provided letter
  return dni[8] === expectedLetter;
}

export function validateSpanishNie(nie: string): boolean {
  // Check the NIE format: X, Y or Z + 7 digits + 1 letter
  if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) {
    return false;
  }

  // Convert the initial letter into its numeric equivalent
  const prefixValues: Record<string, string> = {
    X: "0",
    Y: "1",
    Z: "2",
  };

  const prefix = prefixValues[nie[0]!]!;

  // Build the equivalent DNI number
  const number = Number(prefix + nie.slice(1, 8));

  // Calculate the expected control letter
  const expectedLetter = DNI_LETTERS[number % 23];

  // Compare the expected letter with the provided letter
  return nie[8] === expectedLetter;
}

export function validateSpanishEntityNif(nif: string): boolean {
  // Format: entity prefix + 7 digits + control character
  if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(nif)) {
    return false;
  }

  const prefix = nif[0]!;
  const digits = nif.slice(1, 8);
  const providedControl = nif[8]!;

  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[i]);

    if (i % 2 === 0) {
      // Double digits in odd positions and add their digits
      const doubled = digit * 2;
      sum += Math.floor(doubled / 10) + (doubled % 10);
    } else {
      // Add digits in even positions directly
      sum += digit;
    }
  }

  const controlDigit = (10 - (sum % 10)) % 10;
  const controlLetter = "JABCDEFGHI"[controlDigit]!;

  // These entity types require a numeric control character
  if ("ABEH".includes(prefix)) {
    return providedControl === String(controlDigit);
  }

  // These entity types require an alphabetic control character
  if ("PQSW".includes(prefix)) {
    return providedControl === controlLetter;
  }

  // Other supported entity types accept either control format
  return (
    providedControl === String(controlDigit) ||
    providedControl === controlLetter
  );
}

export function normalizeTaxId(taxId: string): string {
  return taxId.trim().toUpperCase();
}

export function validateFrenchSiren(siren: string): boolean {
  return /^\d{9}$/.test(siren);
}

export function validateGermanVatId(vatId: string): boolean {
  return /^DE\d{9}$/.test(vatId);
}
