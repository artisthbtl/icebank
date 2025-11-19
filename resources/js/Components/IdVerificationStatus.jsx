import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Button, Typography, Box } from "@mui/material";
import "../../css/LoginPage.css";

export default function IdVerificationStatus({ status = "success", message, redirectLink, onReset }) {
    const isSuccess = status === "success";

    return (
        <Box className="verification-content-area status-card-container" sx={{ maxWidth: "600px", width: "100%" }}>
            {isSuccess ? (
                <CheckCircleIcon className="status-card-icon success" />
            ) : (
                <ErrorOutlineIcon className="status-card-icon error" />
            )}

            <Typography className="idv-status-title">
                {isSuccess ? "Verification Submitted" : "Something Went Wrong"}
            </Typography>

            <Typography className="status-card-message" sx={{ marginTop: "12px" }}>
                {message}
            </Typography>

            {isSuccess ? (
                <Button
                    className="status-card-button"
                    onClick={() => (window.location.href = redirectLink)}
                    sx={{ marginTop: "28px" }}
                >
                    Continue
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    className="status-card-button-try-again"
                    onClick={onReset}
                    sx={{ marginTop: "28px" }}
                >
                    Try Again
                </Button>
            )}
        </Box>
    );
}