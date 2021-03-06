import { Component, h } from 'preact' // eslint-disable-line
import LoadMoreButton from '@js/components/LoadMoreButton' // eslint-disable-line
import CarouselArrows from '@js/components/CarouselArrows' // eslint-disable-line
import { carouselMask, detectMedia, closeIcon } from '@js/models/utils' // eslint-disable-line
import { Motion, spring } from 'react-motion' // eslint-disable-line

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

  componentDidUpdate() {
    this.resetPogressBar()
  }

  render() {
    return (
      <div class="carousel__main--container">
        <div class="carousel__main--text">

          <div class="carousel__main--wrapper">
            <div class="carousel__main--text-line">
              {!this.props.stopTimer &&
                    <CarouselArrows
                      gradient={this.props.project.gradient}
                      next={this.props.next}
                      previous={this.props.previous}
                    />
              }
              <Motion key={this.props.index} style={{}}>
                {c =>
                  <h1 data-id={this.props.index} key={c.key} class="carousel__title animated">{this.props.project.name.toUpperCase()}</h1>
                }
              </Motion>
            </div>

            {!this.props.stopTimer && <p class="carousel__description">{this.props.project.description}</p>}
            <div style="display: inline-block; margin: 0 auto;">
              {!this.props.stopTimer
                ? <LoadMoreButton
                  id={this.props.project.slug}
                  gradient={this.props.project.gradient}
                  onClickHandler={this.props.onClickHandler} >case study</LoadMoreButton>
                : <button class="btn close" onClick={this.props.onClosePost.bind(this)}>
                  {closeIcon()}
                  Close
                </button>
              }
            </div>
          </div>
        </div>

        <div class={`carousel__main--img-container ${this.props.project.slug}`} onClick={this.props.onClickHandler}>
          <Motion key={this.props.index} style={{}}>
            {c3 =>
              detectMedia(this.props.project.cover, false, c3)
            }
          </Motion>
          <div class="carousel__progress" style={{
            'animation-duration': this.props.interval + "ms",
            'animation-play-state': this.props.stopTimer ? 'paused' : 'running'
          }}></div>
        </div>
      </div>
    )
  }
}
