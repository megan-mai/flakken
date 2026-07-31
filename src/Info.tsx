// web/src/Info.tsx
import flakkenLogo from './assets/flakken_logo.png'

function Info() {
  return (
    <main className="flex h-full overflow-hidden items-center py-4 px-4 md:px-0 justify-center">
      <div className="text-black text-sm w-full md:w-[45vw]">
        <img src={flakkenLogo} alt="Flakken" className="w-[9vw] min-w-8 max-w-16 h-auto mx-auto mb-6" />
        <div className="flex flex-col gap-y-2 ">
          <p>
            Flakken is a Monthly Rotating Flag Art Show Curated and Presented by SAP Magazine and hosted at Market Gallery.
            </p>
          <p>
            Each month, a new artist is given a 4’ x 6’ white blank flag to transform as they wish. Whether embroidered, painted, cut, or otherwise altered, the artist’s creation will fly on a 20’ pole for one month, visible from the street, the roof itself, and the Manhattan Bridge. The piece will be exposed to the elements and the passage of time, natural weathering will become part of the artwork itself.
            </p>
          <p>
            At the beginning of each month, a “Flakken Change Ceremony” will mark the transition. People will gather to witness the raising of the new flag and the lowering of the previous. A musical guest will perform a rendition of “To the Color” during the retreat, a traditional lowering of the flag that signals respect for the chosen flag’s meaning.
            </p>
          <p className="italic text-[12px] py-4">
            The word "flag" first appeared in English in the late 15th century and, although its exact origin is uncertain, it may derive from Middle English flakken (“to flap, flutter”), ultimately from Old Norse flaka (“to flicker, flutter, hang loose”).
            </p>
        </div>
        <div className="flex md:justify-between mt-3">
          <div className="w-[50%]">
            <p>INQUIRIES</p>
            <p>max@sapmagazine.com</p>
          </div>
          <div className="w-[50%]">
            <p>CREDITS</p>
            <p className="md:text-nowrap">Tech Support by Mattias Lambert and Megan Mai</p>
            <p>Logo and lettering by Sammie Puralak</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Info
