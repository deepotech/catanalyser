export interface AudioPhysicalFeatures {
  durationSeconds?: number;
  sampleRate?: number;
  channelCount?: number;
  peakAmplitudeEstimate?: number;
  formatDetected: string;
}

export class AudioFeatureExtractor {
  /**
   * Lightweight server-side audio header inspection.
   * Parses basic audio metadata from binary headers without heavy external native binaries.
   */
  static inspectAudioBuffer(buffer: Buffer, mimeType: string): AudioPhysicalFeatures {
    let format = "unknown";

    if (buffer.length >= 4) {
      // RIFF header for WAV
      if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        format = "wav";
      }
      // ID3 header for MP3 or MPEG sync bytes (0xFF 0xFB)
      else if (
        (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
        (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
      ) {
        format = "mp3";
      }
      // EBML header for WebM/Matroska: 1A 45 DF A3
      else if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
        format = "webm";
      }
      // OGG container: OggS (4F 67 67 53)
      else if (buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
        format = "ogg";
      }
      // MP4 / M4A ftyp header
      else if (buffer.length >= 8 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        format = "m4a";
      } else {
        format = mimeType.split("/")[1] || "audio";
      }
    }

    return {
      formatDetected: format,
    };
  }
}
