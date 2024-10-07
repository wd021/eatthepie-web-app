export const getModalStyles = (isMobile: boolean) => ({
  content: {
    overflow: "visible",
    background: "#fff",
    color: "#000",
    top: isMobile ? "0" : "50%",
    left: isMobile ? "0" : "50%",
    right: isMobile ? "0" : "auto",
    bottom: isMobile ? "0" : "auto",
    width: isMobile ? "100%" : "90%",
    maxWidth: isMobile ? "100%" : "550px",
    height: isMobile ? "100%" : "auto",
    margin: isMobile ? "0" : "auto",
    borderRadius: isMobile ? "0" : "15px",
    transform: isMobile ? "none" : "translate(-50%, -50%)",
    border: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column" as const,
    maxHeight: isMobile ? "100%" : "90%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
});
