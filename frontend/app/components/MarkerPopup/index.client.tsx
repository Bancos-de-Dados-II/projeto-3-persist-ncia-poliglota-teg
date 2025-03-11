import { Popup, Marker } from "react-leaflet";
import { LatLng, type MarkerOptions } from "leaflet";
import { Icon } from "leaflet";
import type { MyIcon } from "~/types";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface MarkerCompProps {
  showPopupOnOpen?: boolean;
  position: [number, number] | LatLng;
  popupContent?: React.ReactNode | string;
  eventHandlers?: Record<string, Function>;
  draggable: boolean;
  icon: MyIcon;
}

const MarkerPopup = forwardRef<any | null, MarkerCompProps>(
  ({ position, popupContent, eventHandlers, draggable, icon }, ref) => {
    const markerRef = useRef<any | null>(null);

    useImperativeHandle(ref, () => markerRef.current);

    if (!position || (Array.isArray(position) && position.some((val) => val === undefined))) {
      console.error("Erro: posição inválida no MarkerPopup", position);
      return null; // Evita renderizar o marcador inválido
    }

    return (
      <Marker
        ref={markerRef}
        position={position}
        draggable={draggable}
        icon={new Icon({ iconUrl: icon.url, iconSize: icon.size })}
        eventHandlers={{
          ...eventHandlers,
        }}
      >
        <Popup>{popupContent}</Popup>
      </Marker>
    );
  }
);
export default MarkerPopup;

// export default function MarkerPopup({
//   position,
//   popupContent,
//   eventHandlers,
//   draggable,
//   icon,
// }: MarkerCompProps) {
//   const markerRef = useRef<L.Marker | null>(null);
//
//   return (
//     <Marker
//       ref={markerRef}
//       position={position}
//       draggable={draggable}
//       icon={new Icon({iconUrl: icon.url, iconSize: icon.size})}
//       eventHandlers={{
//         ...eventHandlers,
//       }}
//     >
//       <Popup >
//         {popupContent}
//       </Popup>
//     </Marker>
//   );
// }
