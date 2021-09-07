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
    const publicKey = Buffer.from(pubKey, "hex");

    let encrypted = await encrypt(publicKey, Buffer.from(file));
    for (let key in encrypted) {
        encrypted[key] = encrypted[key].toString("hex");
    }

    encrypted = btoa(JSON.stringify(encrypted));

    return encrypted;
}

export async function decryptAsymmetricData(file, privKey) {
    try {
        const encrypted = JSON.parse(atob(file));
        const privateKey = Buffer.from(privKey, "hex");
        for (let key in encrypted) {
            encrypted[key] = Buffer.from(encrypted[key], "hex");
        }

        const decrypted = await decrypt(privateKey, encrypted);
        return decrypted.toString();
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
