import { Modal } from "react-bootstrap";

const FormModal = ({ show, handleClose, children }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default FormModal;
