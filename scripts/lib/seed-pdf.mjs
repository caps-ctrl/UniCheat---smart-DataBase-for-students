// Jednostronicowy PDF bez dodatkowych zaleznosci. Wbudowana czcionka Helvetica
// uzywa tekstu ASCII; polskie nazwy w tresci sa transliterowane.
export function createSeedPdf({ title, subject, channel, fileName }) {
  const ascii = (value) => String(value).replaceAll("ł", "l").replaceAll("Ł", "L")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, "?");
  const escape = (value) => ascii(value).replace(/[\\()]/g, "\\$&");
  const lines = [
    "uniCheat - material testowy", "", title, "",
    `Przedmiot: ${subject}`, `Kanal: ${channel}`, `Plik: ${fileName}`, "",
    "To demonstracyjny dokument wygenerowany przez seed.",
    "Sluzy do testowania podgladu, pobierania i moderacji materialow.",
    "Nie jest rzeczywistym opracowaniem przedmiotu ani rozwiazaniem zadania.",
  ].flatMap((line) => ascii(line).match(/.{1,75}(?:\s|$)|.{1,75}/g)?.map((part) => part.trim()) ?? [""]);
  const stream = `BT /F1 12 Tf 50 785 Td 18 TL\n${lines.map((line) => `(${escape(line)}) Tj T*`).join("\n")}\nET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    `<< /Title (${escape(title)}) /Author (uniCheat seed) >>`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const startXref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  return Buffer.from(pdf);
}

