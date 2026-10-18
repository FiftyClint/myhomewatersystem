// The subset of Cloudflare D1 this app uses. Tests run the same code against node:sqlite.
export interface Stmt {
  bind(...values: unknown[]): Stmt;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta: { changes: number } }>;
}

export interface Sql {
  prepare(query: string): Stmt;
  // Runs all statements in one transaction. All succeed or none do.
  batch(stmts: Stmt[]): Promise<{ meta: { changes: number } }[]>;
}
