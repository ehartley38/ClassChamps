import { Grid, Typography } from "@mui/material"
import useAuth from "../../providers/useAuth"
import { calculateLevel } from "../../utils/tools"
import ProgressBar from "@ramonak/react-progress-bar";

export const Profile = () => {
    const { user, jwt } = useAuth()
    const [level, previousLevelXp, nextLevelXp] = calculateLevel(user.experiencePoints)

    const percentage = Math.floor(((nextLevelXp - user.experiencePoints) / (nextLevelXp - previousLevelXp)) * 100)

    return (
        <>
            <Typography variant="h3" sx={{ mt: 3 }}>
                {`${user.name}'s Profile`}
            </Typography>
            {user.experiencePoints} XP
            Level {level}
            <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={10}>
                    <ProgressBar
                        completed={percentage}
                        labelAlignment="center"
                        labelColor="#ffffff"
                        transitionTimingFunction="ease"
                        animateOnRender
                    />
                </Grid>
            </Grid>

        </>
    )
}