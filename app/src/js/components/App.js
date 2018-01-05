import { Component, h } from 'preact' // eslint-disable-line
import CarouselInterface from "@js/components/CarouselInterface" // eslint-disable-line
import projects from "@js/models/data"
import Post from '@js/components/Post' // eslint-disable-line

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      expandedView: null
    }
  }

  render() {
    return (
      <div>
        <CarouselInterface
          projects={projects}
          expandViewHandler={this.enableExpandedView.bind(this)}
          interval={10000}
          disableExpandedView={this.disableExpandedView.bind(this)}
        />
        { this.state.expandedView &&
          <Post expandedView={this.state.expandedView} />
        }
      </div>
    )
  }

  enableExpandedView(postText) {
    this.setState({
      expandedView: postText,
    })
  }

  disableExpandedView() {
    this.setState({
      expandedView: null,
    })
  }
}
