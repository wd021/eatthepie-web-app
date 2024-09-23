import { FC, useState, useEffect } from "react";
import Modal from "react-modal";
import { Close } from "@/icons";

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const Warning: FC<Props> = ({ isOpen, onRequestClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  const customStyles = {
    content: {
      // Common styles
      overflow: "visible",
      background: "#fff",
      color: "#000",
      // Conditional styles based on `isMobile`
      top: isMobile ? "0" : "50%",
      left: isMobile ? "0" : "50%",
      right: isMobile ? "0" : "auto",
      bottom: isMobile ? "0" : "auto",
      width: isMobile ? "100%" : "90%",
      maxWidth: isMobile ? "100%" : "550px",
      height: isMobile ? "100%" : "inherit",
      maxHeight: "100%",
      margin: isMobile ? "0" : "auto",
      borderRadius: isMobile ? "0" : "15px",
      transform: isMobile ? "none" : "translate(-50%, -50%)",
      border: "none",
      padding: "0",
      display: "flex",
      flexDirection: "column" as "column",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 100,
    },
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 740);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Modal
      id="react-modal"
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className="cursor-pointer" onClick={onRequestClose}>
        <Close width={24} />
      </div>
      <div>first time warning, require accept tos</div>
    </Modal>
  );
};

export default Warning;
