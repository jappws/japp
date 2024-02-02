import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex justify-center items-center'>
      <h2>404: Page non trouvé</h2>
      <p>Impossible de trouver la ressource demandée</p>
      <Link href="/">Rentrer à la maison</Link>
    </div>
  )
}