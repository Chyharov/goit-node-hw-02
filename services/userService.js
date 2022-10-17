const { User } = require('../models');
const path = require('path');
const fs = require('fs/promises');
const { handleAvatar } = require('../helpers');

async function uploadAvatar(id, data) {
    const { path: tempDir, originalname = '' } = data;
    const [extension] = originalname.split('.').reverse();
    const newFileName = `${id}.${extension}`;
    const uploadDir = path.join(
        __dirname,
        '../',
        'public',
        'avatars',
        newFileName
    );

    await handleAvatar(`tmp/${originalname}`);

    await fs.rename(tempDir, uploadDir);

    const user = await User.findByIdAndUpdate(
        id,
        { avatarURL: path.join('avatars', newFileName) },
        { new: true }
    );

    const { password, token, ...result } = user.toObject();

    return result;
}

module.exports = {
    uploadAvatar,
};
