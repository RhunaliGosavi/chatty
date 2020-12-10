import * as dispatcher from '../../dispatch'

export const mapStateToProps = state => {
  return {
    switchPane: state.switchPane,
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    togglePane: () => {
      dispatch(dispatcher.switchPane())
    },
  }
}
