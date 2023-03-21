import { Divider, ListItem, ListItemText, Typography } from "@mui/material"

export const LeaderboardItem = ({ submission }) => {

    return (
        
          
            
            <ListItem alignItems="flex-start">
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <>
                 <Typography
                    
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </>
              }
            />
          </ListItem>
    )
}

/*   <ListItem>
                <ListItemText
                    primary={submission.student}
                    secondary={
                        <>
                            <Typography>
                                {submission.timeToComplete}
                            </Typography>
                        </>
                    }
                />
            </ListItem>*/