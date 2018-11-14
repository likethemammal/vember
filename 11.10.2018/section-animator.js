const triggerAnimation = (playhead, { startFloat, endFloat, animationCallback }, animationIndex) => {

  //startFloat .5
  //endFloat .7
  //playhead .6

  const end = endFloat || 1
  const animationLength = end - startFloat

  if (
    playhead > startFloat &&
    (!endFloat || playhead < endFloat)
  ) {


    const amountIntoAnimation = playhead - startFloat
    const animationPlayhead = amountIntoAnimation / animationLength
    console.log('ANIMATION %s: %s', animationIndex, animationPlayhead)

    animationCallback(animationPlayhead)
  }

}

export const triggerAnimations = (animations, playhead) => {
  console.log('PLAYHEAD: %s', playhead)
  animations.map((animation, i) => {
    triggerAnimation(playhead, animation, i)
  })
}