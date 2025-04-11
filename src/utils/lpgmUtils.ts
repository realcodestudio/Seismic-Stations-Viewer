import { CSSProperties } from 'vue';

export function getLPGMStyle(LPGM: string): CSSProperties {
  // 长周期地震动等级对应的样式
  const styles: Record<string, CSSProperties> = {
    '4': {
      color: '#ffffff',
      backgroundColor: '#7301AC',
      borderColor: '#3a0077',
    },

    '3': {
      color: '#ffffff',
      backgroundColor: '#E60000',
      borderColor: '#cc297a',
    },

    '2': {
      color: '#ffffff',
      backgroundColor: '#31A35C',
      borderColor: '#cccc29',
    },

    '1': {
      color: '#ffffff',
      backgroundColor: '#1E6EE6',
      borderColor: '#29cc29',
    },

    '0': {
      color: '#ffffff',
      backgroundColor: '#3F3F3F',
      borderColor: '#cccccc',
    },
  };

  // 如果传入的LPGM不存在，则返回默认样式
  return styles[LPGM] || styles['0'];
}

