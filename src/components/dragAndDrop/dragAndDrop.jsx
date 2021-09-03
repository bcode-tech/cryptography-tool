import React, { useMemo } from "react";

// Drag and Drop
import { useDropzone } from "react-dropzone";

// Style
import "./dragAndDrop.scss";
import { colors } from "../../imports/constants";

// i18n
import i18n from "../../imports/i18n";

const baseStyle = {
    width: "80%",
    height: "60%",
    maxWidth: "980px",
    border: "2px dashed",
    borderColor: `${colors.grey}`,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: `${colors.silver}`,
    padding: "20px",
    fontSize: "30px",
    fontWeight: 600,
    outline: "none",
    transition: "border .24s ease-in-out",
};

const activeStyle = {
    borderColor: `${colors.primary}`,
};

const acceptStyle = {
    borderColor: `${colors.primary}`,
};

const rejectStyle = {
    borderColor: `${colors.red}`,
};

const DragAndDrop = ({ onChange }) => {
    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({ noClick: true });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),

        [isDragActive, isDragReject, isDragAccept],
    );

    React.useEffect(() => {
        if (typeof acceptedFiles !== "undefined" && acceptedFiles.length > 0) {
            onChange(acceptedFiles);
        }
    }, [acceptedFiles, onChange]);

    return (
        <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>{i18n.t("dragAndDrop")}</p>
        </div>
    );
};

export default DragAndDrop;
