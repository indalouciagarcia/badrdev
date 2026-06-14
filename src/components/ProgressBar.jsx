function ProgressBar({ name, percent, duration, delay }) {
  return (
    <div className="progress-charts">
      <h6 className="heading heading-h6">{name}</h6>
      <div className="progress">
        <div
          className="progress-bar wow fadeInLeft"
          data-wow-duration={duration}
          data-wow-delay={delay}
          role="progressbar"
          style={{ width: `${percent}%`, visibility: 'visible', animationDuration: duration, animationDelay: delay, animationName: 'fadeInLeft' }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span className="percent-label">{percent}%</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
