// web/src/Info.tsx
import flakkenLogo from './assets/flakken_logo.png'

function Info() {
  return (
    <main className="flex h-full overflow-hidden items-center py-4 px-6 md:px-0 justify-center">
      <div className="text-black text-sm w-full md:w-[45vw] space-y-8">
        <img src={flakkenLogo} alt="Flakken" className="h-12 w-auto mx-auto" />
        <div className="flex flex-col gap-y-4">
          <p>
            Flakken is a Monthly Rotating Flag Art Show Curated and Presented by SAP Magazine and hosted at Market Gallery.
            </p>
          <p>
            Each month, a new artist is given a 4’ x 6’ white blank flag to transform as they wish. Whether embroidered, painted, cut, or otherwise altered, the artist’s creation will fly on a 20’ pole for one month, visible from the street, the roof itself, and the Manhattan Bridge. The piece will be exposed to the elements and the passage of time, natural weathering will become part of the artwork itself.
            </p>
          <p>
            At the beginning of each month, a “Flakken Change Ceremony” will mark the transition. People will gather to witness the raising of the new flag and the lowering of the previous. A musical guest will perform a rendition of “To the Color” during the retreat, a traditional lowering of the flag that signals respect for the chosen flag’s meaning.
            </p>
        </div>
        <div className="flex md:justify-between">
          <div className="w-[50%]">
            <p>INQUIRIES</p>
            <p>Max@Sapmagazine.com</p>
          </div>
          <div className="w-[50%]">
            <p>CREDITS</p>
            <p>Website development by Mattias Lambert</p>
            <p>Logo and lettering by Sammie Puralak</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Info
