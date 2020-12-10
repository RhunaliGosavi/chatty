import config from '../../config'

export const mapStateToProps = state => {
  return {
    messages: state.messages,
    bot: `${config.bot.user}_${config.bot.name}`,
    user: state.uid,
    lastUserMessageIndex: state.lastUserMessageIndex,
  }
}
