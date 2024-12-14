import { CSSProperties } from 'vue';

export function getShindoStyle(shindo: string): CSSProperties {
  // JMA震度等级对应的样式
  const styles: Record<string, CSSProperties> = {
    '7': {
      color: '#ffffff',
      backgroundColor: '#4a0099',
      borderColor: '#3a0077',
    },
    '6強': {
      color: '#ffffff',
      backgroundColor: '#ff3399',
      borderColor: '#cc297a',
    },
    '6弱': {
      color: '#ffffff',
      backgroundColor: '#ff4444',
      borderColor: '#cc3636',
    },
    '5強': {
      color: '#ffffff',
      backgroundColor: '#ff9933',
      borderColor: '#cc7a29',
    },
    '5弱': {
      color: '#ffffff',
      backgroundColor: '#ffcc33',
      borderColor: '#cca329',
    },
    '4': {
      color: '#000000',
      backgroundColor: '#ffff33',
      borderColor: '#cccc29',
    },
    '3': {
      color: '#000000',
      backgroundColor: '#33ff33',
      borderColor: '#29cc29',
    },
    '2': {
      color: '#000000',
      backgroundColor: '#33ccff',
      borderColor: '#29a3cc',
    },
    '1': {
      color: '#000000',
      backgroundColor: '#cccccc',
      borderColor: '#a3a3a3',
    },
    '0': {
      color: '#ffffff',
      backgroundColor: '#3e3e3e',
      borderColor: '#ffffff',
    },
  };

  // 如果传入的震度等级不存在，则返回默认样式
  return styles[shindo] || styles['0'];
}


export function isSignificantShindo(shindo: string): boolean {
  // 震度3以上视为显著地震
  const significantLevels = ['3', '4', '5弱', '5強', '6弱', '6強', '7']
  return significantLevels.includes(shindo)
} 