import { useState } from 'react'

const StatisticsLine = ({ text, value}) => (
  <div>
    {text} {value}
  </div>
)

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>    
    {text}  
    </button>
    )


const Statistics = (props) => {
  if (props.total === 0) {
    return(
      <div>
        No feedback given
      </div>
    )
  }
  
  return (
    <>
      <StatisticsLine text='Good' value={props.good} />
      <StatisticsLine text='Neutral' value={props.neutral} />
      <StatisticsLine text='Bad' value={props.bad} />
      <StatisticsLine text='All' value={props.total} />
      <StatisticsLine text='Average' value={props.total / 3} />
      <StatisticsLine text='Positive' value={(props.good/props.total) * 100 + ' %'} />
    </>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  let total = (bad + neutral + good)


  return (
    <div>
      <h1>Give Feedback</h1>
        <Button handleClick={() => setGood(good + 1)} text='Good' />
        <Button handleClick={() => setNeutral(neutral + 1)} text='Neutral' />
        <Button handleClick={() => setBad(bad + 1)} text='Bad' />
      <h1>Statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} total={total} /> 
    </div>
  )
}

export default App