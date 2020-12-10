// @flow
import * as React from 'react'
import './Image.css'

type Props = {
  data: {
    link: string,
    title: string,
  },
  mini: boolean,
}
type State = {}

class Image extends React.Component<Props, State> {
  render(): React.Node {
    const {
      data: { link, title },
      mini,
    } = this.props
    return (
      <div className={`Image ${mini ? '' : 'big'}`}>
        <div>
          {!mini && (
            <React.Fragment>
              {title}
              {/* This opens image in a new tab, but that is the best we can do */}
              {/* https://stackoverflow.com/questions/17527713/force-browser-to-download-image-files-on-click */}
              <button
                className="download-button"
                type="submit"
                onClick={(): mixed => window.open(link)}>
                Download image
              </button>
            </React.Fragment>
          )}
        </div>
        <img src={link} alt="image" />
        <div>{mini && title}</div>
      </div>
    )
  }
}

export default Image
