function ProgressBar({progress}) {
  return (
  <div className="outer-bar">
    <div 
    className="inner-bar">
      style{{width: `${progress}%`, backgroundColor: 'blue'}}
    </div>
  </div>
)}

export default ProgressBar
