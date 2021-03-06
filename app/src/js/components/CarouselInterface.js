import { Component, h } from 'preact' // eslint-disable-line
import Carousel from '@js/components/Carousel'
import Scroll from '@js/models/scroll'
import axios from 'axios'
import Hammer from 'hammerjs'
import Router from '@js/models/router'

const router = new Router({})

export default class CarouselInterface extends Carousel {
  constructor(props) {
    super(props)

    this._xhr = {
      markdown: 'src/media/markdown/'
    }
  }

  onKeyUp(e) {
    if (this.state.stopTimer) return false

    const key = e.keyCode ? e.keyCode : e.which
    switch (key) {
    case 37:
    case 40:
      this.previous()
      break
    case 38:
    case 39:
      this.next()
      break
    }
  }

  onLoadMoreHandler(e) {
    e.preventDefault()

    return axios.get(this._xhr.markdown + this.state.activeItem.file, {
      onDownloadProgress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
          return (progressEvent.loaded / progressEvent.total) * 100
        }
      },
    }).then(response => {
      this.props.expandViewHandler(response.data, this.state.index, this.onClosePost.bind(this))
      this._timer.stop()
      this.scrollManager.destroy()
      this.state.stopTimer = true
      if (this.hammer) {
        this.hammer = this.hammer.destroy()
        this.base.style = null
      }
    })
  }

  onClosePost() {
    this.props.disableExpandedView()
    this.scrollManager.start()
    this.state.stopTimer = false
    this.resetTimeout()
    this.hammer = this.hammerTime()
    router.setRoute('')
  }

  colorArrow() {
    const prev = this.base.querySelector('.carousel__arrow--prev')
    const next = this.base.querySelector('.carousel__arrow--next')

    if (!prev || !next) return false

    prev.classList.remove('active')
    next.classList.remove('active')

    const arrow = this.state.direction > 0 ? next : prev
    const colorIndex = this.state.direction > 0 ? 1 : 0
    const color = this.state.index === 0
      ? '#D81B60'
      : this.state.activeItem.gradient[colorIndex]

    arrow.classList.add('active')
    arrow.style.stroke = color

    setTimeout(() => {
      arrow.classList.remove('active')
      arrow.style.stroke = null
    }, 150)
  }

  componentDidUpdate() {
    this.state.stopTimer
      ? document.body.classList.remove('no-scroll')
      : document.body.classList.add('no-scroll')

    this.colorArrow()
  }

  componentWillUnmount() {
    window.onkeyup = null
  }

  hammerTime() {
    const hammer = new Hammer(this.base, {
      velocity: 0.8
    })

    hammer.on('swipe', e => {
      e.deltaY < 0
        ? this.next()
        : this.previous()
    })

    hammer.get('pinch').set({ enable: true });
    hammer.get('rotate').set({ enable: true });

    // Enabling vertical or all directions for the pan and swipe recognizers:

    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

    return hammer
  }

  setMenuItem(index) {
    const items = Array.from(document.body.querySelectorAll('.app__menu--item'))
    items.map( item => {
      item.classList.remove('active')
      if (parseInt(item.dataset.id) === index) {
        item.classList.add('active')
      }
    })
  }


  componentWillMount() {
    this.scrollManager = new Scroll(document.body, this.onChange.bind(this))

    this.props.sendMethods({
      next: this.next.bind(this),
      previous: this.previous.bind(this),
      onClosePost: this.onClosePost.bind(this),
      setPosition: this.setPosition.bind(this),
      scrollManager: this.scrollManager,
      onLoadMoreHandler: this.onLoadMoreHandler.bind(this)
    })
  }

  componentDidMount() {

    this.scrollManager.start()
    this.hammer = this.hammerTime()

    window.onkeyup = this.onKeyUp.bind(this)

    if (this.props.forcedFocus) {
      this.setPosition(this.props.forcedFocus)
      this.onLoadMoreHandler(document.createEvent('Event'))
        .then( () => {
          router.clearRoute()
        })
    }
  }
}

