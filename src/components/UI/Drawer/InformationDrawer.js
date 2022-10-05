import * as React from "react";
import { uiActions } from "../../../store/ui-slice";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../../utils/icons";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { orange } from "@mui/material/colors";

export default function InformationDrawer() {
  const dispatch = useDispatch();
  const drawerIsOpen = useSelector((state) => state.ui.drawerIsOpen);
  const taxIds = [
    { name: "福委統編", number: 18485364 },
    { name: "趨勢統編", number: 23310837 },
  ];
  const forms = [
    {
      name: "特約大幫手",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfLsJ2Smv_0bSyZV8iwA0xQZ8fz62CDqIDkmE540YDFosWY1w/viewform",
      icon: <HandshakeIcon color="primary" />,
    },
    {
      name: "特約許願池",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdbdcXM_t9uQEdWzvVby40wJErWAsilqvu0tha8i0BK1gFZyA/viewform",
      icon: <AutoFixHighIcon sx={{ color: orange[900] }} />,
    },
    {
      name: "問題回報",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSeBfRF4Q6R_SCuj8XklzdksCL-O7h6ibRH0k3aTwJ6ejWof_Q/viewform",
      icon: <ErrorOutlineIcon color="error" />,
    },
  ];

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    dispatch(uiActions.toggleDrawer());
  };

  const toggleTaxIdModal = (taxId) => {
    dispatch(uiActions.setCurrentTaxId(taxId));
    dispatch(uiActions.toggleTaxIdModal());
  };

  const openForm = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const list = () => (
    <Box
      className="overlay-drawer"
      sx={{ width: 300 }}
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt="" src={icons.trend_micro.file} />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            sx={{ fontWeight: "medium", fontSize: "h6.fontSize" }}
            primary="趨勢科技海洋地圖2.0"
          />
        </ListItem>
      </List>
      <Divider />
      <List>
        {taxIds.map((taxId, index) => {
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  toggleTaxIdModal(taxId);
                }}
              >
                <ListItemIcon>
                  <ReceiptLongIcon />
                </ListItemIcon>
                <ListItemText primary={`${taxId.name} ${taxId.number}`} />
              </ListItemButton>
            </ListItem>
          );
        })}
        <Divider />
        {forms.map((form, index) => {
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  openForm(form.url);
                }}
              >
                <ListItemIcon>{form.icon}</ListItemIcon>
                <ListItemText primary={form.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer anchor="left" open={drawerIsOpen} onClose={toggleDrawer}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
