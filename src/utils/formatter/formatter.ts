export const currencyFormatter = (value: number | undefined): string =>
  value ? String(value).replace(".", ",") : "";

export const currencyParser = (value: string | undefined): number =>
  value ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : 0;
