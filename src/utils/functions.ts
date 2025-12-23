export const displayLikeCount = (count: number) => {
  if (count === 0) return
  if (count < 1000) return count.toString()
  if (count < 1000000) {
    if (count === 1000) {
      return '1K'
    } else {
      return (count / 1000).toFixed(1) + 'K'
    }
  }
  return (count / 1000000).toFixed(1) + 'M'
}
