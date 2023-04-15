import { Box, Button, Grid, Typography } from "@mui/material";
import { calculateLevel } from "../../utils/tools";
import ProgressBar from "@ramonak/react-progress-bar";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCard } from "./homework/BadgeCard";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const Profile = () => {
  const [userData, setUserData] = useState();
  const [level, setLevel] = useState();
  const [percentage, setPercentage] = useState(0);

  const axiosPrivate = useAxiosPrivate();
  let navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const userData = await axiosPrivate.get("/users/id");
      userData.data.awardedBadgeIds.reverse();
      setUserData(userData.data);
    };
    fetchData();
  }, []);

  // Calculate level from user XP and percentage to next level
  useEffect(() => {
    if (userData) {
      const [level, previousLevelXp, nextLevelXp] = calculateLevel(
        userData.experiencePoints
      );
      const percentage = Math.floor(
        ((userData.experiencePoints - previousLevelXp) /
          (nextLevelXp - previousLevelXp)) *
          100
      );
      setLevel(level);
      setPercentage(percentage);
    }
  }, [userData]);

  if (userData)
    return (
      <>
        {/* Display username and level information */}
        <Grid container alignItems="center" justifyContent="center">
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

        {/* Display user badge info */}
        {userData.awardedBadgeIds.length === 0 ? (
          <>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography>No recenty earned badges :(</Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate("badges")}
                  sx={{ justifyContent: "center" }}
                >
                  View all badges
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid container justifyContent="center" alignItems="center">
            <Grid item container xs={12}>
              <Typography variant="h3" sx={{ color: "secondary.main", pb: 2 }}>
                Latest Badges
              </Typography>
            </Grid>
            <Grid item container spacing={4} xs={9} justifyContent="center">
              {/* Display up to three most recently awarded badges */}
              {userData.awardedBadgeIds &&
                userData.awardedBadgeIds
                  .reverse()
                  .slice(0, 3)
                  .map((awardedBadge) => (
                    <BadgeCard
                      key={awardedBadge.id}
                      awardedBadge={awardedBadge}
                      badge={awardedBadge.badgeId}
                    />
                  ))}
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" sx={{ m: 1 }}>
                <Button variant="outlined" onClick={() => navigate("badges")}>
                  View all
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </>
    );
};
