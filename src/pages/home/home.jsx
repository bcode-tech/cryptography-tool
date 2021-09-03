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
    Select,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../../redux/actions";

//Components
// import DoubleSwitch from "../../components/doubleSwitch/doubleSwitch";   //TODO uncomment when file encrypt is finished
// import DragAndDrop from "../../components/dragAndDrop/dragAndDrop";  //TODO uncomment when file encrypt is finished
import i18n from "../../imports/i18n";

// Imports
import { usePlatformDetector } from "../../imports/utils";
import { VERSION } from "../../imports/config";

//style
import "./home.scss";

let url = "/images/logo-bcode-white.png",
    link = "https://bcode.cloud",
    marginPowered = "10px";

function Home(props) {
    const { theme, changeTheme } = props;

    // const [fileName, setFileName] = useState(false);    //TODO uncomment when file encrypt is finished
    // const [type, setType] = useState(true); //TODO change to 'false' when file encrypt is finished
    const [isAsymmetric, setIsAsymmetric] = useState(false);
    const [encryptText, setEncryptText] = useState("");
    const [decryptText, setDecryptText] = useState("");
    const [encryptKey, setEncryptKey] = useState("");
    const [decryptKey, setDecryptKey] = useState("");
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
        setDecryptKey("");
        setEncryptKey("");
        setResult(null);
    };

    const handleSelectKeys = e => {
        const { value, id } = e.target;

        if (id === "encrypt") {
            setEncryptKey(value);
        } else if (id === "decrypt") {
            setDecryptKey(value);
        }
    };

    const handleText = e => {
        const { value, id } = e.target;

        if (id === "encryptText") {
            setEncryptText(value);
        } else if (id === "decryptText") {
            setDecryptText(value);
        }
    };

    const handleEncryptSymmetric = () => {
        if (encryptText !== "" && privateKey !== "") {
            setResult({ type: "encrypt", text: "Result" });
        }
    };

    const handleDecryptSymmetric = () => {
        if (decryptText !== "" && privateKey !== "") {
            setResult({ type: "decrypt", text: "Result" });
        }
    };

    const handleEncryptAsymmetric = () => {
        if (
            encryptText !== "" &&
            privateKey !== "" &&
            publicKey !== "" &&
            encryptKey !== ""
        ) {
            setResult({ type: "encrypt", text: "Result" });
        }
    };

    const handleDecryptAsymmetric = () => {
        if (
            decryptText !== "" &&
            privateKey !== "" &&
            publicKey !== "" &&
            decryptKey !== ""
        ) {
            setResult({ type: "decrypt", text: "Result" });
        }
    };
    console.log(result);
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
                    BCode
                </Text>
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
            <Box className="titleContainer">
                <Box style={{ flex: 1 }}></Box>
                <Box className="title">
                    <Text color={`${theme}.text`}>
                        {i18n.t("encrypt_text")}
                    </Text>
                </Box>
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
            </Box>
            {!isAsymmetric ? (
                <Box className="container">
                    <Box className="symmetric">
                        <Box className="inputKeyContainer">
                            <Input
                                className="inputKey"
                                placeholder={i18n.t("private_key")}
                                onChange={e => setPrivateKey(e.target.value)}
                                color={`${theme}.text`}
                            />
                            <Button
                                bg={`${theme}.button`}
                                className="generateKeyBtn"
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
                                <Text className='title' color={`${theme}.text`}>{i18n.t("encrypted_message")}</Text>
                                <Text className='subtitle' color={`${theme}.text`}>{result.text}</Text>
                            </Box>
                        ) : (
                            <Box className="result">
                                <Text className='title' color={`${theme}.text`}>{i18n.t("decrypted_message")}</Text>
                                <Text className='subtitle' color={`${theme}.text`}>{result.text}</Text>
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
                                />
                                <Input
                                    className="key"
                                    placeholder={i18n.t("private_key")}
                                    onChange={e =>
                                        setPrivateKey(e.target.value)
                                    }
                                    color={`${theme}.text`}
                                />
                            </Box>
                            <Button
                                bg={`${theme}.button`}
                                className="generateKeyBtn"
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
                            <Box className="selectKeyContainer">
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
                            </Box>
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
                            <Box className="selectKeyContainer">
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
                            </Box>
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
                                <Text className='title' color={`${theme}.text`}>{i18n.t("encrypted_message")}</Text>
                                <Text className='subtitle' color={`${theme}.text`}>{result.text}</Text>
                            </Box>
                        ) : (
                            <Box className="result">
                                <Text className='title' color={`${theme}.text`}>{i18n.t("decrypted_message")}</Text>
                                <Text className='subtitle' color={`${theme}.text`}>{result.text}</Text>
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
