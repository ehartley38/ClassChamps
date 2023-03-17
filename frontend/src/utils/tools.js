
const convertMilliseconds = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

module.exports = { convertMilliseconds }