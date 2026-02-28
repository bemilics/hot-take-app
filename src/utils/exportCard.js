import html2canvas from 'html2canvas'

export async function exportCard(element) {
  const canvas = await html2canvas(element, {
    scale: 2,           // calidad 2x
    useCORS: true,
    backgroundColor: null,
  })

  const link = document.createElement('a')
  link.download = 'mi-perfil-internet.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
