export const mapStateToProps = state => {
  return {
    suggestedQuestions: state.suggestedQuestions,
    favouriteQuestions: state.favouriteQuestions,
  }
}
