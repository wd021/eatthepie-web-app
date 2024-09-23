import { FC, useState, useEffect } from "react";
import Modal from "react-modal";
import { Close } from "@/icons";

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const Game: FC<Props> = ({ isOpen, onRequestClose }) => {
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
      flexDirection: "column" as const,
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
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div
        className="absolute top-0 right-0 w-[75px] h-[75px] flex items-center justify-center cursor-pointer"
        onClick={onRequestClose}
      >
        <Close width={24} />
      </div>
      <div className="m-12 text-center">current game modal</div>
    </Modal>
  );
};

export default Game;
