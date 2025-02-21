import { createTheme } from 'tamagui'

// 活泼可爱的配色方案
export const lightTheme = createTheme({
  background: '#FFF0F7',      // 浅粉色背景
  backgroundHover: '#FFE5F1',
  backgroundPress: '#FFD6E8',
  backgroundFocus: '#FFE5F1',
  color: '#1A1523',          // 深色文字
  colorHover: '#2A1F37',
  colorPress: '#1A1523',
  colorFocus: '#2A1F37',
  borderColor: '#FFB8D9',    // 粉色边框
  borderColorHover: '#FF9EC7',
  borderColorFocus: '#FF9EC7',
  borderColorPress: '#FF85B9',
  shadowColor: '#FF9EC7',
  shadowColorHover: '#FF85B9',
  
  // 主要操作按钮的颜色
  primary: '#FF85B9',        // 粉色主色调
  primaryHover: '#FF6CA8',
  primaryPress: '#FF5299',
  primaryFocus: '#FF6CA8',
  
  // 次要操作按钮的颜色
  secondary: '#B8C0FF',      // 浅紫色
  secondaryHover: '#A3ADFF',
  secondaryPress: '#8E9AFF',
  secondaryFocus: '#A3ADFF',
  
  // 强调色
  accent: '#FFB8D9',
  accentHover: '#FF9EC7',
  accentPress: '#FF85B9',
  accentFocus: '#FF9EC7',
})

export const darkTheme = createTheme({
  background: '#2A1F37',      // 深紫色背景
  backgroundHover: '#352842',
  backgroundPress: '#40314D',
  backgroundFocus: '#352842',
  color: '#FFE5F1',          // 浅色文字
  colorHover: '#FFD6E8',
  colorPress: '#FFE5F1',
  colorFocus: '#FFD6E8',
  borderColor: '#FF85B9',    // 深粉色边框
  borderColorHover: '#FF6CA8',
  borderColorFocus: '#FF6CA8',
  borderColorPress: '#FF5299',
  shadowColor: '#FF6CA8',
  shadowColorHover: '#FF5299',
  
  // 主要操作按钮的颜色
  primary: '#FF85B9',        // 粉色主色调
  primaryHover: '#FF6CA8',
  primaryPress: '#FF5299',
  primaryFocus: '#FF6CA8',
  
  // 次要操作按钮的颜色
  secondary: '#B8C0FF',      // 浅紫色
  secondaryHover: '#A3ADFF',
  secondaryPress: '#8E9AFF',
  secondaryFocus: '#A3ADFF',
  
  // 强调色
  accent: '#FFB8D9',
  accentHover: '#FF9EC7',
  accentPress: '#FF85B9',
  accentFocus: '#FF9EC7',
}) 