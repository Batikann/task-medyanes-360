//Projenin önem derecesine göre bazı css değişiklikleri yapıyoruz task özelinde
const checkPriority = (priority) => {
  switch (priority) {
    case 'LOW':
      return ' bg-[#CDFAD5] text-[#799351]  '
    case 'MEDIUM':
      return ' bg-[#FFCF96] text-[#FF9A00]'
    case 'HIGH':
      return ' bg-[#EF9595] text-[#FF0000] '
    default:
      return ''
  }
}

export default checkPriority
