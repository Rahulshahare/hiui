import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '../icon'
import classNames from 'classnames'
import './style/index'

// const url = 'http://i1.mifile.cn/f/i/hiui/docs/'
class Carousel extends Component {
  constructor (props) {
    super(props)
    this.rootRef = React.createRef()
    const defaultActive = props.defaultActive
    this.state = {
      rootWidth: 0,
      showArrow: false,
      active: (defaultActive >= props.children.length || defaultActive < 0) ? 0 : defaultActive
    }
    this.timer = null
  }

  componentDidMount () {
    this.setState({
      rootWidth: this.rootRef.current.clientWidth
    }, () => {
      if (this.props.duration) {
        this.autoPage()
      }
    })
  }

  goTo (page) {
    if (page > this.props.children.length || page < 0) {
      return
    }
    this.setState({
      active: page
    })
  }
  componentWillUnmount () {
    this.timer && window.clearInterval(this.timer)
  }

  autoPage () {
    this.timer = window.setInterval(() => {
      this.preNextEvent(1)
    }, this.props.duration)
  }

  pageEvent (active) {
    this.setState({
      active
    })
  }

  preNextEvent (val) {
    let active = this.state.active + val
    if (active >= this.props.children.length) {
      active = 0
    }
    if (active < 0) {
      active = this.props.children.length + active
    }
    this.setState({
      active
    })
  }

  renderDot (type, key, index, active) {
    if (type === 'sign') {
      return <li className='hi-carousel__dot hi-carousel__dot--sign' />
    } else {
      const cls = classNames(
        'hi-carousel__dot',
        active === index && 'hi-carousel__dot--active'
      )
      return (
        <li
          className={cls}
          key={index}
          onClick={this.pageEvent.bind(this, index)}
        />
      )
    }
  }

  mouseEvent (type) {
    let showArrow = true
    if (type === 'over') {
      this.timer && window.clearInterval(this.timer)
    } else {
      showArrow = false
      this.props.duration && this.autoPage()
    }
    this.setState({showArrow})
  }
  render () {
    const { rootWidth, active, showArrow } = this.state
    const { showDots, showArrows } = this.props
    const children = React.Children.toArray(this.props.children)
    const arrowCls = classNames(
      'hi-carousel__arrows',
      showArrow && 'hi-carousel__arrows--show'
    )
    return <div
      className='hi-carousel'
      ref={this.rootRef}
      onMouseOver={this.mouseEvent.bind(this, 'over')}
      onMouseOut={this.mouseEvent.bind(this, 'out')}>
      <div
        className='hi-carousel__container'
        style={{
          width: rootWidth * children.length
        }}
      >
        {
          children.map((child, index) => {
            return React.cloneElement(child, {
              key: index,
              style: {
                position: 'relative',
                opacity: active === index ? 1 : 0,
                transition: 'opacity 300ms ease 0s',
                left: -(rootWidth * index),
                width: rootWidth,
                display: 'inline-block',
                fontSize: 24,
                ...child.props.style
              }
            })
          })
        }
      </div>
      {
        showArrows && <ul className={arrowCls}>
          <li className='hi-carousel__arrow' onClick={this.preNextEvent.bind(this, -1)}>
            <Icon name='left' />
          </li>
          <li className='hi-carousel__arrow' onClick={this.preNextEvent.bind(this, 1)}>
            <Icon name='right' />
          </li>
        </ul>
      }
      {
        showDots && <ul className='hi-carousel__dots'>
          {
            children.map((_, index) => {
              const cls = classNames('hi-carousel__dot', active === index && 'hi-carousel__dot--active')
              return <li
                className={cls}
                key={index}
                onClick={this.pageEvent.bind(this, index)}
              />
            })
          }
        </ul>
      }
    </div>
  }
}

Carousel.propTypes = {
  duration: PropTypes.number,
  onClick: PropTypes.func,
  beforeChange: PropTypes.func,
  afterChange: PropTypes.func,
  showDots: PropTypes.bool,
  showArrows: PropTypes.bool,
  defaultActive: PropTypes.number
}
Carousel.defaultProps = {
  duration: 0,
  onClick: () => {},
  beforeChange: () => {},
  afterChange: () => {},
  showDots: true,
  showArrows: true,
  defaultActive: 0
}

export default Carousel
