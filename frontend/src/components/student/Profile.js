import { Box, Button, Grid, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { calculateLevel } from "../../utils/tools";
import ProgressBar from "@ramonak/react-progress-bar";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import usersService from "../../services/users";
import { useNavigate } from "react-router-dom";
import { BadgeCard } from "./homework/BadgeCard";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [level, previousLevelXp, nextLevelXp] = calculateLevel(
    userData.experiencePoints
  );
  let navigate = useNavigate();

  const percentage = Math.floor(
    ((userData.experiencePoints - previousLevelXp) /
      (nextLevelXp - previousLevelXp)) *
      100
  );

  useEffect(() => {
    const fetchData = async () => {
      const userData = await axiosPrivate.get("/api/users/id");
      setUserData(userData.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Grid item xs={8}>
          <Typography variant="h3" textAlign={"center"} sx={{ mt: 1 }}>
            {`@${userData.username}`}
          </Typography>
          <Box className="circle" sx={{ mt: 5, mb: -2 }}>
            <span className="number">{level}</span>
          </Box>
          <Box sx={{ textAlign: "center", mt: 0 }}>
            <CountUp end={userData.experiencePoints} duration={1} /> XP
          </Box>
          <Box sx={{ mt: 1 }}>
            <ProgressBar
              completed={percentage === 100 ? 0 : percentage}
              labelAlignment="center"
              labelColor="#ffffff"
              transitionTimingFunction="ease"
              animateOnRender
              isLabelVisible={false}
            />
            <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{`Level ${level}`}</div>
              <div>{`Level ${level + 1}`}</div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
    // {user.awardedBadgeIds.length === 0 ? (
    //   <>
    //     <Grid container>
    //       <Grid item xs={12}>
    //         <Box sx={{ display: "flex", justifyContent: "center" }}>
    //           <Typography sx={{}}>No recenty earned badges :(</Typography>
    //         </Box>
    //         <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
    //           <Button variant="outlined" onClick={() => navigate("badges")}>
    //             View all badges
    //           </Button>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </>
    // ) : (
    //   <Grid container spacing={2}>
    //     <Grid item xs={12}>
    //       <Typography variant="h3" sx={{ color: "secondary.main" }}>
    //         Latest Badges
    //       </Typography>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           flexWrap: "wrap",
    //           justifyContent: "center",
    //           gap: 3,
    //           mt: 2,
    //         }}
    //       >
    //         {/* Display up to three most recently awarded badges */}
    //         {userData.awardedBadgeIds &&
    //           userData.awardedBadgeIds
    //             .reverse()
    //             .slice(0, 3)
    //             .map((awardedBadge) => (
    //               <BadgeCard
    //                 key={awardedBadge.id}
    //                 awardedBadge={awardedBadge}
    //                 badge={awardedBadge.badgeId}
    //               />
    //             ))}
    //       </Box>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Box display="flex" justifyContent="flex-end" sx={{ m: 1 }}>
    //         <Button variant="outlined" onClick={() => navigate("badges")}>
    //           View all
    //         </Button>
    //       </Box>
    //     </Grid>
    //   </Grid>
    // )}
  );
};
