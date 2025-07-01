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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: "15px",
          right: "15px",
          maxWidth: "450px",
          maxHeight: "225px",
          margin: "auto",
          padding: "1.6rem",
          borderRadius: "10px",
          overflow: "hidden"
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default CustomModal;
