export function getEnvFilePath() {
  return [`.env.${process.env.NODE_ENV || 'development'}`, `.env.${process.env.NODE_ENV || 'development'}.local`];
}
