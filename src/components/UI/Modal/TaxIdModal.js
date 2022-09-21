import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { Divider } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  textAlign: "center",
};

export default function TaxIdModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.taxIdModalIsOpen);
  const taxId = useSelector((state) => state.ui.currentTaxId);
  const handleClose = () => dispatch(uiActions.toggleTaxIdModal());

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style }}>
          <Card>
            <CardContent>
              <Divider>{taxId.name}</Divider>
              <Typography variant="h3" sx={{ pt: 2 }} component="div">
                {taxId.number}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}
