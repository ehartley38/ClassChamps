import { Box, Grid, Typography } from "@mui/material"
import useAuth from "../../providers/useAuth"
import { calculateLevel } from "../../utils/tools"
import ProgressBar from "@ramonak/react-progress-bar";
import CountUp from 'react-countup'
import { useEffect } from "react";
import usersService from '../../services/users'

export const Profile = () => {
    const { user } = useAuth()
    const [level, previousLevelXp, nextLevelXp] = calculateLevel(user.experiencePoints)

    const percentage = Math.floor(((user.experiencePoints - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100)
    // Need to fix level zero bug

    return (
        <>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
            >

                <Grid item xs={8}>
                    <Typography variant="h3"
                        textAlign={'center'}
                        sx={{ mt: 1 }}
                    >
                        {`@${user.username}`}
                    </Typography>
                    <Box className="circle" sx={{ mt: 5, mb: -2 }}>
                        <span className="number">{level}</span>
                    </Box>
                    <Box sx={{ textAlign: "center", mt: 0 }}>
                        <CountUp end={user.experiencePoints} duration={1} /> XP
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
            <Grid
                container
                spacing={0}
            >
                <Typography>
                    Badges
                </Typography>
            </Grid>


        </>
    )
}