import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function LeaderBoardSkeleton() {
  const number = [1, 2, 3, 4, 5];
  return (
    <Stack spacing={1}>
      {number.map((val, i) => (
        <Stack direction="row" key={i} spacing={1}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={200} height={40} />
        </Stack>
      ))}
    </Stack>
  );
}

export default LeaderBoardSkeleton;
