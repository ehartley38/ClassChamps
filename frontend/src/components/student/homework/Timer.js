
// https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

import { Box } from "@mui/material";
import { useEffect, useState } from "react"

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = ({ startTime, stopTimer, time, setTime }) => {

    useEffect(() => {
        if (!stopTimer) {
            const interval = setInterval(() => {
                const timeNow = new Date();
                const storedTime = new Date(startTime);
                setTime(Math.abs(storedTime.getTime() - timeNow.getTime()));
            }, 1000);

            return () => clearInterval(interval);
        }

    }, [startTime, stopTimer]);

    return (
        <>
            <Box>
                {Object.entries({
                    Days: time / DAY,
                    Hours: (time / HOUR) % 24,
                    Minutes: (time / MINUTE) % 60,
                    Seconds: (time / SECOND) % 60,
                }).map(([label, value]) => (
                    <div key={label} className="timer-col">
                        <div className="timer-box">
                            <p>{`${Math.floor(value)}`.padStart(2, "0")}</p>
                            <span className="timer-text">{label}</span>
                        </div>
                    </div>
                ))}
            </Box>
        </>

    )
}
/*

*/