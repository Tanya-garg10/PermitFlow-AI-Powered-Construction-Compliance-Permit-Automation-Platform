export function normalizeAudioPayload(audioData: string | undefined | null): { base64: string; mimeType: string } | null {
  if (!audioData || audioData === 'fallback_mock_base64_audio') return null;

  const trimmed = audioData.trim();
  if (!trimmed) return null;

  const mimeTypeMatch = trimmed.match(/^data:(audio\/[^;]+);base64,(.+)$/i);
  if (mimeTypeMatch) {
    return { base64: mimeTypeMatch[2], mimeType: mimeTypeMatch[1] };
  }

  return { base64: trimmed, mimeType: 'audio/wav' };
}
