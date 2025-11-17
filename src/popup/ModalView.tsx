import { type FC } from "react";

import { Modal } from "../component/Modal";
import { SelectModCmp } from "../component/SelectModCmp";

interface ModalViewProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalView: FC<ModalViewProps> = (props) => {
  const { setVisible } = props;

  return (
    <>
      <Modal setVisible={setVisible}>
        <SelectModCmp />
      </Modal>
    </>
  );
};
