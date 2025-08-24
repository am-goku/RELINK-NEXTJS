import { BadRequestError, ServiceUnavailableError } from "../errors/ApiErrors";
import { getErrorMessage } from "../errors/errorResponse";
import cloudinary from "./cloudinary"; // your pre-configured instance

export type UploadResult = { url: string; public_id: string };

async function uploadSingle(file: File, folder: string): Promise<UploadResult> {

    // Converting the web-file into Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image", // could be "auto" if you want to handle docs/videos too
                public_id: crypto.randomUUID(), // Storing the file on Cloudinary with a unique name
            },
            (err, result) => {
                if (err || !result) return reject(err);
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        stream.end(buffer);
    });
}

export async function uploadToCloudinary(
    files: File | File[],
    folder = "uploads"
): Promise<UploadResult | UploadResult[]> {
    try {
        if (Array.isArray(files)) {
            if (files.length > 3) throw new BadRequestError("Maximum of 3 files allowed");

            const uploads = await Promise.all(files.map((file) => uploadSingle(file, folder)));

            // If array has only 1 file, return the object instead of array
            return uploads.length === 1 ? uploads[0] : uploads;
        } else {
            return uploadSingle(files, folder);
        }
    } catch (error) {
        throw new ServiceUnavailableError
            (`Cloudinary upload failed: ${getErrorMessage(error) || 'Unknown Cloudinary upload error'}`)
    }
}
