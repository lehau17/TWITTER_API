export const enumToArray = (enumType: any) => {
  return Object.values(enumType).filter((value) => typeof value === 'number')
}
