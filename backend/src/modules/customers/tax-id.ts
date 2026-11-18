// Normaliza y valida identificadores fiscales de los países admitidos.
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function validateSpanishDni(dni: string): boolean {
  if (!/^\d{8}[A-Z]$/.test(dni)) {
    return false;
  }

  const number = Number(dni.slice(0, 8));

  // La letra de control se obtiene con el resto de dividir el número entre 23.
  const expectedLetter = DNI_LETTERS[number % 23];

  return dni[8] === expectedLetter;
}

export function validateSpanishNie(nie: string): boolean {
  if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) {
    return false;
  }

  // X, Y y Z equivalen a 0, 1 y 2 para reutilizar el cálculo de control del DNI.
  const prefixValues: Record<string, string> = {
    X: "0",
    Y: "1",
    Z: "2",
  };

  const prefix = prefixValues[nie[0]!]!;

  const number = Number(prefix + nie.slice(1, 8));

  const expectedLetter = DNI_LETTERS[number % 23];

  return nie[8] === expectedLetter;
}

export function validateSpanishEntityNif(nif: string): boolean {
  if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(nif)) {
    return false;
  }

  const prefix = nif[0]!;
  const digits = nif.slice(1, 8);
  const providedControl = nif[8]!;

  let sum = 0;

  // Se duplican posiciones alternas y se suman las cifras para calcular el control.
  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[i]);

    if (i % 2 === 0) {
      const doubled = digit * 2;
      sum += Math.floor(doubled / 10) + (doubled % 10);
    } else {
      sum += digit;
    }
  }

  const controlDigit = (10 - (sum % 10)) % 10;
  const controlLetter = "JABCDEFGHI"[controlDigit]!;

  // El prefijo determina si se admite un control numérico, alfabético o cualquiera.
  if ("ABEH".includes(prefix)) {
    return providedControl === String(controlDigit);
  }

  if ("PQSW".includes(prefix)) {
    return providedControl === controlLetter;
  }

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
