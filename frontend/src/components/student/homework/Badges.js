import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../../../providers/useAuth";
import { BadgeCard } from "./BadgeCard";
import badgesService from "../../../services/badges";
import { UnearnedBadgeCard } from "./UnearnedBadgeCard";

export const Badges = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState([]); // This contains all badges available
  const [unearnedBadges, setUnearnedBadges] = useState([]); // This contains all badges a users earnt

  useEffect(() => {
    async function fetchData() {
      const allBadges = await badgesService.getAll();
      setAllBadges(allBadges);

      const userBadgeIds = user.awardedBadgeIds.map(
        (awardedBadge) => awardedBadge.badgeId.id
      );
      const unearnedBadges = allBadges.filter(
        (badge) => !userBadgeIds.includes(badge.id)
      );
      setUnearnedBadges(unearnedBadges);
    }
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Badges
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {/* Display awarded badges first */}
            {user.awardedBadgeIds &&
              user.awardedBadgeIds.map((awardedBadge) => (
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
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
