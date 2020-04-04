import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper, Tabs, Tab } from "@material-ui/core";

import Status from "./pages/status";
import Fetch from "./pages/fetch";
import Parse from "./pages/parse";

export default () => {
  const [tab, setTab] = useState(0);

  return [
    <Paper>
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="统计" />
        <Tab label="爬取" />
        <Tab label="分析" />
      </Tabs>
    </Paper>,
    tab === 0 && <Status />,
    tab === 1 && <Fetch />,
    tab === 2 && <Parse />
  ];
};
