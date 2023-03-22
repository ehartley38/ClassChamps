
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
        //console.log(`Level ${level} is ${xpThreshold} XP`)
        level ++
        xpThreshold += 100 + (level - 2) * 200
    }
    
    const previousLevelXp = xpThreshold - (100 + (level - 2) * 200)
    const nextLevelXp = xpThreshold 
    
    return [level, previousLevelXp, nextLevelXp]

} 

module.exports = { convertMilliseconds, calculateLevel }