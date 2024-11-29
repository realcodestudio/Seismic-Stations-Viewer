interface IntensityStyle {
  color: string;
  background: string;
  border: string;
}

export function getIntensityStyle(intensity: string): IntensityStyle {
  // 烈度等级对应的样式
  const styles: Record<string, IntensityStyle> = {
    '12': {
      color: '#ffffff',
      background: '#4B0074',
      border: '#3a0077'
    },
    '11': {
      color: '#ffffff',
      background: '#5D0090',
      border: '#3a0077'
    },
    '10': {
      color: '#ffffff',
      background: '#7301AC',
      border: '#3a0077'
    },   
    '9': {
      color: '#ffffff',
      background: '#A00000',
      border: '#3a0077'
    },
    '8': {
      color: '#ffffff',
      background: '#E60000',
      border: '#cc297a'
    },
    '7': {
      color: '#ffffff',
      background: '#E69D1C',
      border: '#cc3636'
    },
    '6': {
      color: '#ffffff',
      background: '#E1C755',
      border: '#cc7a29'
    },
    '5': {
      color: '#ffffff',
      background: '#1B8242',
      border: '#cca329'
    },
    '4': {
      color: '#ffffff',
      background: '#31A35C',
      border: '#cccc29'
    },
    '3': {
      color: '#ffffff',
      background: '#1E6EE6',
      border: '#29cc29'
    },
    '2': {
      color: '#ffffff',
      background: '#6B7878',
      border: '#29a3cc'
    },
    '1': {
      color: '#ffffff',
      background: '#3F3F3F',
      border: '#a3a3a3'
    },
    '0': {
      color: '#ffffff',
      background: '#3F3F3F',
      border: '#cccccc'
    }
  }

  return styles[intensity] || styles['0']
}

export function isSignificantIntensity(Intensity: string): boolean {
  // 烈度3以上视为显著地震
  const significantLevels = ['3', '4', '5', '6', '7', '8', '9','10','11','12']
  return significantLevels.includes(Intensity)
} 