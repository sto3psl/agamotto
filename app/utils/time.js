function addLeadingZero(number) {
  return number.toString().padStart(2, '0')
}

export function formatTimeDifference(differenceInSeconds) {
  const hours = Math.floor(differenceInSeconds / 3600)
  const hoursInSeconds = hours * 3600

  const minutes = Math.floor((differenceInSeconds - hoursInSeconds) / 60)
  const minutesInSeconds = minutes * 60

  const seconds = differenceInSeconds - hoursInSeconds - minutesInSeconds

  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`
}
