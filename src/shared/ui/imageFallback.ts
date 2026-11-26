export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
  event.currentTarget.onerror = null
  event.currentTarget.src = `${import.meta.env.BASE_URL}placeholder-cover.svg`
}
