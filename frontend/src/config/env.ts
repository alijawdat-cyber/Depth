// Env Config — قراءة متغيرات البيئة بأمان
function readEnv(name: string, fallback = ''): string {
  const v = process.env[name];
  return (v === undefined || v === null) ? fallback : String(v);
}

export const env = {
  NODE_ENV: readEnv('NODE_ENV', 'development'),
  API_BASE_URL: readEnv('NEXT_PUBLIC_API_BASE_URL', ''),
};
