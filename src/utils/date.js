import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js' // Import UTC plugin for timezone manipulation
import timezone from 'dayjs/plugin/timezone.js' // Import timezone plugin for timezone conversion

dayjs.extend(utc)
dayjs.extend(timezone)

export const getTimestampWithOffset = () => {
  const now = dayjs()

  const timestamp = now.unix()
  const offset = now.format('ZZ')
  const timestampWithOffset = `${timestamp} ${offset}`

  return timestampWithOffset
}
