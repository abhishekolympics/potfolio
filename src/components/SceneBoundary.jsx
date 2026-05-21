import { Component } from 'react'

export default class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene fallback activated:', error)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 28% 24%, rgba(107,216,255,0.24), transparent 30%), radial-gradient(circle at 72% 18%, rgba(145,94,255,0.18), transparent 28%), linear-gradient(180deg, #030614, #01030c)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.48,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle, rgba(107,216,255,0.65) 1px, transparent 1px)',
            backgroundSize: '42px 42px, 83px 83px',
            backgroundPosition: '0 0, 22px 18px',
          }}
        />
      </div>
    )
  }
}
