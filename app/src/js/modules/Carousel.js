import { Component, h } from 'preact'; // eslint-disable-line
import Timer from "@js/models/timer"
import LoadMoreButton from '@js/components/LoadMoreButton' // eslint-disable-line

export default class CarouselInterface extends Component {
  constructor(props) {
    super()

    this._timer = new Timer(this.onTimeoutHandler.bind(this), props.interval)
    this._projectsLength = props.projects.length

    this.state = {
      activeItem: props.projects[0],
      index: 0
    }
  }

  onChange(e) {
    const targetIndex = this.state.index + e.direction
    let newIndex = targetIndex

    if (targetIndex < 0) {
      newIndex = this._projectsLength - 1
    } else if (targetIndex >= this._projectsLength) {
      newIndex = 0
    }

    this.setPosition(newIndex);

    if (e.hasOwnProperty('speed')) {
      this.resetTimeout()
    }
  }

  setPosition(index) {
    if (this.props.projects.indexOf(this.props.projects[index]) === -1) {
      throw new Error(`Wrong index value sent, this.projects contains ${this.__projectsLength__} items. value sent: ${index}`)
    }

    this.setState({
      index, activeItem: this.props.projects[index]
    })
  }

  previous() {
    this.onChange({ direction: -1 })
  }

  next() {
    this.onChange({ direction: 1 })
  }

  resetTimeout() {
    this._timer.reset(this.props.interval)
  }

  onTimeoutHandler() {
    this.onChange({ direction: 1 })
  }

  render() {
    return (
      <section class="carousel">
        <header class="carousel__header">
          <nav>
            <ul class="carousel__header--menu">
              {this.props.projects.map(p => <li>{p.label || p.name}</li>)}
            </ul>
          </nav>
        </header>

        <h1>{this.state.activeItem.name}</h1>
        <LoadMoreButton onClickHandler={this.onLoadMoreHandler.bind(this)} />

        <footer>
          <a href="#" class="about">about & contact</a>
        </footer>
      </section>
    )
  }
}
