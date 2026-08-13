/**
 * Normalize chip source so the judge can import `exportName` whether or not
 * the author wrote an `export` keyword (LeetCode-style bare function/class).
 */
export function ensureNamedExport(code: string, exportName: string): string {
  const source = code.replace(/\r\n/g, '\n');
  const name = exportName.trim();
  if (!name || !/^[A-Za-z_$][\w$]*$/.test(name)) return source;

  // Already a named export declaration.
  const namedDecl =
    new RegExp(
      `export\\s+(?:async\\s+)?(?:function|class|const|let|var)\\s+${name}\\b`,
    );
  if (namedDecl.test(source)) return source;

  // Already in an export list: export { foo } / export { foo as bar }
  if (new RegExp(`export\\s*\\{[\\s\\S]*\\b${name}\\b`).test(source)) return source;

  // `export default function Name` / `export default class Name` — binding exists locally.
  if (
    new RegExp(
      `export\\s+default\\s+(?:async\\s+)?(?:function|class)\\s+${name}\\b`,
    ).test(source)
  ) {
    return `${source.replace(/\s*$/, '')}\nexport { ${name} };\n`;
  }

  // Anonymous / expression default export — alias it.
  if (/export\s+default\b/.test(source)) {
    return `${source.replace(/\s*$/, '')}\nexport { default as ${name} };\n`;
  }

  // Bare `function Name` / `async function Name` / `class Name`
  const bareDecl = new RegExp(
    `^([ \\t]*)((?:async\\s+)?function\\s+${name}\\b|class\\s+${name}\\b)`,
    'm',
  );
  if (bareDecl.test(source)) {
    return source.replace(bareDecl, `$1export $2`);
  }

  // Bare `const|let|var Name = ...`
  const bareVar = new RegExp(`^([ \\t]*)(const|let|var)([ \\t]+${name}\\b)`, 'm');
  if (bareVar.test(source)) {
    return source.replace(bareVar, `$1export $2$3`);
  }

  // Last resort: if the binding exists at module scope, re-export it.
  return `${source.replace(/\s*$/, '')}\nexport { ${name} };\n`;
}
