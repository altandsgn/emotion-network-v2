export interface MovementResult {
  x: number
  y: number
  speedX: number
  speedY: number
}

export function calculateNewPosition(
  x: number,
  y: number,
  speedX: number,
  speedY: number,
  maxWidth: number,
  maxHeight: number,
  centerX: number,
  centerY: number,
  centerRadius: number
): MovementResult {
  // Calculate new position
  let newX = x + speedX
  let newY = y + speedY
  let newSpeedX = speedX
  let newSpeedY = speedY

  // Bounce off walls
  if (newX < 0 || newX > maxWidth) {
    newSpeedX = -speedX
    newX = x + newSpeedX
  }

  if (newY < 0 || newY > maxHeight) {
    newSpeedY = -speedY
    newY = y + newSpeedY
  }

  // Calculate distance from center
  const dx = newX - centerX
  const dy = newY - centerY
  const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)

  // If too close to center, repel away
  if (distanceFromCenter < centerRadius) {
    const angle = Math.atan2(dy, dx)
    const repelForce = (centerRadius - distanceFromCenter) / centerRadius
    newSpeedX += Math.cos(angle) * repelForce
    newSpeedY += Math.sin(angle) * repelForce
    newX = x + newSpeedX
    newY = y + newSpeedY
  }

  return {
    x: newX,
    y: newY,
    speedX: newSpeedX,
    speedY: newSpeedY,
  }
} 