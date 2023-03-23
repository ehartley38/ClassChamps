import { Box, Grid, Typography } from "@mui/material"
import useAuth from "../../providers/useAuth"
import { calculateLevel } from "../../utils/tools"
import ProgressBar from "@ramonak/react-progress-bar";
import CountUp from 'react-countup'

export const Profile = () => {
    const { user, jwt } = useAuth()
    const [level, previousLevelXp, nextLevelXp] = calculateLevel(user.experiencePoints)

    const percentage = Math.floor(((nextLevelXp - user.experiencePoints) / (nextLevelXp - previousLevelXp)) * 100)

    return (
        <>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={8}>
                    <Box className="circle" sx={{ mt:5, mb:-2 }}>
                        <span className="number">{level}</span>
                    </Box>
                    <Box sx={{ textAlign: "center", mt: 0}}>
                        <CountUp end={user.experiencePoints} duration={1} /> XP
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <ProgressBar
                            completed={percentage}
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
    )
}