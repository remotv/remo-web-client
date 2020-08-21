import React from "react";

const Modal = ({ ModalHeader, ModalBody, ModalFooter, ...props }) => {
  return [
    { body: <ModalBody props={props} /> || "" },
    { header: <ModalHeader props={props} /> || "" },
    { footer: <ModalFooter props={props} /> || "" },
  ];
};

export default Modal;
