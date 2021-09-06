import { useMediaQuery } from "@chakra-ui/react";

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

// export function mobileTruncString(isMobile, str, firstCharCount, endCharCount) {
//     if (isMobile === "isDesktop") {
//         return str;
//     }

//     return truncStringPortion(str, firstCharCount, endCharCount);
// }
