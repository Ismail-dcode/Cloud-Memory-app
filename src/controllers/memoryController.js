const crypto = require("crypto");
const memoryService = require("../services/memoryService");
const { uploadToS3, deleteFromS3, getPhotoUrl } = require("../services/s3Service");
const { isAllowedImage } = require("../utils/fileValidation");

const MAX_PHOTOS = 5;

async function withPhotoUrls(memory) {
    const photos = await Promise.all(
        (memory.photos || []).map(async (key) => ({
            key,
            url: await getPhotoUrl(key)
        }))
    );

    return { ...memory, photos };
}

async function create(req, res) {
    try {
        const { title, thought, place, date } = req.body || {};
        const files = req.files || [];

        if (!title || !thought || !place || !date) {
            return res.status(400).json({ error: "Title, thought, place, and date are required" });
        }

        if (files.length > MAX_PHOTOS) {
            return res.status(400).json({ error: `Maximum ${MAX_PHOTOS} photos allowed` });
        }

        for (const file of files) {
            if (!isAllowedImage(file)) {
                return res.status(400).json({ error: "Only JPEG, PNG, and WebP images are allowed" });
            }
        }

        const memoryId = crypto.randomUUID();

        const photoKeys = [];

        for (const file of files) {
            const key = `users/${req.userId}/memories/${memoryId}/${Date.now()}-${file.originalname}`;

            await uploadToS3({ key, body: file.buffer, contentType: file.mimetype });

            photoKeys.push(key);
        }

        const now = new Date().toISOString();

        const memory = await memoryService.createMemory({
            userId: req.userId,
            memoryId,
            title,
            thought,
            place,
            date,
            photos: photoKeys,
            createdAt: now,
            updatedAt: now
        });

        res.status(201).json(await withPhotoUrls(memory));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create memory" });
    }
}

async function list(req, res) {
    try {
        const memories = await memoryService.listMemories(req.userId);

        memories.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        res.json(await Promise.all(memories.map(withPhotoUrls)));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to load memories" });
    }
}

async function getOne(req, res) {
    try {
        const memory = await memoryService.getMemory(req.userId, req.params.id);

        if (!memory) {
            return res.status(404).json({ error: "Memory not found" });
        }

        res.json(await withPhotoUrls(memory));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to load memory" });
    }
}

async function update(req, res) {
    try {
        const { title, thought, place, date } = req.body || {};
        const files = req.files || [];

        for (const file of files) {
            if (!isAllowedImage(file)) {
                return res.status(400).json({ error: "Only JPEG, PNG, and WebP images are allowed" });
            }
        }

        const existing = await memoryService.getMemory(req.userId, req.params.id);

        if (!existing) {
            return res.status(404).json({ error: "Memory not found" });
        }

        const newKeys = [];

        for (const file of files) {
            const key = `users/${req.userId}/memories/${req.params.id}/${Date.now()}-${file.originalname}`;

            await uploadToS3({ key, body: file.buffer, contentType: file.mimetype });

            newKeys.push(key);
        }

        const updated = await memoryService.updateMemory(req.userId, req.params.id, {
            ...(title !== undefined && { title }),
            ...(thought !== undefined && { thought }),
            ...(place !== undefined && { place }),
            ...(date !== undefined && { date }),
            photos: [...(existing.photos || []), ...newKeys]
        });

        res.json(await withPhotoUrls(updated));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update memory" });
    }
}

async function remove(req, res) {
    try {
        const memory = await memoryService.deleteMemory(req.userId, req.params.id);

        if (!memory) {
            return res.status(404).json({ error: "Memory not found" });
        }

        // Best-effort cleanup of S3 photos
        for (const key of memory.photos || []) {
            try {
                await deleteFromS3(key);
            } catch (err) {
                console.error(`Failed to delete ${key} from S3:`, err.message);
            }
        }

        res.json({ message: "Memory deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete memory" });
    }
}

module.exports = { create, list, getOne, update, remove };
