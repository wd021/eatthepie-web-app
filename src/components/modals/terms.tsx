import { FC } from "react";
import Modal from "react-modal";
import { useIsMobile } from "@/hooks";
import { getModalStyles } from "@/styles";
import { Close } from "@/icons";

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const Terms: FC<Props> = ({ isOpen, onRequestClose }) => {
  const isMobile = useIsMobile();
  const customStyles = getModalStyles(isMobile);

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

export default Terms;
