import { ListItem, Typography } from "@mui/material";
import { convertMilliseconds } from "../../../utils/tools";

export const LeaderboardItem = ({ index, submission }) => {
  return (
    <ListItem alignItems="flex-start">
      <Typography sx={{ mx: 3 }}>{index + 1}</Typography>
      <Typography sx={{ fontWeight: "bold", mr: 3 }}>
        {submission.student}
      </Typography>
      <Typography sx={{ textAlign: "right" }}>
        {convertMilliseconds(Date.parse(submission.timeToComplete))}
      </Typography>
    </ListItem>
  );
};
