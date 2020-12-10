//@flow

import * as dispatcher from '../../dispatch'

export const mapStateToProps = state => {
  return {
    uid: state.uid.split('/')[0],
    switchPane: state.switchPane,
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(dispatcher.logout())
    },
  }
}
