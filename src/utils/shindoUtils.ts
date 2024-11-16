interface ShindoStyle {
  color: string;
  background: string;
  border: string;
}

export function getShindoStyle(shindo: string): ShindoStyle {
  // JMA震度等级对应的样式
  const styles: Record<string, ShindoStyle> = {
    '7': {
      color: '#ffffff',
      background: '#4a0099',
      border: '#3a0077'
    },
    '6+': {
      color: '#ffffff',
      background: '#ff3399',
      border: '#cc297a'
    },
    '6-': {
      color: '#ffffff',
      background: '#ff4444',
      border: '#cc3636'
    },
    '5+': {
      color: '#ffffff',
      background: '#ff9933',
      border: '#cc7a29'
    },
    '5-': {
      color: '#ffffff',
      background: '#ffcc33',
      border: '#cca329'
    },
    '4': {
      color: '#000000',
      background: '#ffff33',
      border: '#cccc29'
    },
    '3': {
      color: '#000000',
      background: '#33ff33',
      border: '#29cc29'
    },
    '2': {
      color: '#000000',
      background: '#33ccff',
      border: '#29a3cc'
    },
    '1': {
      color: '#000000',
      background: '#cccccc',
      border: '#a3a3a3'
    },
    '0': {
      color: '#000000',
      background: '#ffffff',
      border: '#cccccc'
    }
  }

  return styles[shindo] || styles['0']
}

export function isSignificantShindo(shindo: string): boolean {
  // 震度3以上视为显著地震
  const significantLevels = ['3', '4', '5-', '5+', '6-', '6+', '7']
  return significantLevels.includes(shindo)
} 