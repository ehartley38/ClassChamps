import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../../../providers/useAuth";
import { BadgeCard } from "./BadgeCard";
import badgesService from "../../../services/badges";
import { UnearnedBadgeCard } from "./UnearnedBadgeCard";
import firstSteps from "../../../assets/images/firstSteps.png";

const badgeImages = {
  "641da25595a6c2ad1c5fd67c": firstSteps,
};

export const Badges = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState([]); // This contains all badges available
  const [unearnedBadges, setUnearnedBadges] = useState([]); // This contains all badges yet to be earnt by a user

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
          <Typography variant="h2" sx={{ mt: 2 }}>
            My Badges
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: 2,
            }}
          >
            {/* Display awarded badges first */}
            {user.awardedBadgeIds &&
              user.awardedBadgeIds.map((awardedBadge) => (
                <BadgeCard
                  key={awardedBadge.id}
                  awardedBadge={awardedBadge}
                  badge={awardedBadge.badgeId}
                  badgeImages={badgeImages}
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
