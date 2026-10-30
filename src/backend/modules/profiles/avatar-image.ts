import sharp from "sharp";
import { DomainError } from "../../common/errors";

export const maxAvatarBytes = 2097152;

// Decode a bounded single-frame image and keep only canonical, metadata-free pixels.
export async function normalizeAvatar(bytes: Uint8Array, contentType: string): Promise<Uint8Array<ArrayBuffer>> {
  try {
    const formats: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpeg",
      "image/webp": "webp",
    };
    if (!formats[contentType] || !bytes.length || bytes.length > maxAvatarBytes)
      throw new Error("invalid image");
    const image = sharp(Buffer.from(bytes), { limitInputPixels: 16777216, failOn: "warning" });
    const meta = await image.metadata();
    if (
      meta.format !== formats[contentType] ||
      !meta.width ||
      !meta.height ||
      meta.width > 4096 ||
      meta.height > 4096 ||
      (meta.pages ?? 1) !== 1
    )
      throw new Error("invalid image");
    const output = await image
      .rotate()
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();
    if (output.length > 98304) throw new Error("invalid image");
    return Uint8Array.from(output);
  } catch {
    throw new DomainError("VALIDATION", { avatar: ["invalid_image"] });
  }
}
