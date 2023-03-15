
// https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

import { useEffect, useState } from "react"

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const Timer = ({ startTime }) => {
    const timeNow = new Date()
    const storedTime = new Date(startTime)
    const [time, setTime] = useState(Math.abs(storedTime.getTime() - timeNow.getTime()))

    //console.log(Math.abs(time));

    useEffect(() => {
        const interval = setInterval(() => {
            const timeNow = new Date();
            const storedTime = new Date(startTime);
            setTime(Math.abs(storedTime.getTime() - timeNow.getTime()));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <>
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
        </>

    )
}
/*

*/