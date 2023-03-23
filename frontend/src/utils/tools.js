
const convertMilliseconds = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

// Calculate level from XP
const calculateLevel = (xp) => {
    let level = 1
    let xpThreshold = 100
    
    while (xp >= xpThreshold) {
        console.log(`Level ${level + 1} is ${xpThreshold} XP`)
        level ++
        xpThreshold += 100 + (level - 2) * 200
    }
    
    const previousLevelXp = xpThreshold - (100 + (level - 2) * 200)
    const nextLevelXp = xpThreshold 
    
    return [level, previousLevelXp, nextLevelXp]

} 

// Level 2 is 100 XP
// Level 3 is 200 XP
// Level 4 is 500 XP
// Level 5 is 1000 XP
// Level 6 is 1700 XP
// Level 7 is 2600 XP

module.exports = { convertMilliseconds, calculateLevel }