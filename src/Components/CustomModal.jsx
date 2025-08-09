import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          left: "15px",
          right: "15px",
          maxWidth: "450px",
          maxHeight: "fit-content",
          margin: "auto",
          padding: "1.6rem",
          borderRadius: "16px",
          overflow: "hidden"
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default CustomModal;
