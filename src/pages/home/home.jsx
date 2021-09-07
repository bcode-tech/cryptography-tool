// Libraries
import React, { useState } from "react";
// import CryptoJS from "crypto-js";
import {
    Button,
    Text,
    Image,
    Box,
    Textarea,
    Input,
    // Select,
    useToast,
    Tooltip,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import eccrypto from "eccrypto";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../../redux/actions";

//Components
// import DoubleSwitch from "../../components/doubleSwitch/doubleSwitch";   //TODO uncomment when file encrypt is finished
// import DragAndDrop from "../../components/dragAndDrop/dragAndDrop";  //TODO uncomment when file encrypt is finished
import i18n from "../../imports/i18n";

// Imports
import {
    usePlatformDetector,
    symmetricEncryptData,
    symmetricDecryptData,
    encryptAsymmetricData,
    decryptAsymmetricData,
} from "../../imports/utils";
import { VERSION } from "../../imports/config";

//style
import "./home.scss";

let url = "/images/logo-bcode-white.png",
    link = "https://bcode.cloud",
    marginPowered = "10px";

function Home(props) {
    const { theme, changeTheme } = props;
    const toast = useToast();
    // const [fileName, setFileName] = useState(false);    //TODO uncomment when file encrypt is finished
    // const [type, setType] = useState(true); //TODO change to 'false' when file encrypt is finished
    const [isAsymmetric, setIsAsymmetric] = useState(false);
    const [encryptText, setEncryptText] = useState("");
    const [decryptText, setDecryptText] = useState("");
    //  const [encryptKey, setEncryptKey] = useState("");
    //  const [decryptKey, setDecryptKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [result, setResult] = useState(null);

    const selectTheme = () => {
        changeTheme(theme === "light" ? "dark" : "light");
    };

    // const loadFile = async file => {     //TODO uncomment when file encrypt is finished
    //     let reader = new FileReader();

    //     reader.onload = function (event) {
    //         const wordArray = CryptoJS.lib.WordArray.create(
    //             event.target.result,
    //         );

    //         setGeneratedHash(
    //             CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex),
    //         );
    //     };

    //     reader.readAsArrayBuffer(file);

    //     setFileName(file.name);
    // };

    // useEffect(() => {
    //     setFileName(false);
    //     setText("");
    // }, [type]);

    const platform = usePlatformDetector();

    const boxStyle = {
        display: "flex",
        alignItems: "center",
    };

    // const openFile = () => {     //TODO uncomment when file encrypt is finished
    //     document.getElementById("input_file").click();
    // };

    const handleCryptographyMode = () => {
        setIsAsymmetric(prev => !prev);
        setEncryptText("");
        setDecryptText("");
        //  setDecryptKey("");
        //  setEncryptKey("");
        setPrivateKey("");
        setPublicKey("");
        setResult(null);
    };

    /* const handleSelectKeys = e => {
        const { value, id } = e.target;

        if (id === "encrypt") {
            setEncryptKey(value);
        } else if (id === "decrypt") {
            setDecryptKey(value);
        }
    }; */

    const handleText = e => {
        const { value, id } = e.target;

        if (id === "encryptText") {
            setEncryptText(value);
        } else if (id === "decryptText") {
            setDecryptText(value);
        }
    };

    const handleToast = (status, type) => {
        const id = status + type;

        if (!toast.isActive(id)) {
            toast({
                id,
                status,
                title: i18n.t(`${status}_${type}_message`),
                description: i18n.t(`${status}_message`),
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const mobileScrollToResult = () => {
        if (platform === "isMobile") {
            const resultElement = document.getElementById("result");
            resultElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleEncryptSymmetric = () => {
        if (encryptText !== "" && privateKey !== "") {
            try {
                const encryptedMessage = symmetricEncryptData(
                    encryptText,
                    privateKey,
                );
                setResult({ type: "encrypt", text: encryptedMessage });
                mobileScrollToResult();
                handleToast("success", "encrypt");
            } catch (error) {
                console.log(error);
                handleToast("error", "encrypt");
            }
        } else {
            handleToast("error", "encrypt");
        }
    };

    const handleDecryptSymmetric = () => {
        if (decryptText !== "" && privateKey !== "") {
            try {
                const decryptedMessage = symmetricDecryptData(
                    decryptText,
                    privateKey,
                );

                setResult({ type: "decrypt", text: decryptedMessage });
                mobileScrollToResult();
                handleToast("success", "decrypt");
            } catch (error) {
                console.log(error);
                handleToast("error", "decrypt");
            }
        } else {
            handleToast("error", "decrypt");
        }
    };

    const handleEncryptAsymmetric = async () => {
        if (
            encryptText !== "" &&
            privateKey !== "" &&
            publicKey !== "" /*&&
            encryptKey !== ""*/
        ) {
            try {
                const encryptedResult = await encryptAsymmetricData(
                    encryptText,
                    publicKey,
                );

                setResult({
                    type: "encrypt",
                    text: encryptedResult,
                });
                mobileScrollToResult();
                handleToast("success", "encrypt");
            } catch (error) {
                handleToast("error", "encrypt");
            }
        } else {
            handleToast("error", "encrypt");
        }
    };

    const handleDecryptAsymmetric = async () => {
        if (
            decryptText !== "" &&
            privateKey !== "" &&
            publicKey !== "" /*&&
            decryptKey !== ""*/
        ) {
            try {
                const decryptedResult = await decryptAsymmetricData(
                    decryptText,
                    privateKey,
                );

                setResult({ type: "decrypt", text: decryptedResult });
                mobileScrollToResult();
                handleToast("success", "decrypt");
            } catch (error) {
                handleToast("error", "decrypt");
            }
        } else {
            handleToast("error", "decrypt");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result.text);

        if (!toast.isActive("copiedToClipboard")) {
            toast({
                id: "copiedToClipboard",
                status: "success",
                title: i18n.t("copied_on_clipboard"),
                duration: 4000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const generatePrivateKey = () => {
        const newPrivateKey = eccrypto.generatePrivate();
        setPrivateKey(newPrivateKey.toString("hex"));
    };

    const generatePairKey = () => {
        const newPrivateKey = eccrypto.generatePrivate();
        const newPublicKey = eccrypto.getPublic(newPrivateKey);

        setPrivateKey(newPrivateKey.toString("hex"));
        setPublicKey(newPublicKey.toString("hex"));
    };

    return (
        <Box className="home" bg={`${theme}.bg`}>
            <Box bg={`${theme}.topbar`} className={"topbar"}>
                <Text
                    color={`${theme}.logo`}
                    className={"title"}
                    onClick={() => {
                        window.open("https://bcode.cloud");
                    }}
                >
                    {i18n.t("bcode")}
                </Text>
                {platform !== "isMobile" && (
                    <Box className="selector">
                        <Button
                            className={`mode ${isAsymmetric ? "" : "active"}`}
                            borderRadius={0}
                            onClick={handleCryptographyMode}
                        >
                            {i18n.t("symmetric")}
                        </Button>
                        <Box className="divider"></Box>
                        <Button
                            className={`mode ${isAsymmetric ? "active" : ""}`}
                            borderRadius={0}
                            onClick={handleCryptographyMode}
                        >
                            {i18n.t("asymmetric")}
                        </Button>
                    </Box>
                )}
                {theme === "light" ? (
                    <MoonIcon
                        w={6}
                        h={6}
                        color={`${theme}.colorSelector`}
                        onClick={selectTheme}
                        className="icon"
                    />
                ) : (
                    <SunIcon
                        w={6}
                        h={6}
                        color={`${theme}.colorSelector`}
                        onClick={selectTheme}
                        className="icon"
                    />
                )}
            </Box>
            {/* <DoubleSwitch
                leftValue={i18n.t("file")}
                rightValue={i18n.t("text")}
                value={type}
                onChange={setType}
                theme={theme}
            /> */}
            {platform === "isMobile" && (
                <Box className="selector">
                    <Button
                        className={`mode ${isAsymmetric ? "" : "active"}`}
                        borderRadius={0}
                        onClick={handleCryptographyMode}
                    >
                        {i18n.t("symmetric")}
                    </Button>
                    <Box className="divider"></Box>
                    <Button
                        className={`mode ${isAsymmetric ? "active" : ""}`}
                        borderRadius={0}
                        onClick={handleCryptographyMode}
                    >
                        {i18n.t("asymmetric")}
                    </Button>
                </Box>
            )}
            <Box className="titleContainer">
                <Box className="title">
                    <Text color={`${theme}.text`}>
                        {i18n.t("encrypt_text")}
                    </Text>
                </Box>
            </Box>
            {!isAsymmetric ? (
                <Box className="container">
                    <Box className="symmetric">
                        <Box className="inputKeyContainer">
                            <Input
                                className="inputKey"
                                placeholder={i18n.t("secret_key")}
                                value={privateKey}
                                onChange={e => setPrivateKey(e.target.value)}
                                color={`${theme}.text`}
                            />
                            <Button
                                bg={`${theme}.button`}
                                className="generateKeyBtn"
                                onClick={generatePrivateKey}
                            >
                                {i18n.t("generate")}
                            </Button>
                        </Box>
                        <Box className={"mainarea"}>
                            <Text className="title">{i18n.t("encrypt")}</Text>
                            <Textarea
                                value={encryptText}
                                onChange={handleText}
                                placeholder={i18n.t("insert_text")}
                                size="lg"
                                className={"textarea"}
                                color={`${theme}.textAreaColor`}
                                id="encryptText"
                            />
                            <Button
                                bg={`${theme}.button`}
                                size="lg"
                                className="textHashButton"
                                onClick={handleEncryptSymmetric}
                            >
                                {i18n.t("encrypt")}
                            </Button>
                        </Box>
                        <Box className={"mainarea"}>
                            <Text className="title">{i18n.t("decrypt")}</Text>
                            <Textarea
                                value={decryptText}
                                onChange={handleText}
                                placeholder={i18n.t("insert_text")}
                                size="lg"
                                className={"textarea"}
                                color={`${theme}.textAreaColor`}
                                id="decryptText"
                            />
                            <Button
                                bg={`${theme}.button`}
                                size="lg"
                                className="textHashButton"
                                onClick={handleDecryptSymmetric}
                            >
                                {i18n.t("decrypt")}
                            </Button>
                        </Box>
                    </Box>
                    {result ? (
                        result.type === "encrypt" ? (
                            <Box className="result">
                                <Text className="title" color={`${theme}.text`}>
                                    {i18n.t("encrypted_message")}
                                </Text>
                                <Tooltip
                                    label={i18n.t("copy_to_clipboard")}
                                    hasArrow
                                    placement="top"
                                >
                                    <Text
                                        className="subtitle"
                                        color={`${theme}.text`}
                                        onClick={copyToClipboard}
                                        id="result"
                                    >
                                        {result.text}
                                    </Text>
                                </Tooltip>
                            </Box>
                        ) : (
                            <Box className="result">
                                <Text className="title" color={`${theme}.text`}>
                                    {i18n.t("decrypted_message")}
                                </Text>
                                <Tooltip
                                    label={i18n.t("copy_to_clipboard")}
                                    hasArrow
                                    placement="top"
                                >
                                    <Text
                                        className="subtitle"
                                        color={`${theme}.text`}
                                        onClick={copyToClipboard}
                                        id="result"
                                    >
                                        {result.text}
                                    </Text>
                                </Tooltip>
                            </Box>
                        )
                    ) : null}
                </Box>
            ) : (
                <Box className="container">
                    <Box className="asymmetric">
                        <Box className="inputKeyContainer">
                            <Box className="keys">
                                <Input
                                    className="key"
                                    placeholder={i18n.t("public_key")}
                                    onChange={e => setPublicKey(e.target.value)}
                                    color={`${theme}.text`}
                                    value={publicKey}
                                />
                                <Input
                                    className="key"
                                    placeholder={i18n.t("private_key")}
                                    onChange={e =>
                                        setPrivateKey(e.target.value)
                                    }
                                    color={`${theme}.text`}
                                    value={privateKey}
                                />
                            </Box>
                            <Button
                                bg={`${theme}.button`}
                                className="generateKeyBtn"
                                onClick={generatePairKey}
                            >
                                {i18n.t("generate")}
                            </Button>
                        </Box>
                        <Box className={"mainarea asymmetric"}>
                            <Text className="title">{i18n.t("encrypt")}</Text>
                            <Textarea
                                value={encryptText}
                                onChange={handleText}
                                placeholder={i18n.t("insert_text")}
                                size="lg"
                                className={"textarea"}
                                color={`${theme}.textAreaColor`}
                                id="encryptText"
                            />
                            {/* <Box className="selectKeyContainer">
                                <Select
                                    placeholder={i18n.t("select_key")}
                                    onChange={handleSelectKeys}
                                    id="encrypt"
                                    color={`${theme}.text`}
                                >
                                    <option value="public_key">
                                        {i18n.t("use_public_key")}
                                    </option>
                                    <option value="private_key">
                                        {i18n.t("use_private_key")}
                                    </option>
                                </Select>
                            </Box> */}
                            <Button
                                bg={`${theme}.button`}
                                size="lg"
                                className="textHashButton"
                                onClick={handleEncryptAsymmetric}
                            >
                                {i18n.t("encrypt")}
                            </Button>
                        </Box>
                        <Box className={"mainarea asymmetric"}>
                            <Text className="title">{i18n.t("decrypt")}</Text>
                            <Textarea
                                value={decryptText}
                                onChange={handleText}
                                placeholder={i18n.t("insert_text")}
                                size="lg"
                                className={"textarea"}
                                color={`${theme}.textAreaColor`}
                                id="decryptText"
                            />
                            {/* <Box className="selectKeyContainer">
                                <Select
                                    placeholder={i18n.t("select_key")}
                                    onChange={handleSelectKeys}
                                    id="decrypt"
                                    color={`${theme}.text`}
                                >
                                    <option value="public_key">
                                        {i18n.t("use_public_key")}
                                    </option>
                                    <option value="private_key">
                                        {i18n.t("use_private_key")}
                                    </option>
                                </Select>
                            </Box> */}
                            <Button
                                bg={`${theme}.button`}
                                size="lg"
                                className="textHashButton"
                                onClick={handleDecryptAsymmetric}
                            >
                                {i18n.t("decrypt")}
                            </Button>
                        </Box>
                    </Box>
                    {result ? (
                        result.type === "encrypt" ? (
                            <Box className="result">
                                <Text className="title" color={`${theme}.text`}>
                                    {i18n.t("encrypted_message")}
                                </Text>
                                <Tooltip label={i18n.t("copy_to_clipboard")}>
                                    <Text
                                        className="subtitle"
                                        color={`${theme}.text`}
                                        onClick={copyToClipboard}
                                        id="result"
                                    >
                                        {result.text}
                                    </Text>
                                </Tooltip>
                            </Box>
                        ) : (
                            <Box className="result">
                                <Text
                                    className="title"
                                    color={`${theme}.text`}
                                    placement="top"
                                >
                                    {i18n.t("decrypted_message")}
                                </Text>
                                <Tooltip
                                    label={i18n.t("copy_to_clipboard")}
                                    hasArrow
                                    placement="top"
                                >
                                    <Text
                                        className="subtitle"
                                        color={`${theme}.text`}
                                        onClick={copyToClipboard}
                                        id="result"
                                    >
                                        {result.text}
                                    </Text>
                                </Tooltip>
                            </Box>
                        )
                    ) : null}
                </Box>
            )}
            {/* {type ? (
                <Box className={"mainarea"}>
                    {/* <Text
                        color={`${theme}.text`}
                        // backgroundColor={`${theme}.textBg`}
                        className={"text"}
                    >
                        {i18n.t("encrypt_text")}
                    </Text>
                    <Textarea
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                            // debounceText(e.target.value);
                        }}
                        placeholder={i18n.t("insert_text")}
                        size="lg"
                        className={"textarea"}
                        color={`${theme}.textAreaColor`}
                    />
                    <Button
                        bg={`${theme}.button`}
                        size="lg"
                        className="textHashButton"
                        onClick={() => debounceText(text)}
                    >
                        {i18n.t("encrypt")}
                    </Button>

                    <Box
                        color={`${theme}.text`}
                        backgroundColor={`${generatedHash && theme}.textBg`}
                        className={"text hashText"}
                        fontSize={
                            platform === "isDesktop"
                                ? "20px"
                                : "isTablet"
                                ? "16px"
                                : "14px"
                        }
                        wordBreak={
                            platform === "isMobile" ? "break-all" : "unset"
                        }
                    >
                        {generatedHash && (
                            <Text fontWeight={"bold"}>{`${i18n.t(
                                "encrypt",
                            )}`}</Text>
                        )}
                        {generatedHash && (
                            <Text
                                maxWidth={
                                    platform === "isMobile"
                                        ? "300px"
                                        : platform === "isTablet" && "500px"
                                }
                            >
                                {generatedHash}
                            </Text>
                        )}
                    </Box>
                </Box>
            ) : !fileName ? (
                <Box className={"mainarea"}>
                    <Text
                        color={`${theme}.text`}
                        // backgroundColor={`${theme}.textBg`}
                        className={"text"}
                    >
                        {i18n.t("encrypt_file")}
                    </Text>
                    <DragAndDrop
                        onChange={file => {
                            loadFile(file[0]);
                        }}
                        backgroundColor={`${theme}.draganddrop`}
                    />
                    <Text color={`${theme}.text`}>{i18n.t("or")}</Text>
                    <Button bg={`${theme}.button`} size="lg" onClick={openFile}>
                        <label className={"importLabel"}>
                            {i18n.t("import_file")}
                        </label>
                    </Button>
                    <input
                        id="input_file"
                        style={{ display: "none" }}
                        type="file"
                        onChange={e => {
                            loadFile(e.target.files[0]);
                        }}
                    />
                </Box>
            ) : (
                <Box className={"mainarea hash"}>
                    <Box
                        color={`${theme}.text`}
                        backgroundColor={`${theme}.textBg`}
                        className={"text hashText"}
                        fontSize={
                            platform === "isDesktop"
                                ? "20px"
                                : "isTablet"
                                ? "16px"
                                : "14px"
                        }
                    >
                        <Text fontWeight={"bold"}>{`${i18n.t(
                            "file_name",
                        )}`}</Text>
                        <Text> {fileName}</Text>
                    </Box>
                    <Box
                        color={`${theme}.text`}
                        backgroundColor={`${theme}.textBg`}
                        className={"text"}
                        fontSize={
                            platform === "isDesktop"
                                ? "20px"
                                : "isTablet"
                                ? "16px"
                                : "14px"
                        }
                        wordBreak={
                            platform === "isMobile" ? "break-all" : "unset"
                        }
                    >
                        <Text fontWeight={"bold"}>{`${i18n.t(
                            "encrypt",
                        )}`}</Text>
                        <Text>{generatedHash}</Text>
                    </Box>
                    <Button
                        bg={`${theme}.logo`}
                        size="lg"
                        onClick={() => {
                            setGeneratedHash(false);
                            setFileName(false);
                        }}
                        margin={"20px"}
                    >
                        {i18n.t("encrypt_new_file")}
                    </Button>
                </Box>
            )} */}

            <Box
                className={"footer"}
                height={platform === "isDesktop" ? "75px" : "50px"}
            >
                <Box
                    className={"in"}
                    backgroundColor={`${theme}.topbar`}
                    width={platform === "isDesktop" ? "80%" : "100%"}
                    borderTopLeftRadius={
                        platform === "isDesktop" ? "10px" : "0"
                    }
                    borderTopRightRadius={
                        platform === "isDesktop" ? "10px" : "0"
                    }
                    justifyContent={
                        platform === "isDesktop" ? "space-between" : "center"
                    }
                >
                    {platform !== "isMobile" && (
                        <Box style={{ ...boxStyle, color: "white" }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginRight: 5,
                                    color: `${
                                        theme === "light" ? "#FFF" : "#000"
                                    }`,
                                }}
                            >
                                {i18n.t("footer_version")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: `${
                                        theme === "light" ? "#FFF" : "#000"
                                    }`,
                                }}
                            >
                                {VERSION}
                            </Text>
                        </Box>
                    )}
                    <Box>
                        <a href={link} target="_blank" rel="noreferrer">
                            <Box style={boxStyle}>
                                <Text color={`${theme}.logo`}>Powered by </Text>
                                <Image
                                    src={url}
                                    h={
                                        platform === "isDesktop"
                                            ? "40px"
                                            : "25px"
                                    }
                                    marginLeft={marginPowered}
                                />
                            </Box>
                        </a>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(({ user }) => {
    return { theme: user.theme };
}, mapDispatchToProps)(Home);
