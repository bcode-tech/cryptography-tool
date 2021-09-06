import { useMediaQuery } from "@chakra-ui/react";
import { encrypt, decrypt } from "eccrypto";
import crypto from "crypto";

export const usePlatformDetector = () => {
    const [isTablet] = useMediaQuery(["(max-width: 1024px)"]);
    const [isMobile] = useMediaQuery(["(max-width: 512px)"]);

    if (isMobile) {
        return "isMobile";
    } else if (isTablet) {
        return "isTablet";
    } else {
        return "isDesktop";
    }
};

export async function encryptAsymmetricData(file, pubKey) {
    try {
        let publicKey = Buffer.from(pubKey.replace("0x", ""), "hex");

        const encrypted = await encrypt(publicKey, file);
        return encrypted;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function decryptAsymmetricData(file, privKey) {
    try {
        let privateKey = Buffer.from(privKey.replace("0x", ""), "hex");

        const decrypted = await decrypt(privateKey, file);
        return decrypted;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export function symmetricEncryptData(data, hashedPassword) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        "aes-256-ctr",
        Buffer.from(hashedPassword, "hex"),
        iv,
    );

    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    encryptedData = `${iv.toString("hex")}.${encryptedData}`;

    return encryptedData;
}

export function symmetricDecryptData(rawData, hashedPassword) {
    const iv = rawData.split(".")[0];
    const data = rawData.split(".")[1];

    const decipher = crypto.createDecipheriv(
        "aes-256-ctr",
        Buffer.from(hashedPassword, "hex"),
        Buffer.from(iv, "hex"),
    );

    let decryptedData = decipher.update(data, "hex", "utf-8");
    decryptedData += decipher.final();

    return decryptedData;
}
