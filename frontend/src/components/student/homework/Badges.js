import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BadgeCard } from "./BadgeCard";
import { UnearnedBadgeCard } from "./UnearnedBadgeCard";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const Badges = () => {
  const [allBadges, setAllBadges] = useState([]); // This contains all badges available
  const [unearnedBadges, setUnearnedBadges] = useState([]); // This contains all badges yet to be earnt by a user
  const [userData, setUserData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function fetchData() {
      const allBadgesResponse = await axiosPrivate.get("/badges");
      const allBadges = allBadgesResponse.data;

      const userResponse = await axiosPrivate.get("/users/id");
      const userData = userResponse.data;

      const userBadgeIds = userData.awardedBadgeIds.map(
        (awardedBadge) => awardedBadge.badgeId.id
      );
      const unearnedBadges = allBadges.filter(
        (badge) => !userBadgeIds.includes(badge.id)
      );

      setAllBadges(allBadges);
      setUserData(userData);
      setUnearnedBadges(unearnedBadges);
    }
    fetchData();
  }, []);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sx={{ py: 2 }}>
          <Typography variant="h2" sx={{ color: "secondary.main", mt: 2 }}>
            My Badges
          </Typography>
        </Grid>
        <Grid item container xs={9} spacing={4} justifyContent="center">
          {/* Display awarded badges first */}
          {userData.awardedBadgeIds &&
            userData.awardedBadgeIds.map((awardedBadge) => (
              <BadgeCard
                key={awardedBadge.id}
                awardedBadge={awardedBadge}
                badge={awardedBadge.badgeId}
              />
            ))}

          {/* Then display missing badges */}
          {unearnedBadges &&
            unearnedBadges.map((badge) => (
              <UnearnedBadgeCard key={badge.id} badge={badge} />
            ))}
        </Grid>
      </Grid>
    </>
  );
};
