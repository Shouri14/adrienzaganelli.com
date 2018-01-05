import { Component, h } from 'preact' // eslint-disable-line
import LoadMoreButton from '@js/components/LoadMoreButton' // eslint-disable-line
import CarouselArrows from '@js/components/CarouselArrows' // eslint-disable-line

export default class HeroProject extends Component {
  // verry dirty
  resetPogressBar() {
    const oldProgressBar = Array.from(this.base.querySelectorAll('.carousel__progress'))
    if (!oldProgressBar.length) return

    const newProgressBar = oldProgressBar[0].cloneNode(true)
    const parent = oldProgressBar[0].parentNode
    oldProgressBar.map(p => p.remove())
    parent.appendChild(newProgressBar)
  }

  componentDidMount() {
    // this.resetPogressBar()
  }

  render() {
    return (
      <div class="carousel__main--container">
        <div class="carousel__main--text">
          {!this.props.stopTimer &&
            <CarouselArrows
              next={this.props.next}
              previous={this.props.previous}
            />
          }
          {this.props.stopTimer &&
            <button class="btn" onClick={this.props.onClosePost}>EXIIIIIIIIIIT</button>
          }

          <h1>{this.props.project.name}</h1>
          <p>Pulsar one is a game where the story evolves depending on your choices, you are the chosen one who have to save the world, The game is in French.</p>

          <div style="display: inline-block">
            {!this.props.stopTimer && <LoadMoreButton onClickHandler={this.props.onClickHandler} />}
            <div class="carousel__progress" style={{
              'animation-duration': this.props.interval + "ms",
              'animation-play-state': this.props.stopTimer ? 'paused' : 'running'
            }}></div>
          </div>

        </div>

        <div class="carousel__main--img">
          <img src="https://www.market-me.fr/assets/become-seller/img/home.png" />
        </div>
      </div>
    )
  }
}