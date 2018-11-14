const triggerAnimation = (playhead, { startFloat, endFloat, animationCallback }, animationIndex) => {
  const end = endFloat || 1
  const animationLength = end - startFloat

  if (
    playhead > startFloat &&
    (!endFloat || playhead < endFloat)
  ) {


    const amountIntoAnimation = playhead - startFloat
    const animationPlayhead = amountIntoAnimation / animationLength

    const infiniteCircle = Math.PI * 4
    const infinitePlayheadOffset = Math.sin(animationPlayhead * infiniteCircle)


    console.log('ANIMATION %s: %s', animationIndex, animationPlayhead)

    animationCallback(animationPlayhead, infinitePlayheadOffset)
  }

}

export const triggerAnimations = (animations, playhead) => {
  // console.log('PLAYHEAD: %s', playhead)
  animations.map((animation, i) => {
    triggerAnimation(playhead, animation, i)
  })
}